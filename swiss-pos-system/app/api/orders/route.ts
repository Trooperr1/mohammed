import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber, calculateVAT } from "@/lib/utils";
import { OrderStatus, OrderType } from "@prisma/client";

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const tableId = searchParams.get("tableId");
    const date = searchParams.get("date");

    const where: any = {};
    if (status) where.status = status as OrderStatus;
    if (type) where.type = type as OrderType;
    if (tableId) where.tableId = tableId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        waiter: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      tableId,
      waiterId,
      customerName,
      customerPhone,
      notes,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must have at least one item" },
        { status: 400 }
      );
    }

    // Calculate order totals
    let subtotal = 0;
    let vatAmount = 0;

    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });

        if (!menuItem) {
          throw new Error(`Menu item ${item.menuItemId} not found`);
        }

        const itemSubtotal = parseFloat(menuItem.price.toString()) * item.quantity;
        const itemVAT = calculateVAT(itemSubtotal, menuItem.vatRate);

        subtotal += itemSubtotal;
        vatAmount += itemVAT;

        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: menuItem.price,
          vatRate: menuItem.vatRate,
          modifiers: item.modifiers || [],
          notes: item.notes,
          subtotal: itemSubtotal,
        };
      })
    );

    const total = subtotal + vatAmount;
    const orderNumber = generateOrderNumber();

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        type: type || "DINE_IN",
        tableId,
        waiterId,
        customerName,
        customerPhone,
        notes,
        subtotal,
        vatAmount,
        discountAmount: 0,
        total,
        status: "NEW",
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        table: true,
        waiter: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        payments: true,
      },
    });

    // Update table status if dine-in
    if (tableId) {
      await prisma.table.update({
        where: { id: tableId },
        data: {
          status: "OCCUPIED",
          currentOrder: order.id,
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
