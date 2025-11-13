import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu/[id] - Get a specific menu item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        modifiers: true,
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu item" },
      { status: 500 }
    );
  }
}

// PUT /api/menu/[id] - Update a menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (nameDE !== undefined) data.nameDE = nameDE;
    if (nameFR !== undefined) data.nameFR = nameFR;
    if (nameIT !== undefined) data.nameIT = nameIT;
    if (description !== undefined) data.description = description;
    if (descriptionDE !== undefined) data.descriptionDE = descriptionDE;
    if (descriptionFR !== undefined) data.descriptionFR = descriptionFR;
    if (descriptionIT !== undefined) data.descriptionIT = descriptionIT;
    if (price !== undefined) data.price = price;
    if (vatRate !== undefined) data.vatRate = vatRate;
    if (image !== undefined) data.image = image;
    if (allergens !== undefined) data.allergens = allergens;
    if (available !== undefined) data.available = available;
    if (preparationTime !== undefined) data.preparationTime = preparationTime;
    if (categoryId !== undefined) data.categoryId = categoryId;

    const menuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data,
      include: {
        category: true,
        modifiers: true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
