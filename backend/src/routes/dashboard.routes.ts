
import { Router } from "express";
import { getKPIs, revenueTrend } from "../controllers/dashboard.controller";

const router = Router();
router.get("/kpis", getKPIs);
router.get("/revenue-trend", revenueTrend);

export default router;
