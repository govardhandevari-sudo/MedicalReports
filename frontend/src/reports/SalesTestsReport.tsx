import { useLocation } from "react-router-dom";
import { useReport } from "../hooks/useReport";

export default function SalesTestsReport() {
  const location = useLocation();
  const { employeeId } = location.state || {};

  const { data, loading } = useReport(
    "/reports/sales/tests",
    { employeeId }
  );

  if (!employeeId) return <div>No salesperson selected</div>;
  if (loading) return <div>Loading tests...</div>;

  return (
    <div>
      <h2>Salesperson → Tests</h2>

      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((r: any, i: number) => (
            <tr key={i}>
              <td>{r.InvestigationName}</td>
              <td>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
