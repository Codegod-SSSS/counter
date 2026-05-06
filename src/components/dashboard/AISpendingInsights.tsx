import React, { useState } from 'react';
import { useBudget } from '../../BudgetContext';
import { Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { format } from 'date-fns';

export const AISpendingInsights: React.FC = () => {
  const { expenses, categories, settings } = useBudget();
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (!process.env.GEMINI_API_KEY) {
      setInsight("AI Insights require an API key environment variable.");
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
      const categorySummary = categories.map(cat => ({
        name: cat.name,
        spent: expenses.filter(e => e.categoryId === cat.id).reduce((acc, curr) => acc + curr.amount, 0)
      })).filter(c => c.spent > 0);

      const prompt = `
        As a professional financial advisor, analyze this expense data:
        - Budget Plan: ${settings.budgetAmount} ${settings.currency} per ${settings.budgetType}
        - Total Historical Spent: ${settings.currency} ${totalSpent}
        - Categories: ${JSON.stringify(categorySummary)}
        
        Provide 3 concise, actionable financial tips or insights specific to this user's ${settings.budgetType} budget plan. 
        Keep it encouraging and professional. Refer to amounts in ${settings.currency}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setInsight(response.text || "No insight generated.");
    } catch (error) {
      console.error(error);
      setInsight("Unable to generate insights at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center text-accent">
          <Sparkles size={16} />
        </div>
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Spending Insight</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {insight ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-xs font-medium text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
              {insight}
            </div>
            <button 
              onClick={() => setInsight(null)}
              className="text-[10px] font-bold text-accent hover:underline"
            >
              Get New Analysis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Analyze your current behavior against the {settings.budgetType} budget using AI.
            </p>
            <button 
              onClick={generateInsight}
              disabled={loading || expenses.length === 0}
              className="w-full bg-accent text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50 text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <MessageSquare size={16} />}
              {loading ? 'Thinking...' : 'Analyze Spend'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
