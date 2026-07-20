export type DashboardTimeRange =
  | "this_month"
  | "last_3_months"
  | "last_6_months"
  | "year_to_date"
  | "all_time";

export const TIME_RANGE_LABELS: Record<DashboardTimeRange, string> = {
  this_month: "This Month",
  last_3_months: "Last 3 Months",
  last_6_months: "Last 6 Months",
  year_to_date: "Year to Date",
  all_time: "All Time",
};
