import { Router } from "express";
import {
  revenueByDepartment,
  revenueDepartmentTests,
  salesSummary,salesTests,collectionByDepartment,paymentModeSummary,paymentModeReceipts,getCentres
} from "../controllers/reports.controller";

const router = Router();

router.get("/revenue/department", revenueByDepartment);
router.get("/revenue/department/tests", revenueDepartmentTests);
router.get("/sales/summary", salesSummary);
router.get("/sales/tests", salesTests);
router.get("/collection/department", collectionByDepartment);
router.get("/payment-mode", paymentModeSummary);
router.get("/payment-mode/receipts", paymentModeReceipts);
router.get("/masters/centres", getCentres);

export default router;
