
import { db } from "../db";

export const getKPIs = async (req, res) => {
  const { from, to } = req.query;
  const [rows]: any = await db.query(`
    SELECT
      COUNT(DISTINCT LedgerTransactionNo) totalBills,
      SUM(NetAmount) totalRevenue
    FROM f_ledgertransaction
    WHERE Date BETWEEN ? AND ?
  `, [from, to]);

  res.json(rows[0]);
};

export const revenueTrend = async (req, res) => {
  const { from, to } = req.query;
  const [rows] = await db.query(`
    SELECT DATE(Date) day, SUM(NetAmount) revenue
    FROM f_ledgertransaction
    WHERE Date BETWEEN ? AND ?
    GROUP BY DATE(Date)
  `, [from, to]);

  res.json(rows);
};
