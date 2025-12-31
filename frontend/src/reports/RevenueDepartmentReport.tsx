import { useReport } from "../hooks/useReport";
import { useNavigate } from "react-router-dom";

export default function RevenueDepartmentReport() {
     const navigate = useNavigate();

  const { data, loading } = useReport(
    "/reports/revenue/department",
    { from: "2025-01-01", to: "2025-12-31" }
  );

  if (loading) return <div>Loading report...</div>;

  return (
    <div>
      <h2>Revenue – Department Wise</h2>

      <table border={1}>
        <thead>
          <tr>
            <th>Department</th>
            <th>Revenue</th>
          </tr>
        </thead>
       <tbody>
          {data?.map((r: any, i: number) => (
            <tr
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/reports/revenue/department/tests", {
                  state: {
                    departmentId: r.SubCategoryID   // IMPORTANT
                  }
                })
              }
            >
              <td>{r.department}</td>
              <td>{r.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
