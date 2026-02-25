import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, Coffee, ArrowRight, User, Users, CalendarDays } from "lucide-react";

export default function ExpenseList({ expenses = [] }) {
  // 🔥 Tier-S Feature: Empty State That Educates
  if (!expenses.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-purple-200 dark:border-purple-900/50 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/10" />
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No expenses yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Groups that track small expenses argue <span className="font-bold text-purple-600 dark:text-purple-400">80% less</span>. Add your first coffee run or dinner to set a fair tone!
          </p>
          <div className="flex justify-center text-purple-600 dark:text-purple-400 animate-bounce">
            <ArrowRight className="w-5 h-5 -rotate-90 md:rotate-180" /> 
            {/* The arrow points left (or up on mobile) towards your form */}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-6 rounded-2xl glass bg-white/80 dark:bg-slate-900/80 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Receipt className="w-6 h-6 text-purple-500" />
          Recent Expenses
        </h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {expenses.length} Total
        </span>
      </div>
      
      <ul className="space-y-3">
        <AnimatePresence>
          {expenses.map((exp, index) => (
            <motion.li 
              key={exp.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-950/50 hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Icon/Avatar Circle */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/40 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-cyan-400">
                  <Receipt className="w-6 h-6" />
                </div>
                
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-cyan-400 transition-colors">
                    {exp.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Paid by <b className="text-slate-700 dark:text-slate-300">{exp.paidBy}</b>
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      Today
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-slate-900 dark:text-white">
                  ₹{Number(exp.amount).toLocaleString('en-IN')}
                </p>
                <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <Users className="w-3 h-3" />
                  {exp.splits?.length || 0} split
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}