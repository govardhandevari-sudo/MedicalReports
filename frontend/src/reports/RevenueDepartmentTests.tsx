import { useLocation } from "react-router-dom";
import { useReport } from "../hooks/useReport";

export default function RevenueDepartmentTests() {
  const location = useLocation();
  const { departmentId } = location.state || {};

  const { data, loading } = useReport(
    "/reports/revenue/department/tests",
    {
      departmentId,
      from: "2025-01-01",
      to: "2025-12-31"
    }
  );

  if (!departmentId) return <div>No department selected</div>;
  if (loading) return <div>Loading tests...</div>;

  return (
    <div>
      <h2>Department → Tests</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Test</th>
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
