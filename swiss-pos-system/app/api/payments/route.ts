import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

// GET /api/payments - Get all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const method = searchParams.get("method");
    const status = searchParams.get("status");

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (method) where.method = method as PaymentMethod;
    if (status) where.status = status as PaymentStatus;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            table: true,
            waiter: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, method, transactionRef, cardLast4 } = body;

    if (!orderId || !amount || !method) {
      return NextResponse.json(
        { error: "Order ID, amount, and payment method are required" },
        { status: 400 }
      );
    }

    // Verify order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: method as PaymentMethod,
        status: "COMPLETED",
        transactionRef,
        cardLast4,
      },
      include: {
        order: {
          include: {
            table: true,
            waiter: true,
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    // Check if order is fully paid
    const totalPaid = await prisma.payment.aggregate({
      where: {
        orderId,
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    });

    const paidAmount = parseFloat(totalPaid._sum.amount?.toString() || "0");
    const orderTotal = parseFloat(order.total.toString());

    // If fully paid, update order status
    if (paidAmount >= orderTotal) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          completedAt: new Date(),
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
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
