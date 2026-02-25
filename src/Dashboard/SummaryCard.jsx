import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryCard({ groupName = "Goa Trip", expenses = [] }) {
  // --- LOGIC: Imbalance Detection ---
  // In a real app, pass your actual expenses array as a prop.
  // We use mock data here to demonstrate the "Warning" state.
  const demoExpenses = expenses.length ? expenses : [
    { id: 1, payer: "Raj", amount: 1500, date: "2026-02-20" },
    { id: 2, payer: "Raj", amount: 800, date: "2026-02-21" },
    { id: 3, payer: "Raj", amount: 2200, date: "2026-02-22" },
    { id: 4, payer: "Sneha", amount: 400, date: "2026-02-23" }
  ];

  const calculateGroupHealth = (expenseList) => {
    if (expenseList.length === 0) {
      return { status: "neutral", text: "No expenses yet.", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" };
    }

    // 1. Find who paid the most recently
    const recentPayer = expenseList[expenseList.length - 2]?.payer;
    const lastPayer = expenseList[expenseList.length - 1]?.payer;
    
    // 2. Calculate totals per person
    const totals = expenseList.reduce((acc, curr) => {
      acc[curr.payer] = (acc[curr.payer] || 0) + curr.amount;
      return acc;
    }, {});

    const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
    const maxSpender = Object.keys(totals).reduce((a, b) => totals[a] > totals[b] ? a : b);
    const maxSpentAmount = totals[maxSpender];
    
    // 3. Imbalance Math: What % of the total did the max spender pay?
    const skewPercentage = (maxSpentAmount / totalSpent) * 100;

    // 🔴 RISK STATE: One person is carrying > 75% of the burden, OR paid 3 times in a row
    if (skewPercentage > 75 && expenseList.length > 2) {
      return {
        status: "risk",
        icon: AlertCircle,
        title: "High Imbalance Risk",
        text: `${maxSpender} has paid for almost everything recently (${Math.round(skewPercentage)}% of total). Someone else should take the next bill to keep things fair.`,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-900/50"
      };
    }

    // 🟡 WARNING STATE: Max spender is carrying > 50% of the burden
    if (skewPercentage > 50 && expenseList.length > 2) {
      return {
        status: "warning",
        icon: AlertTriangle,
        title: "Growing Imbalance",
        text: `${maxSpender} is carrying a larger balance. To avoid awkward follow-ups later, try settling up a portion now.`,
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-950/30",
        border: "border-yellow-200 dark:border-yellow-900/50"
      };
    }

    // 🟢 BALANCED STATE
    return {
      status: "balanced",
      icon: CheckCircle2,
      title: "Perfectly Balanced",
      text: "Everyone is contributing fairly. No awkward money conversations needed here!",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-900/50"
    };
  };

  const health = calculateGroupHealth(demoExpenses);
  const StatusIcon = health.icon || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden relative bg-white dark:bg-slate-950">
        
        {/* Subtle background gradient based on health state */}
        <div className={`absolute top-0 left-0 w-2 h-full ${
          health.status === 'balanced' ? 'bg-green-500' : 
          health.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />

        <CardHeader className="pb-2 pl-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Group Balance Health
            </CardTitle>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {groupName}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pl-8 pt-4">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-xl border ${health.bg} ${health.border} transition-all`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm ${health.color}`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`font-bold text-lg mb-1 ${health.color}`}>
                  {health.title}
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {health.text}
                </p>
              </div>
            </div>
            
            {/* The "AI Action" Button - Only shows if there is an imbalance */}
            {health.status !== "balanced" && health.status !== "neutral" && (
              <div className="mt-4 pl-12">
                <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors">
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    ✨
                  </motion.span>
                  Ask AI how to settle this easily
                </button>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}