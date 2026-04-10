import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  MessageCircle,
  X,
  RefreshCw
} from "lucide-react";
import { TransactionInsight } from "@/entities/all";
import { useSettings } from "@/components/settings/SettingsProvider";

export default function AIInsightsPanel({ onAskAI }) {
  const { formatCurrency } = useSettings();
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const data = await TransactionInsight.list("-created_date", 10);
      setInsights(data.filter(insight => !insight.is_dismissed));
    } catch (error) {
      console.error("Error loading insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissInsight = async (insightId) => {
    try {
      await TransactionInsight.update(insightId, { is_dismissed: true });
      setInsights(prev => prev.filter(insight => insight.id !== insightId));
    } catch (error) {
      console.error("Error dismissing insight:", error);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'anomaly':
      case 'alert':
        return AlertTriangle;
      case 'trend':
        return TrendingUp;
      case 'opportunity':
        return Lightbulb;
      case 'prediction':
        return Target;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'anomaly':
      case 'alert':
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case 'trend':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case 'opportunity':
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case 'prediction':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary-navy dark:text-white">
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAskAI}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Ask AI
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadInsights}
              disabled={isLoading}
            >
              <motion.div
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            <AnimatePresence>
              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.insight_type);
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-neutral-50/50 dark:bg-gray-700/30 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                        <Badge className={getInsightColor(insight.insight_type)} variant="secondary">
                          {insight.insight_type}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dismissInsight(insight.id)}
                        className="w-6 h-6 text-neutral-400 hover:text-neutral-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {insight.title}
                    </h4>
                    
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                      {insight.description}
                    </p>
                    
                    {insight.suggested_action && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2 mt-2">
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                          💡 Suggestion: {insight.suggested_action}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>Confidence: {Math.round(insight.confidence_score * 100)}%</span>
                      {insight.category && <span>Category: {insight.category}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {insights.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">No insights available yet</p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                  Add more transactions to see AI-powered insights
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}