
import express from "express";
import cors from "cors";
import dashboardRoutes from "./routes/dashboard.routes";
import reportRoutes from "./routes/reports.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

app.listen(5000, () => console.log("Backend running on port 5000"));
