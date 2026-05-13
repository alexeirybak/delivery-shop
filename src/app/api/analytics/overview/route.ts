import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { CollectionType } from "@/app/(user-part)/user-dashboard/types";
import { ObjectId } from "mongodb";
import { collections } from "../../utils/collections";

type MaterialRequiredFields = {
  _id: ObjectId;
  mode?: string;
  createdAt?: Date;
};

interface MaterialWithSource extends MaterialRequiredFields {
  sourceType: CollectionType;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const userId = await getAuthenticatedUserId(request.headers);

    const allCollectionsData = await Promise.all(
      collections.map(async (collectionName) => {
        const data = await db
          .collection<MaterialRequiredFields>(collectionName)
          .find({ userId })
          .project({ _id: 1, mode: 1, createdAt: 1 })
          .toArray();

        return data.map((item) => ({
          ...item,
          sourceType: collectionName,
        })) as MaterialWithSource[];
      }),
    );

    const allMaterials = allCollectionsData.flat();

    const materialIds = allMaterials.map((m) => m._id.toString());
    let totalMessages = 0;

    for (const materialId of materialIds) {
      const count = await db
        .collection("messages")
        .countDocuments({ chatId: materialId });
      totalMessages += count;
    }

    const modeStats: Record<string, number> = {};
    for (const material of allMaterials) {
      const mode = material.mode || "default";
      modeStats[mode] = (modeStats[mode] || 0) + 1;
    }

    const typeStats: Record<string, number> = {};
    for (const material of allMaterials) {
      const type = material.sourceType;
      typeStats[type] = (typeStats[type] || 0) + 1;
    }

    const activeDaysSet = new Set<string>();
    for (const material of allMaterials) {
      if (material.createdAt) {
        activeDaysSet.add(material.createdAt.toISOString().split("T")[0]);
      }
    }

    const last7Days: string[] = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const activityByDay = last7Days.map((date) => {
      const count = allMaterials.filter((item) => {
        if (!item.createdAt) return false;
        return item.createdAt.toISOString().split("T")[0] === date;
      }).length;

      return { date, count };
    });

    return NextResponse.json({
      totalMaterials: allMaterials.length,
      totalMessages: totalMessages,
      activeDays: activeDaysSet.size,
      modeStats,
      typeStats,
      activityByDay,
    });
  } catch (error) {
    console.error("Ошибка аналитики:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
