import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TableStatus } from "@prisma/client";

// GET /api/tables/[id] - Get a specific table
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          where: {
            status: {
              in: ["NEW", "PREPARING", "READY", "SERVED"],
            },
          },
          include: {
            orderItems: {
              include: {
                menuItem: true,
              },
            },
            waiter: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error("Error fetching table:", error);
    return NextResponse.json(
      { error: "Failed to fetch table" },
      { status: 500 }
    );
  }
}

// PUT /api/tables/[id] - Update a table
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, section, capacity, x, y, currentOrder } = body;

    const data: any = {};
    if (status) data.status = status as TableStatus;
    if (section !== undefined) data.section = section;
    if (capacity) data.capacity = capacity;
    if (x !== undefined) data.x = x;
    if (y !== undefined) data.y = y;
    if (currentOrder !== undefined) data.currentOrder = currentOrder;

    const table = await prisma.table.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json(
      { error: "Failed to update table" },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/[id] - Delete a table
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.table.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json(
      { error: "Failed to delete table" },
      { status: 500 }
    );
  }
}
