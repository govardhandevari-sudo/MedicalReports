import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiagnosticDashboard from "./diagnostic-dashboard";
import RevenueDepartmentReport from "./reports/RevenueDepartmentReport";
import RevenueDepartmentTests from "./reports/RevenueDepartmentTests";
import SalesSummaryReport from "./reports/SalesSummaryReport";
import SalesTestsReport from "./reports/SalesTestsReport";
import PaymentModeReport from "./reports/PaymentModeReport";
import PaymentModeReceipts from "./reports/PaymentModeReceipts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiagnosticDashboard />} />
        <Route path="/reports/revenue/department" element={<RevenueDepartmentReport />} />
        <Route path="/reports/revenue/department/tests" element={<RevenueDepartmentTests />} />
        <Route path="/reports/sales/summary" element={<SalesSummaryReport />} />
        <Route path="/reports/sales/tests" element={<SalesTestsReport />} />        
        <Route path="/reports/payment-mode" element={<PaymentModeReport />} />
        <Route path="/reports/payment-mode/receipts" element={<PaymentModeReceipts />} />
      </Routes>
    </BrowserRouter>
  );
}
