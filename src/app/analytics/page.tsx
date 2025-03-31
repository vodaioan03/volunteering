"use client";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import styles from "./Analytics.module.css";
import { useOpportunitiesWebSocket } from "@/hooks/useOpportunitiesWebSocket";
import { Opportunity } from "@/types/opportunity";

// Register Chart.js components
Chart.register(...registerables);

const AnalyticsPage = () => {
  // Use the custom hook for data fetching and WebSocket management
  const { opportunities, loading, error, connectionStatus } = useOpportunitiesWebSocket();

  // Chart refs
  const chartRef1 = useRef<Chart<"bar", number[], string> | null>(null);
  const chartRef2 = useRef<Chart<"line", number[], string> | null>(null);
  const chartRef3 = useRef<Chart<"pie", number[], string> | null>(null);
  const chartContainer1 = useRef<HTMLCanvasElement | null>(null);
  const chartContainer2 = useRef<HTMLCanvasElement | null>(null);
  const chartContainer3 = useRef<HTMLCanvasElement | null>(null);

  // Process data for charts
  useEffect(() => {
    if (opportunities.length === 0) return;

    // Organizer Data
    const organizerCounts: { [key: string]: number } = {};
    opportunities.forEach((opp) => {
      organizerCounts[opp.organizer] = (organizerCounts[opp.organizer] || 0) + 1;
    });

    // End Date Data
    const endDateCounts: { [key: string]: number } = {};
    opportunities.forEach((opp) => {
      const date = new Date(opp.endDate);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      endDateCounts[monthYear] = (endDateCounts[monthYear] || 0) + 1;
    });

    // Views Data
    const viewsCounts = { High: 0, Medium: 0, Low: 0 };
    opportunities.forEach((opp) => {
      const views = parseInt(opp.views.replace("k", "")) * 1000;
      if (views > 3000) viewsCounts.High++;
      else if (views > 1000) viewsCounts.Medium++;
      else viewsCounts.Low++;
    });

    // Update charts
    updateChart1(organizerCounts);
    updateChart2(endDateCounts);
    updateChart3(viewsCounts);
  }, [opportunities]);

  // Chart update functions
  const updateChart1 = (data: { [key: string]: number }) => {
    if (!chartContainer1.current) return;
    
    const ctx = chartContainer1.current.getContext("2d");
    if (!ctx) return;

    if (chartRef1.current) chartRef1.current.destroy();

    chartRef1.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: "Opportunities by Organizer",
          data: Object.values(data),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  const updateChart2 = (data: { [key: string]: number }) => {
    if (!chartContainer2.current) return;
    
    const ctx = chartContainer2.current.getContext("2d");
    if (!ctx) return;

    if (chartRef2.current) chartRef2.current.destroy();

    const sortedDates = Object.keys(data).sort((a, b) => {
      const [aMonth, aYear] = a.split('/').map(Number);
      const [bMonth, bYear] = b.split('/').map(Number);
      return aYear - bYear || aMonth - bMonth;
    });

    chartRef2.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedDates,
        datasets: [{
          label: "Opportunities by End Date",
          data: sortedDates.map(date => data[date]),
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 2,
          fill: false,
          tension: 0.1
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  };

  const updateChart3 = (data: { [key: string]: number }) => {
    if (!chartContainer3.current) return;
    
    const ctx = chartContainer3.current.getContext("2d");
    if (!ctx) return;

    if (chartRef3.current) chartRef3.current.destroy();

    chartRef3.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: "Opportunities by Views",
          data: Object.values(data),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  if (loading && opportunities.length === 0) {
    return <div className={styles.container}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics Dashboard</h1>
      <div className={styles.connectionStatus}>
        Status: <span className={styles[connectionStatus]}>{connectionStatus}</span>
      </div>
      
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <h2 className={styles.subtitle}>Opportunities by Organizer</h2>
          <canvas ref={chartContainer1}></canvas>
        </div>
        <div className={styles.chart}>
          <h2 className={styles.subtitle}>Opportunities by End Date</h2>
          <canvas ref={chartContainer2}></canvas>
        </div>
        <div className={styles.chart}>
          <h2 className={styles.subtitle}>Opportunities by Views</h2>
          <canvas ref={chartContainer3}></canvas>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;