import { prisma } from "../config/db.js";

export const createTransaction = async (data, userId) => {
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
  });
  //  console.log(transaction + "hello" + userId);
  return transaction;
};
export const getTransactionsByUser = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return transactions;
};
export const getTransactionById = async (id, userId) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  if (transaction.userId !== userId) {
    throw new Error("Unauthorized");
  }
  return transaction;
};
