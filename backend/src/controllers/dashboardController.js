import * as dashboardService from "../services/dashboardService.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all data points in parallel for efficiency
    const [kpiData, categoryBreakdown, monthlyTrend] = await Promise.all([
      dashboardService.getKpiData(userId),
      dashboardService.getBreakdownByCategory(userId),
      dashboardService.getMonthlyTrend(userId),
    ]);

    res.status(200).json({
      kpiData,
      categoryBreakdown,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res
      .status(500)
      .send({ message: "Error fetching dashboard data", error: error.message });
  }
};
