/**
 * PollResultChart Example Component
 *
 * This file provides comprehensive examples of how to use the PollResultChart component
 * in different configurations and scenarios. It serves as both documentation and a
 * visual showcase of the component's capabilities.
 *
 * Purpose in the app:
 * - Demonstrates all available props and configurations of PollResultChart
 * - Provides copy-paste ready code examples for developers
 * - Shows real-world usage patterns with sample data
 * - Acts as a visual style guide for poll result visualization
 *
 * The PollResultChart component is used throughout the app to display poll results:
 * - In `/polls/[id]/page.tsx` to show voting results for individual polls
 * - Can be embedded in dashboards, reports, or analytics pages
 * - Supports both bar charts and pie charts with toggle functionality
 *
 * This example page includes:
 * 1. Default bar chart configuration
 * 2. Pie chart only (no toggle)
 * 3. Chart without title header
 * 4. Empty poll state (no votes)
 * 5. Side-by-side comparison
 * 6. Usage code examples and props documentation
 *
 * @fileoverview Comprehensive examples and documentation for PollResultChart component
 */

"use client";

import React from "react";
import PollResultChart from "./PollResultChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Sample poll data structure that matches the application's poll format.
 * This demonstrates the expected data structure for the PollResultChart component.
 */
const samplePoll = {
  question: "What's your favorite programming language?",
  options: [
    { id: "1", option_text: "JavaScript", position: 0 },
    { id: "2", option_text: "Python", position: 1 },
    { id: "3", option_text: "TypeScript", position: 2 },
    { id: "4", option_text: "Rust", position: 3 },
    { id: "5", option_text: "Go", position: 4 },
  ],
};

/**
 * Sample votes data as a Map structure.
 * Keys are option IDs, values are vote counts.
 * This matches the format expected by the PollResultChart component.
 */
const sampleVotes = new Map([
  ["1", 25], // JavaScript: 25 votes
  ["2", 30], // Python: 30 votes
  ["3", 15], // TypeScript: 15 votes
  ["4", 8], // Rust: 8 votes
  ["5", 12], // Go: 12 votes
]);

/**
 * Calculate total votes across all options.
 * This is required by the PollResultChart component for percentage calculations.
 */
const totalVotes = Array.from(sampleVotes.values()).reduce(
  (sum, votes) => sum + votes,
  0,
);

/**
 * Main example component that renders multiple PollResultChart configurations.
 *
 * This component demonstrates various ways to use the PollResultChart:
 * - Different chart types (bar vs pie)
 * - With and without titles
 * - With and without toggle controls
 * - Empty state handling
 * - Side-by-side comparisons
 * - Custom styling options
 *
 * The component also includes comprehensive documentation tables and code examples
 * to help developers understand how to integrate PollResultChart in their own components.
 *
 * @returns JSX element containing multiple PollResultChart examples with documentation
 */
export default function PollResultChartExample() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            PollResultChart Examples
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Different ways to use the PollResultChart component
          </p>
        </div>

        {/* Example 1: Default Bar Chart */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            1. Default Bar Chart
          </h2>
          <PollResultChart
            question={samplePoll.question}
            options={samplePoll.options}
            votesByOptionId={sampleVotes}
            totalVotes={totalVotes}
          />
        </section>

        {/* Example 2: Pie Chart Only */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            2. Pie Chart Only (No Toggle)
          </h2>
          <PollResultChart
            question={samplePoll.question}
            options={samplePoll.options}
            votesByOptionId={sampleVotes}
            totalVotes={totalVotes}
            chartType="pie"
            showToggle={false}
          />
        </section>

        {/* Example 3: Without Title */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            3. Chart Without Title Header
          </h2>
          <PollResultChart
            question={samplePoll.question}
            options={samplePoll.options}
            votesByOptionId={sampleVotes}
            totalVotes={totalVotes}
            showTitle={false}
            className="max-w-md"
          />
        </section>

        {/* Example 4: Empty Poll */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            4. Empty Poll (No Votes)
          </h2>
          <PollResultChart
            question="Which framework do you prefer?"
            options={[
              { id: "1", option_text: "React", position: 0 },
              { id: "2", option_text: "Vue", position: 1 },
              { id: "3", option_text: "Angular", position: 2 },
            ]}
            votesByOptionId={new Map()}
            totalVotes={0}
          />
        </section>

        {/* Example 5: Side by Side Comparison */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            5. Side by Side Comparison
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PollResultChart
              question={samplePoll.question}
              options={samplePoll.options}
              votesByOptionId={sampleVotes}
              totalVotes={totalVotes}
              chartType="bar"
              showToggle={false}
              showTitle={false}
            />
            <PollResultChart
              question={samplePoll.question}
              options={samplePoll.options}
              votesByOptionId={sampleVotes}
              totalVotes={totalVotes}
              chartType="pie"
              showToggle={false}
              showTitle={false}
            />
          </div>
        </section>

        {/* Usage Code Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Basic Usage:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                {`<PollResultChart
  question="What's your favorite language?"
  options={pollOptions}
  votesByOptionId={votesMap}
  totalVotes={totalVoteCount}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                With Custom Settings:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                {`<PollResultChart
  question="Which framework do you prefer?"
  options={pollOptions}
  votesByOptionId={votesMap}
  totalVotes={totalVoteCount}
  chartType="pie"
  showToggle={false}
  showTitle={false}
  className="max-w-md mx-auto"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Data Structure:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-gray-100">
                {`// Poll options format
const options = [
  { id: '1', option_text: 'Option 1', position: 0 },
  { id: '2', option_text: 'Option 2', position: 1 }
];

// Votes format
const votesByOptionId = new Map([
  ['1', 10], // Option 1 has 10 votes
  ['2', 15]  // Option 2 has 15 votes
]);

const totalVotes = 25;`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Props Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Props Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      Prop
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      Default
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500 dark:text-gray-400">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      question
                    </td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">The poll question text</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      options
                    </td>
                    <td className="py-3 px-4">PollOption[]</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      Array of poll options with id, option_text, and position
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      votesByOptionId
                    </td>
                    <td className="py-3 px-4">Map&lt;string, number&gt;</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      Map of option IDs to vote counts
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      totalVotes
                    </td>
                    <td className="py-3 px-4">number</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">
                      Total number of votes across all options
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      showTitle
                    </td>
                    <td className="py-3 px-4">boolean</td>
                    <td className="py-3 px-4">true</td>
                    <td className="py-3 px-4">
                      Whether to show the chart title and question
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      className
                    </td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4">undefined</td>
                    <td className="py-3 px-4">
                      Additional CSS classes for styling
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      chartType
                    </td>
                    <td className="py-3 px-4">"bar" | "pie"</td>
                    <td className="py-3 px-4">"bar"</td>
                    <td className="py-3 px-4">Default chart type to display</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono text-gray-900 dark:text-gray-100">
                      showToggle
                    </td>
                    <td className="py-3 px-4">boolean</td>
                    <td className="py-3 px-4">true</td>
                    <td className="py-3 px-4">
                      Whether to show the bar/pie chart toggle buttons
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
