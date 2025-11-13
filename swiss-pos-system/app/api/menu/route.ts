import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu - Get all menu items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const available = searchParams.get("available");
    const search = searchParams.get("search");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (available !== null) where.available = available === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nameDE: { contains: search, mode: "insensitive" } },
        { nameFR: { contains: search, mode: "insensitive" } },
        { nameIT: { contains: search, mode: "insensitive" } },
      ];
    }

    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        category: true,
        modifiers: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

// POST /api/menu - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nameDE,
      nameFR,
      nameIT,
      description,
      descriptionDE,
      descriptionFR,
      descriptionIT,
      price,
      vatRate,
      image,
      allergens,
      available,
      preparationTime,
      categoryId,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        nameDE,
        nameFR,
        nameIT,
        description,
        descriptionDE,
        descriptionFR,
        descriptionIT,
        price,
        vatRate: vatRate || "STANDARD",
        image,
        allergens: allergens || [],
        available: available !== false,
        preparationTime,
        categoryId,
      },
      include: {
        category: true,
        modifiers: true,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
