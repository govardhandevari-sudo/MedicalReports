
import { db } from "../db";

export const revenueByDepartment = async (req, res) => {
  const { from, to } = req.query;
  const [rows] = await db.query(`
    SELECT d.Name department, SUM(p.Amount) revenue
    FROM patient_labinvestigation_opd p
    JOIN f_subcategorymaster d ON d.SubCategoryID = p.SubCategoryID
    JOIN f_ledgertransaction f ON f.LedgerTransactionNo = p.LedgerTransactionNo
    WHERE f.Date BETWEEN ? AND ?
    GROUP BY d.SubCategoryID
  `, [from, to]);

  res.json(rows);
};
export const revenueDepartmentTests = async (req, res) => {
  const { departmentId, from, to } = req.query;

  const [rows] = await db.query(
    `
    SELECT
      plo.InvestigationName,
      SUM(plo.Amount) AS revenue
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction flt
      ON flt.LedgerTransactionNo = plo.LedgerTransactionNo
    WHERE plo.SubCategoryID = ?
      AND flt.Date BETWEEN ? AND ?
    GROUP BY plo.Investigation_ID
    `,
    [departmentId, from, to]
  );

  res.json(rows);
};
export const salesSummary = async (req, res) => {
  const { from, to } = req.query;
  const [rows] = await db.query(`
    SELECT
      e.Employee_ID,
      e.Name,
      COUNT(DISTINCT f.LedgerTransactionNo) AS bills,
      SUM(f.NetAmount) AS revenue
    FROM f_ledgertransaction f
    JOIN employee_master e ON e.Employee_ID = f.PRO
    WHERE f.Date BETWEEN ? AND ?
    GROUP BY e.Employee_ID
  `, [from, to]);

  res.json(rows);
};

export const salesTests = async (req, res) => {
  const { employeeId } = req.query;
  const [rows] = await db.query(`
    SELECT
      plo.InvestigationName,
      SUM(plo.Amount) AS revenue
    FROM patient_labinvestigation_opd plo
    JOIN f_ledgertransaction f
      ON f.LedgerTransactionNo = plo.LedgerTransactionNo
    WHERE f.PRO = ?
    GROUP BY plo.Investigation_ID
  `, [employeeId]);

  res.json(rows);
};
export const collectionByDepartment = async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      d.Name AS department,
      SUM(r.Amount) AS collected
    FROM receipt r
    JOIN f_ledgertransaction f ON f.LedgerTransactionNo = r.LedgerTransactionNo
    JOIN patient_labinvestigation_opd plo ON plo.LedgerTransactionNo = f.LedgerTransactionNo
    JOIN f_subcategorymaster d ON d.SubCategoryID = plo.SubCategoryID
    WHERE r.IsCancel = 0
    GROUP BY d.SubCategoryID
  `);
  res.json(rows);
};
export const paymentModeSummary = async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      pm.PaymentMode,
      pm.PaymentModeId,
      SUM(r.Amount) AS amount
    FROM receipt r
    JOIN paymentmode_master pm ON pm.PaymentModeId = r.PaymentModeID
    WHERE r.IsCancel = 0
    GROUP BY pm.PaymentModeId
  `);
  res.json(rows);
};

export const paymentModeReceipts = async (req, res) => {
  const { paymentModeId } = req.query;
  const [rows] = await db.query(`
    SELECT
      r.ReceiptNo,
      r.Amount,
      r.EntryDateTime
    FROM receipt r
    WHERE r.PaymentModeID = ?
    ORDER BY r.EntryDateTime DESC
    LIMIT 50
  `, [paymentModeId]);
  res.json(rows);
};
export const getCentres = async (req, res) => {
  const [rows] = await db.query(`
    SELECT CentreID AS id, Centre AS name
    FROM centre_master
    WHERE isActive = 1
    ORDER BY Centre
  `);
  res.json(rows);
};
