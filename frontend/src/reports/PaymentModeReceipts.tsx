import { useLocation } from "react-router-dom";
import { useReport } from "../hooks/useReport";

export default function PaymentModeReceipts() {
  const location = useLocation();
  const { paymentModeId } = location.state || {};

  const { data, loading } = useReport(
    "/reports/payment-mode/receipts",
    { paymentModeId }
  );

  if (!paymentModeId) return <div>No payment mode selected</div>;
  if (loading) return <div>Loading receipts...</div>;

  return (
    <div>
      <h2>Payment Mode → Receipts</h2>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Receipt No</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((r: any, i: number) => (
            <tr key={i}>
              <td>{r.ReceiptNo}</td>
              <td>{r.Amount}</td>
              <td>{r.EntryDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
