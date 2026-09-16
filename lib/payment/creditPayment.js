import { prisma } from "../prisma";

export async function creditPaymentCoins(paymentId) {
  return await prisma.$transaction(async (tx) => {
    // Find payment
    const payment = await tx.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Already credited?
    const existingTransaction = await tx.coinTransaction.findUnique({
      where: {
        paymentId: payment.id,
      },
    });

    if (existingTransaction) {
      return {
        alreadyCredited: true,
        coins: payment.coins,
        transactionId: existingTransaction.id,
      };
    }

    // Credit coins to user
    await tx.user.update({
      where: {
        id: payment.userId,
      },
      data: {
        coins: {
          increment: payment.coins,
        },
      },
    });

    // Create credit transaction
    const coinTransaction = await tx.coinTransaction.create({
      data: {
        userId: payment.userId,
        amount: payment.coins,
        type: "credit",
        description: `${payment.coins} coins purchased - ${payment.planId}`,
        paymentId: payment.id,
      },
    });

    return {
      alreadyCredited: false,
      coins: payment.coins,
      transactionId: coinTransaction.id,
    };
  });
}