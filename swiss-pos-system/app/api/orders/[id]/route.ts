import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, notes, discountAmount } = body;

    const data: any = {};
    if (status !== undefined) {
      data.status = status as OrderStatus;
      if (status === "PAID") {
        data.completedAt = new Date();
      }
    }
    if (notes !== undefined) data.notes = notes;
    if (discountAmount !== undefined) {
      data.discountAmount = discountAmount;
      // Recalculate total
      const order = await prisma.order.findUnique({
        where: { id: params.id },
      });
      if (order) {
        data.total = parseFloat(order.subtotal.toString()) +
                      parseFloat(order.vatAmount.toString()) -
                      discountAmount;
      }
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
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

    // If order is completed/paid, update table status
    if (status === "PAID" && order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: {
          status: "AVAILABLE",
          currentOrder: null,
        },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Cancel an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
        completedAt: new Date(),
      },
      include: {
        table: true,
      },
    });

    // Update table status if dine-in
    if (order.tableId) {
      await prisma.table.update({
        where: { id: order.tableId },
        data: {
          status: "AVAILABLE",
          currentOrder: null,
        },
      });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
