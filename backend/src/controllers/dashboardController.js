import * as dashboardService from "../services/dashboardService.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { duration } = req.query;

    // Fetch all data points in parallel for efficiency
    const [kpiData, categoryBreakdown, monthlyTrend, recentTransactions] =
      await Promise.all([
        dashboardService.getKpiData(userId, duration),
        dashboardService.getBreakdownByCategory(userId, duration),
        dashboardService.getMonthlyTrend(userId, duration),
        dashboardService.getRecentTransactions(userId, 5),
      ]);

    res.status(200).json({
      kpiData,
      categoryBreakdown,
      monthlyTrend,
      recentTransactions,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res
      .status(500)
      .send({ message: "Error fetching dashboard data", error: error.message });
  }
};
