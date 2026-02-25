import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Receipt, User, Users, Wallet } from "lucide-react";

export default function ExpenseForm({ onAddExpense, recentPayer = "Sneha" }) {
  const [form, setForm] = useState({ description: "", amount: "", paidBy: "", participants: "" });
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  // 🔥 Tier-S Feature: Real-time Budget Decision Tool
  useEffect(() => {
    // Triggers a soft warning if the amount exceeds a psychological threshold (e.g., 3000)
    if (Number(form.amount) > 3000) {
      setShowBudgetWarning(true);
    } else {
      setShowBudgetWarning(false);
    }
  }, [form.amount]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.paidBy || !form.participants) return;
    const parts = form.participants.split(",").map((p) => p.trim()).filter(Boolean);
    const splits = parts.map((p) => ({ participantId: p, value: +(form.amount / parts.length).toFixed(2) }));
    onAddExpense({ ...form, amount: +form.amount, splits });
    setForm({ description: "", amount: "", paidBy: "", participants: "" });
  };

  return (
    <div className="p-6 rounded-2xl glass relative overflow-hidden bg-white/80 dark:bg-slate-900/80 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
      
      {/* 🔥 Tier-S Feature: Smart AI Nudge (Fairness) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl flex items-start gap-3"
      >
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
          <span className="font-semibold">AI Tip:</span> {recentPayer} has paid the last few times. Someone else grabbing this bill will keep the group perfectly balanced!
        </p>
      </motion.div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Receipt className="w-6 h-6 text-cyan-500" />
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Description Field */}
        <div className="relative group">
          <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <input 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="What was this for? (e.g., Dinner, Pilates class)"
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all" 
          />
        </div>

        {/* Amount Field with Real-time Warning */}
        <div className="space-y-2">
          <div className="relative group">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              name="amount" 
              value={form.amount} 
              onChange={handleChange} 
              placeholder="Amount" 
              type="number"
              className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all" 
            />
          </div>
          
          {/* Animated Budget Warning */}
          <AnimatePresence>
            {showBudgetWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <p>This is a larger expense. It might stretch this week's group budget.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Paid By Field */}
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <input 
            name="paidBy" 
            value={form.paidBy} 
            onChange={handleChange} 
            placeholder="Who paid?"
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all" 
          />
        </div>

        {/* Participants Field */}
        <div className="relative group">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
          <input 
            name="participants" 
            value={form.participants} 
            onChange={handleChange}
            placeholder="Split between? (Comma separated, e.g., Raj, Amit)" 
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent outline-none transition-all" 
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="w-full h-12 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
        >
          Add Expense
        </motion.button>
      </form>
    </div>
  );
}