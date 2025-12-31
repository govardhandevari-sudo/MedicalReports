import React, { useState, useEffect } from "react";
import axios from "axios";
import {api} from "./services/api";
import DashboardUI from "./components/DashboardUI";
/* KEEP ALL YOUR BIG UI CODE BELOW THIS LINE */
/* DO NOT SPLIT INTO DashboardUI YET */

const DiagnosticDashboard = () => {
  // --------------------
  // GLOBAL FILTER STATE
  // --------------------
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenters, setSelectedCenters] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState({
    start: "2025-01-01",
    end: "2025-12-31"
  });

  // --------------------
  // DASHBOARD KPI DATA
  // --------------------
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --------------------
  // LOAD CENTERS
  // --------------------
 useEffect(() => {
  api
    .get("/reports/masters/centres")
    .then(res => {
      setCenters(res.data);
      setSelectedCenters(res.data.map((c: any) => c.id));
    })
    .catch(err => {
      console.error("Failed to load diagnostic centers", err);
    });
}, []);


useEffect(() => {
    if (selectedCenters.length === 0) return;

    setLoading(true);
    const params: any = {
      from: dateRange.start,
      to: dateRange.end
    };

    if (selectedCenters.length && selectedCenters.length !== centers.length) {
      params.centers = selectedCenters.join(",");
    }

    api.get("/dashboard/kpis", {
        params: params
      })
      .then(res => setKpis(res.data))
      .finally(() => setLoading(false));
  }, [dateRange, selectedCenters]);

  if (loading || !kpis) {
    return <div>Loading dashboard...</div>;
  }

  /* ⬇⬇⬇ PASTE YOUR FULL UI JSX HERE ⬇⬇⬇ */
  return (
    <>
      {/* TEMP TEST — CONFIRM UI IS LIVE */}
      <h1>Diagnostics Dashboard</h1>
      <p>Total Revenue: {kpis.totalRevenue}</p>
      <p>Total Bills: {kpis.totalBills}</p>

      <DashboardUI kpis={kpis} selectedCenters={selectedCenters} setSelectedCenters={setSelectedCenters} centers={centers} dateRange={dateRange} setDateRange={setDateRange}/>
    </>
  );
};

export default DiagnosticDashboard;
