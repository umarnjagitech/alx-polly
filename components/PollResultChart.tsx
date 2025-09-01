"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PollOption {
  id: string;
  option_text: string;
  position: number;
}

interface PollResultChartProps {
  question: string;
  options: PollOption[];
  votesByOptionId: Map<string, number>;
  totalVotes: number;
  showTitle?: boolean;
  className?: string;
  chartType?: "bar" | "pie";
  showToggle?: boolean;
}

export default function PollResultChart({
  question,
  options,
  votesByOptionId,
  totalVotes,
  showTitle = true,
  className,
  chartType = "bar",
  showToggle = true,
}: PollResultChartProps) {
  const [currentChartType, setCurrentChartType] = useState<"bar" | "pie">(
    chartType,
  );

  // Sort options by position
  const sortedOptions = [...options].sort((a, b) => a.position - b.position);

  // Find the maximum votes for scaling the bars
  const maxVotes = Math.max(
    ...sortedOptions.map((opt) => votesByOptionId.get(opt.id) || 0),
  );

  // Colors for chart segments - aligned with shadcn/ui design system
  const colors = [
    { bg: "bg-blue-500", hex: "#3b82f6", border: "border-blue-200" },
    { bg: "bg-green-500", hex: "#10b981", border: "border-green-200" },
    { bg: "bg-yellow-500", hex: "#f59e0b", border: "border-yellow-200" },
    { bg: "bg-red-500", hex: "#ef4444", border: "border-red-200" },
    { bg: "bg-purple-500", hex: "#8b5cf6", border: "border-purple-200" },
    { bg: "bg-pink-500", hex: "#ec4899", border: "border-pink-200" },
    { bg: "bg-indigo-500", hex: "#6366f1", border: "border-indigo-200" },
    { bg: "bg-gray-500", hex: "#6b7280", border: "border-gray-200" },
  ];

  // Create chart segments data
  const chartData = sortedOptions.map((option, index) => {
    const votes = votesByOptionId.get(option.id) || 0;
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    return {
      ...option,
      votes,
      percentage,
      color: colors[index % colors.length],
    };
  });

  const renderBarChart = () => (
    <div className="space-y-4">
      {chartData.map((item) => {
        const barWidth = maxVotes > 0 ? (item.votes / maxVotes) * 100 : 0;

        return (
          <div key={item.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {item.option_text}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{item.votes} votes</span>
                <span className="text-xs">
                  ({Math.round(item.percentage)}%)
                </span>
              </div>
            </div>

            <div className="relative w-full h-8 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-700 ease-out rounded-md",
                  item.color.bg,
                )}
                style={{ width: `${barWidth}%` }}
              />
              {item.percentage > 15 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {Math.round(item.percentage)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPieChart = () => {
    let cumulativePercentage = 0;

    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Pie Chart SVG */}
        <div className="relative w-48 h-48">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 42 42"
          >
            {totalVotes > 0 &&
              chartData.map((item) => {
                if (item.percentage === 0) return null;

                const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                const strokeDashoffset = -cumulativePercentage;

                cumulativePercentage += item.percentage;

                return (
                  <circle
                    key={item.id}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color.hex}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700"
                  />
                );
              })}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {totalVotes}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalVotes === 1 ? "vote" : "votes"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2">
          {chartData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-4 h-4 rounded-full", item.color.bg)} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.option_text}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{item.votes}</span>
                <span className="text-xs">
                  ({Math.round(item.percentage)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl">Poll Results</CardTitle>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {question}
              </p>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
              </p>
            </div>
            {showToggle && totalVotes > 0 && (
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shrink-0">
                <Button
                  variant={currentChartType === "bar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentChartType("bar")}
                  className="h-8 px-3 text-xs"
                >
                  Bar
                </Button>
                <Button
                  variant={currentChartType === "pie" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentChartType("pie")}
                  className="h-8 px-3 text-xs"
                >
                  Pie
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent>
        {totalVotes === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No votes yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Be the first to vote on this poll
            </p>
          </div>
        ) : currentChartType === "bar" ? (
          renderBarChart()
        ) : (
          renderPieChart()
        )}
      </CardContent>
    </Card>
  );
}
