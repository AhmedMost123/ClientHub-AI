import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DashboardTimeRange } from "@/lib/types/dashboard";
import { TIME_RANGE_LABELS } from "@/lib/types/dashboard";
import type {
  DashboardStats,
  RecentInvoiceItem,
  ActivityItem,
} from "@/lib/actions/dashboard/get-dashboard-data";
import { format } from "date-fns";

type ExportData = {
  userName: string;
  stats: DashboardStats | null;
  invoices: RecentInvoiceItem[];
  activities: ActivityItem[];
  activeProjectsCount: number;
};

export function exportDashboardPdf(data: ExportData, selectedRange: DashboardTimeRange) {
  // Initialize jsPDF
  const doc = new jsPDF();
  // Basic styles
  const marginX = 14;
  let currentY = 20;

  // 1. Header Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("ClientHub AI", marginX, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Freelancer: ${data.userName}`, marginX, currentY + 8);
  doc.text(`Generated: ${format(new Date(), "PPpp")}`, marginX, currentY + 14);
  doc.text(`Time Range: ${TIME_RANGE_LABELS[selectedRange]}`, marginX, currentY + 20);
  
  currentY += 32;

  // 2. Summary Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Summary", marginX, currentY);
  
  currentY += 8;

  const statsBody = [
    ["Revenue", `$${(data.stats?.revenueThisMonth ?? 0).toLocaleString()}`],
    ["Active Projects", `${data.activeProjectsCount}`],
    ["Pending Invoices", `${data.stats?.pendingInvoicesCount ?? 0}`],
    ["Estimated Billable Hours", `${data.stats?.billableHoursEstimated ?? 0}h`],
  ];

  autoTable(doc, {
    startY: currentY,
    head: [["Metric", "Value"]],
    body: statsBody,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: marginX },
  });

  // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
  currentY = doc.lastAutoTable.finalY + 14;

  // 3. Recent Invoices Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Recent Invoices", marginX, currentY);
  
  currentY += 8;

  if (data.invoices.length > 0) {
    const invoiceBody = data.invoices.map((inv) => [
      inv.invoiceNumber,
      inv.customerName,
      `$${inv.amount.toLocaleString()}`,
      inv.status,
      inv.dueDate ? format(new Date(inv.dueDate), "PP") : "N/A",
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Invoice", "Client", "Amount", "Status", "Due Date"]],
      body: invoiceBody,
      theme: "striped",
      headStyles: { fillColor: [46, 204, 113] },
      margin: { left: marginX },
    });
    
    // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
    currentY = doc.lastAutoTable.finalY + 14;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No recent invoices found.", marginX, currentY);
    doc.setTextColor(0, 0, 0);
    currentY += 10;
  }

  // 4. Recent Activity Section
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Recent Activity", marginX, currentY);
  
  currentY += 8;

  if (data.activities.length > 0) {
    const activityBody = data.activities.map((act) => [
      format(new Date(act.createdAt), "PPp"),
      act.title,
      act.message || "-",
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Date", "Title", "Message"]],
      body: activityBody,
      theme: "plain",
      styles: { cellPadding: 2, fontSize: 9 },
      headStyles: { fontStyle: "bold" },
      margin: { left: marginX },
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No recent activity found.", marginX, currentY);
    doc.setTextColor(0, 0, 0);
  }

  // Save the PDF
  doc.save(`Dashboard_Report_${data.userName.replace(/\s+/g, "_")}_${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
