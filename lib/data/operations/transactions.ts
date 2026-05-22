import type { Transaction } from "../../types";

const now = new Date();
const daysAgo = (days: number, hour = 10, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

export const sampleTransactions: Transaction[] = [
  {
    id: "TX-1001",
    type: "Deposit",
    amount: 2000,
    method: "Card",
    client: "Yasmine Alaoui",
    date: daysAgo(0, 12, 12),
    note: "Private Garden Dining deposit",
    category: "Reservation",
  },
  {
    id: "TX-1002",
    type: "Sale",
    amount: 1850,
    method: "Card",
    client: "Karim Alami",
    date: daysAgo(1, 21, 40),
    note: "Table for 4 — dinner service",
    category: "Dining",
  },
  {
    id: "TX-1003",
    type: "Sale",
    amount: 1200,
    method: "Transfer",
    client: "Ahmed Benali",
    date: daysAgo(2, 20, 5),
    note: "Chef's Table — full prepayment",
    category: "Experience",
  },
  {
    id: "TX-1004",
    type: "Refund",
    amount: 2000,
    method: "Card",
    client: "Leila Tazi",
    date: daysAgo(3, 11, 30),
    note: "Private dining cancelled within policy",
    category: "Refund",
  },
  {
    id: "TX-1005",
    type: "Sale",
    amount: 620,
    method: "Cash",
    client: "Walk-in client",
    date: daysAgo(4, 14, 20),
    note: "Lunch — terrace",
    category: "Dining",
  },
];
