import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

// FIXED: Cleaned up the prop destructuring syntax
export function DashboardCard({
    title,
    value = 0,
    icon: Icon,
    gradient = "from-purple-500 to-cyan-500", // Default gradient fallback
    delay = 0,
    prefix = "₹",
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="h-full"
        >
            <Card className={cn(
                "relative overflow-hidden h-full min-h-[140px]",
                "bg-white dark:bg-slate-900/80 backdrop-blur-sm",
                "border border-slate-100 dark:border-slate-800",
                "shadow-xl shadow-slate-200/40 dark:shadow-none",
                "rounded-3xl",
                "transition-all duration-300 group"
            )}>
                
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r opacity-90",
                    gradient
                )} />

                <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-500",
                    gradient
                )} />

                <CardContent className="p-6 h-full flex flex-col justify-center relative z-10">
                    <div className="flex items-center justify-between gap-4">
                        
                        <div className="flex-col flex min-w-0">
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 truncate">
                                {title}
                            </p>
                            
                            <div className="flex items-baseline gap-1.5">
                                {prefix && (
                                    <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">
                                        {prefix}
                                    </span>
                                )}
                                <span className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                                    <NumberFlow value={value} />
                                </span>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={cn(
                                "w-14 h-14 rounded-2xl bg-gradient-to-br shadow-md flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow",
                                gradient
                            )}
                        >
                            <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}