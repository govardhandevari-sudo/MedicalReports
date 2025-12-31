import { useNavigate } from "react-router-dom";
import { useReport } from "../hooks/useReport";

export default function PaymentModeReport() {
  const navigate = useNavigate();

  const { data, loading } = useReport(
    "/reports/payment-mode",
    {}
  );

  if (loading) return <div>Loading payment modes...</div>;

  return (
    <div>
      <h2>Payment Mode Report</h2>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Payment Mode</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((r: any, i: number) => (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/reports/payment-mode/receipts", {
                  state: { paymentModeId: r.PaymentModeId }
                })
              }
            >
              <td>{r.PaymentMode}</td>
              <td>{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
