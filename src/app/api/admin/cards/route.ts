import { NextRequest, NextResponse } from "next/server";
import { FilterType } from "@/app/(admin)/administrator/cards/types/cards.types";
import { getDB } from "../../../../../utils/api-routes";

interface CardFilter {
  isActive?: boolean;
  cardNumber?: { $regex: string; $options: string };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    
    const filter = searchParams.get("filter") as FilterType || "all";
    const searchCardNumber = searchParams.get("searchCardNumber") || "";
    const searchOwner = searchParams.get("searchOwner") || "";

    const db = await getDB();

    let userIds: string[] = [];
    if (searchOwner) {
      const users = await db
        .collection("user")
        .find({
          $or: [
            { surname: { $regex: searchOwner, $options: "i" } },
            { name: { $regex: searchOwner, $options: "i" } },
            { phoneNumber: { $regex: searchOwner, $options: "i" } }
          ]
        })
        .project({ _id: 1 })
        .toArray();

      userIds = users.map((u) => u._id.toString());

      if (userIds.length === 0) {
        return NextResponse.json({
          cards: [],
          totalPages: 0,
          totalItems: 0,
          totalAllItems: await db.collection("cards").countDocuments(),
        });
      }
    }

    const cardFilter: CardFilter = {};

    if (filter === "active") {
      cardFilter.isActive = true;
    } else if (filter === "inactive") {
      cardFilter.isActive = false;
    }

    if (searchCardNumber) {
      const cleanSearch = searchCardNumber.replace(/\s/g, "");
      cardFilter.cardNumber = { $regex: cleanSearch, $options: "i" };
    }

    const allCards = await db
      .collection("cards")
      .find(cardFilter)
      .sort({ order: 1 })
      .toArray();

    const cardsWithOwners = await Promise.all(
      allCards.map(async (card) => {
        const user = await db.collection("user").findOne({ 
          card: card.cardNumber 
        });
        
        return {
          _id: card._id.toString(),
          cardNumber: card.cardNumber,
          order: card.order,
          createdAt: card.createdAt,
          isActive: card.isActive,
          deactivatedAt: card.deactivatedAt,
          owner: user ? {
            id: user._id.toString(),
            name: user.name,
            surname: user.surname,
            phoneNumber: user.phoneNumber
          } : null
        };
      })
    );

    let filteredCards = cardsWithOwners;
    
    if (filter === "free") {
      filteredCards = cardsWithOwners.filter(card => !card.owner);
    } else if (filter === "assigned") {
      filteredCards = cardsWithOwners.filter(card => card.owner);
    }

    if (searchOwner && userIds.length > 0) {
      filteredCards = filteredCards.filter(card => 
        card.owner !== null && userIds.includes(card.owner.id)
      );
    }

    const totalFiltered = filteredCards.length;
    const totalAll = await db.collection("cards").countDocuments();

    const skip = (page - 1) * limit;
    const paginatedCards = filteredCards.slice(skip, skip + limit);

    return NextResponse.json({
      cards: paginatedCards,
      totalPages: Math.ceil(totalFiltered / limit),
      totalItems: totalFiltered,
      totalAllItems: totalAll,
      currentPage: page
    });

  } catch (error) {
    console.error("Ошибка API карт:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const { cardNumber } = await request.json();

    if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
      return NextResponse.json(
        { message: "Номер карты должен содержать 16 цифр" },
        { status: 400 }
      );
    }

    const existingCard = await db.collection("cards").findOne({ cardNumber });
    
    if (existingCard) {
      return NextResponse.json(
        { message: "Карта с таким номером уже существует" },
        { status: 400 }
      );
    }

    const lastCard = await db
      .collection("cards")
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    const nextOrder = lastCard.length > 0 ? lastCard[0].order + 1 : 1;

    const newCard = {
      cardNumber,
      order: nextOrder,
      createdAt: new Date(),
      isActive: false,
    };

    const result = await db.collection("cards").insertOne(newCard);

    return NextResponse.json(
      { 
        success: true, 
        card: { ...newCard, _id: result.insertedId, owner: null },
        message: "Карта успешно добавлена" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при добавлении карты:", error);
    return NextResponse.json(
      { message: "Ошибка при добавлении карты" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const cardNumber = searchParams.get("cardNumber");
    const action = searchParams.get("action");

    if (!cardNumber || !action) {
      return NextResponse.json(
        { message: "Не указан номер карты или действие" },
        { status: 400 }
      );
    }

    const card = await db.collection("cards").findOne({ cardNumber });
    
    if (!card) {
      return NextResponse.json(
        { message: "Карта не найдена" },
        { status: 404 }
      );
    }

    if (action === "activate") {
      await db.collection("cards").updateOne(
        { cardNumber },
        { 
          $set: { 
            isActive: true,
            deactivatedAt: null,
            activatedAt: new Date()
          } 
        }
      );

      return NextResponse.json(
        { success: true, message: "Карта активирована" },
        { status: 200 }
      );
    }

    if (action === "deactivate") {
      await db.collection("cards").updateOne(
        { cardNumber },
        { 
          $set: { 
            isActive: false,
            deactivatedAt: new Date()
          } 
        }
      );

      return NextResponse.json(
        { success: true, message: "Карта деактивирована" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Неверное действие" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Ошибка при обновлении карты:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении карты" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const cardNumber = searchParams.get("cardNumber");

    if (!cardNumber) {
      return NextResponse.json(
        { message: "Не указан номер карты" },
        { status: 400 }
      );
    }

    const userWithCard = await db.collection("user").findOne({ card: cardNumber });
    
    if (userWithCard) {
      await db.collection("user").updateOne(
        { _id: userWithCard._id },
        { $unset: { card: "" } }
      );
    }

    const result = await db.collection("cards").deleteOne({ cardNumber });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Карта не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: userWithCard 
          ? "Карта удалена и отвязана от пользователя" 
          : "Карта удалена" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении карты:", error);
    return NextResponse.json(
      { message: "Ошибка при удалении карты" },
      { status: 500 }
    );
  }
}