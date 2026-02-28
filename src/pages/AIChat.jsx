import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Calculator,
    Receipt,
    Users,
    TrendingUp,
    Sparkles,
    PieChart,
    Send,
    Loader2,
    Bot,
    User,
    AlertCircle,
    Scale
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// 🔥 TIER-S UPGRADE: Psychological, decision-first prompts instead of basic calculator prompts
const quickPrompts = [
    { icon: Scale, label: "Check Fairness", color: "purple", prompt: "Is our group fair right now? Who has been paying too much lately and who should pay next to avoid awkwardness?" },
    { icon: TrendingUp, label: "Expense Spikes", color: "orange", prompt: "Where have our expenses increased recently? Are we overspending?" },
    { icon: Sparkles, label: "My Persona", color: "pink", prompt: "Based on my expenses, what is my spending psychology? Am I a Planner, Spontaneous, or an Avoider?" },
    { icon: Users, label: "Settle Smartly", color: "cyan", prompt: "What's the easiest way to settle all our current debts with the absolute minimum number of transactions?" },
];

export default function AIChat() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm your SmartSplit AI mediator. I don't just calculate numbers—I help keep your group balanced, track where your expenses are spiking, and make settling up totally awkward-free. What's on your mind?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize Gemini API
    const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getContextData = () => {
        try {
            const expenses = JSON.parse(localStorage.getItem("smartsplit_expenses_v1") || "[]");
            const budgets = JSON.parse(localStorage.getItem("smartsplit_budgets_v1") || "[]");
            const participants = JSON.parse(localStorage.getItem("smartsplit_participants_v1") || "[]");

            return JSON.stringify({
                expenses: expenses.slice(0, 30), // Send last 30 expenses to analyze trends
                budgets,
                participants,
                summary: `User has ${expenses.length} expenses recorded and ${participants.length} participants.`
            });
        } catch (error) {
            console.error("Error fetching context:", error);
            return "Unable to access local financial data.";
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            if (!apiKey) throw new Error("Google Gemini API Key is missing in your .env file.");

            const context = getContextData();

            // 🔥 TIER-S UPGRADE: The System Prompt that gives the AI its psychological mediator persona
            const prompt = `
            You are SmartSplit AI, an empathetic, psychological financial mediator for a bill-splitting app. 
            Do not just act like a calculator. Act like a friendly financial coach who wants to prevent arguments between friends.
            
            Context Data (JSON):
            ${context}
            
            User Question: ${userMessage.content}
            
            Tier-S Instructions:
            1. Fairness & Imbalance: If the user asks about the group, detect if one person is paying repeatedly. Suggest who should pay next to avoid "silent resentment".
            2. Expense Spikes: If asked about spending trends, point out exactly which categories are increasing and warn them if it will stress their budget.
            3. Spending Behavior Insights: If asked about their persona, label them (e.g., 'The Planner', 'The Spontaneous Spender', 'The Avoider') based on the frequency and categories of their expenses in the JSON.
            4. Smart Settlements: When asked to settle, suggest the easiest, most direct path (minimum transactions).
            5. Tone: Be concise, friendly, and conversational. Use emojis.
            6. DO NOT mention "JSON data" or "Context" to the user. Speak naturally as if you just "know" their app history.
            `;

            // 🔥 FIXED: Actual implementation of the Gemini API call
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        } catch (error) {
            console.error("AI Generation failed:", error);
            const errorMessage = error.message || "Unknown error";
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: `⚠️ AI Connection Error \n\nDetails: ${errorMessage}\n\nPlease check your VITE_GOOGLE_AI_KEY in your .env file and ensure you have internet access.`,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
        // Optional: Automatically send when a quick prompt is clicked
        // setTimeout(() => handleSend(), 100); 
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 sm:py-16 mb-8">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200">
                            AI Group Mediator
                        </h1>
                        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light">
                            Don't just calculate splits. Get psychological insights, fairness checks, and smart budget warnings.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                {/* Quick Prompts */}
                {messages.length === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">Suggested Actions</h2>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((prompt, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="h-9 cursor-pointer gap-2 text-sm rounded-lg backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all px-4 shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700"
                                        onClick={() => handleQuickPrompt(prompt.prompt)}
                                    >
                                        <prompt.icon className={`h-4 w-4 text-${prompt.color}-500`} />
                                        {prompt.label}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                <Card className="mb-6 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/60 shadow-lg min-h-[400px] flex flex-col">
                    <CardContent className="p-6 space-y-6 flex-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {messages.map((message, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}

                                    <motion.div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${message.role === "user"
                                                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-tr-none"
                                                : message.isError
                                                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-tl-none"
                                                    : "backdrop-blur-sm bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                                            }`}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    </motion.div>

                                    {message.role === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                            <User className="w-5 h-5 text-slate-500" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3 justify-start"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="backdrop-blur-sm bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center gap-2 border border-slate-200 dark:border-slate-700">
                                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                                    <span className="text-xs text-muted-foreground animate-pulse">Analyzing expenses and group fairness...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>
                </Card>

                {/* Input Area */}
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-700/60 shadow-lg sticky bottom-6 z-10">
                    <CardContent className="p-4">
                        <div className="flex gap-2 items-end">
                            <Textarea
                                placeholder="Ask me about spending spikes, fairness, or who owes what..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="min-h-[50px] max-h-[120px] resize-none border-none shadow-none focus-visible:ring-0 text-base bg-transparent text-slate-900 dark:text-slate-100"
                                rows={1}
                            />
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pb-1">
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="self-end bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all text-white"
                                    size="icon"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}