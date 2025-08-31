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

export const getTransactionsByUser = async (userId, query) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      search,
    } = query;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    const where = { userId };

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (search) {
      where.description = {
        contains: search,
        mode: "insensitive",
      };
    }
    const orderBy = {};
    const allowedSortFields = ["date", "amount", "createdAt", "updatedAt"];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder || "desc";
    } else {
      orderBy.date = "desc";
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const total = await prisma.transaction.count({ where });

    return { transactions, total };
  } catch (error) {
    console.error(error);
    throw error;
  }
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

export const updateTransaction = async (id, data, userId) => {
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  if (existingTransaction.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const allowedFields = ["amount", "type", "category", "description", "date"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const transaction = await prisma.transaction.update({
    where: { id },
    data: updateData,
  });

  return transaction;
};

export const deleteTransaction = async (id, userId) => {
  const existingTransaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!existingTransaction) {
    throw new Error("Transaction not found");
  }

  if (existingTransaction.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return true;
};
