import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { getThreeDaysDates } from "@/app/(admin)/administrator/delivery-times/utils/getThreeDaysDates";

export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const deliverySettings = await db.collection("delivery-times").findOne({});

    if (!deliverySettings) {
      return NextResponse.json({
        success: false,
        message: "Настройки доставки не найдены",
      });
    }

    const currentSchedule = deliverySettings.schedule || {};

    const newDates = getThreeDaysDates();
    const currentDates = Object.keys(currentSchedule);

    const datesToRemove = currentDates.filter(
      (date) => !newDates.includes(date)
    );
    const datesToAdd = newDates.filter((date) => !currentDates.includes(date));

    const updatedSchedule = { ...currentSchedule };

    datesToRemove.forEach((date) => {
      delete updatedSchedule[date];
    });

    datesToAdd.forEach((newDate) => {
      const prevDate = new Date(newDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split("T")[0];

      if (updatedSchedule[prevDateStr]) {
        updatedSchedule[newDate] = { ...updatedSchedule[prevDateStr] };
      } else {
        updatedSchedule[newDate] = {
          "08:00-14:00": true,
          "14:00-18:00": true,
          "18:00-20:00": true,
          "20:00-22:00": true,
        };
      }
    });

    await db.collection("delivery-times").updateOne(
      {},
      {
        $set: {
          schedule: updatedSchedule,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Расписание обновлено. Добавлены даты: ${datesToAdd.join(", ")}, удалены даты: ${datesToRemove.join(", ")}`,
      addedDates: datesToAdd,
      removedDates: datesToRemove,
      currentDates: Object.keys(updatedSchedule),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Ошибка cron:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
