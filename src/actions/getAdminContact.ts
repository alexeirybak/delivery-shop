"use server";

import { getDB } from "../../utils/api-routes";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

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
