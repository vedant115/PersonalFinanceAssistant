import { prisma } from "../config/db.js";

// 1. Get KPI data (Total Income, Expenses, and Net Balance)
export const getKpiData = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { type: true, amount: true },
  });

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

// 2. Get data for the Category Doughnut Chart (both income and expenses)
export const getBreakdownByCategory = async (userId) => {
  const breakdown = await prisma.transaction.groupBy({
    by: ["type", "category"],
    _sum: { amount: true },
    where: { userId, category: { not: null } }, // Only include transactions with a category
  });

  return breakdown.map((item) => ({
    type: item.type,
    category: item.category,
    total: parseFloat(item._sum.amount),
  }));
};

// 3. Get data for the Monthly Trend Bar Chart
export const getMonthlyTrend = async (userId) => {
  // Prisma's groupBy doesn't easily support grouping by month from a DateTime,
  // so a raw query is the most direct way to achieve this.
  const trends = await prisma.$queryRaw`
    SELECT
      DATE_TRUNC('month', "date") as month,
      "type",
      SUM("amount") as total
    FROM "Transaction"
    WHERE "userId" = ${userId}
    GROUP BY month, "type"
    ORDER BY month ASC
  `;
  return trends;
};
