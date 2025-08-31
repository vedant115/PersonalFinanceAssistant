import { prisma } from "../config/db.js";

// 1. Get KPI data (Total Income, Expenses, and Net Balance)
export const getKpiData = async (userId, duration = null) => {
  const whereClause = { userId };

  if (duration) {
    const now = new Date();
    let startDate;

    switch (duration) {
      case "1month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case "3months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
      case "6months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        );
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      whereClause.date = {
        gte: startDate,
      };
    }
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
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
export const getBreakdownByCategory = async (userId, duration = null) => {
  const whereClause = { userId, category: { not: null } };

  if (duration) {
    const now = new Date();
    let startDate;

    switch (duration) {
      case "1month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case "3months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
      case "6months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        );
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      whereClause.date = {
        gte: startDate,
      };
    }
  }

  const breakdown = await prisma.transaction.groupBy({
    by: ["type", "category"],
    _sum: { amount: true },
    where: whereClause,
  });

  return breakdown.map((item) => ({
    type: item.type,
    category: item.category,
    total: parseFloat(item._sum.amount),
  }));
};

// 3. Get data for the Monthly Trend Bar Chart
export const getMonthlyTrend = async (userId, duration = null) => {
  let baseQuery = `
    SELECT
      DATE_TRUNC('month', "date") as month,
      "type",
      SUM("amount") as total
    FROM "Transaction"
    WHERE "userId" = $1
  `;

  const params = [userId];

  if (duration) {
    const now = new Date();
    let startDate;

    switch (duration) {
      case "1month":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        break;
      case "3months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
      case "6months":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 6,
          now.getDate()
        );
        break;
      default:
        startDate = null;
    }

    if (startDate) {
      baseQuery += ` AND "date" >= $2`;
      params.push(startDate);
    }
  }

  baseQuery += `
    GROUP BY month, "type"
    ORDER BY month ASC
  `;

  const trends = await prisma.$queryRawUnsafe(baseQuery, ...params);
  return trends;
};

// 4. Get recent transactions for dashboard
export const getRecentTransactions = async (userId, limit = 5) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      description: true,
      date: true,
    },
  });

  return transactions;
};
