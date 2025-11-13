import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TableStatus } from "@prisma/client";

// GET /api/tables - Get all tables
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const status = searchParams.get("status");

    const where: any = {};
    if (section) where.section = section;
    if (status) where.status = status as TableStatus;

    const tables = await prisma.table.findMany({
      where,
      include: {
        orders: {
          where: {
            status: {
              in: ["NEW", "PREPARING", "READY", "SERVED"],
            },
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

// POST /api/tables - Create a new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { number, capacity, section, x, y } = body;

    if (!number || !capacity) {
      return NextResponse.json(
        { error: "Table number and capacity are required" },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
      data: {
        number,
        capacity,
        section,
        x,
        y,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
}
