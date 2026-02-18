"use server";

import { getDB } from "../../utils/api-routes";

function formatPhoneNumber(phone: string): string {
  if (!phone) return "+7 (999) 123-45-67";

  if (phone.startsWith("7")) {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
    }
  }

  return phone;
}

export async function getAdminContact() {
  try {
    const db = await getDB();

    const admin = await db.collection("user").findOne(
      { role: "admin" },
      {
        projection: {
          email: 1,
          phoneNumber: 1,
        },
      },
    );

    if (!admin) {
      return {
        email: "admin@example.com",
        phone: "+7 (999) 123-45-67",
      };
    }

    const formattedPhone = formatPhoneNumber(admin.phoneNumber || "");

    return {
      email: admin.email,
      phone: formattedPhone,
    };
  } catch (error) {
    console.error("Ошибка получения контактов администратора:", error);
    return {
      email: "admin@example.com",
      phone: "+7 (999) 123-45-67",
    };
  }
}
