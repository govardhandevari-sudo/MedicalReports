import { useNavigate } from "react-router-dom";
import { useReport } from "../hooks/useReport";

export default function SalesSummaryReport() {
  const navigate = useNavigate();

  const { data, loading } = useReport(
    "/reports/sales/summary",
    { from: "2025-01-01", to: "2025-12-31" }
  );

  if (loading) return <div>Loading sales summary...</div>;

  return (
    <div>
      <h2>Salesperson Performance</h2>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Salesperson</th>
            <th>Bills</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((r: any, i: number) => (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/reports/sales/tests", {
                  state: { employeeId: r.Employee_ID }
                })
              }
            >
              <td>{r.Name}</td>
              <td>{r.bills}</td>
              <td>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
