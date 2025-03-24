"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Chart, registerables } from "chart.js";
import styles from "./Analytics.module.css";
import { useOpportunities } from "@/context/OpportunitiesContext"; // Import the context

// Register Chart.js components
Chart.register(...registerables);

const AnalyticsPage = () => {
  const { opportunities } = useOpportunities(); // Use the context

  const [organizerData, setOrganizerData] = useState<{ [key: string]: number }>({});
  const [endDateData, setEndDateData] = useState<{ [key: string]: number }>({});
  const [viewsData, setViewsData] = useState<{ [key: string]: number }>({
    High: 0,
    Medium: 0,
    Low: 0,
  });

  const chartRef1 = useRef<Chart<"bar", number[], string> | null>(null);
  const chartRef2 = useRef<Chart<"line", number[], string> | null>(null);
  const chartRef3 = useRef<Chart<"pie", number[], string> | null>(null);

  const chartContainer1 = useRef<HTMLCanvasElement | null>(null);
  const chartContainer2 = useRef<HTMLCanvasElement | null>(null);
  const chartContainer3 = useRef<HTMLCanvasElement | null>(null);

  // Process data for charts
  useEffect(() => {
    // Organizer Data
    const organizerCounts: { [key: string]: number } = {};
    opportunities.forEach((opp) => {
      organizerCounts[opp.organizer] = (organizerCounts[opp.organizer] || 0) + 1;
    });
    setOrganizerData(organizerCounts);

    // End Date Data
    const endDateCounts: { [key: string]: number } = {};
    opportunities.forEach((opp) => {
      endDateCounts[opp.endDate] = (endDateCounts[opp.endDate] || 0) + 1;
    });
    setEndDateData(endDateCounts);

    // Views Data
    const viewsCounts = { High: 0, Medium: 0, Low: 0 };
    opportunities.forEach((opp) => {
      const views = parseInt(opp.views.replace("k", "")) * 1000;
      if (views > 3000) viewsCounts.High++;
      else if (views > 1000) viewsCounts.Medium++;
      else viewsCounts.Low++;
    });
    setViewsData(viewsCounts);
  }, [opportunities]);

  // Initialize and update Chart 1 (Bar Chart - Opportunities by Organizer)
  useEffect(() => {
    if (chartContainer1.current) {
      const ctx = chartContainer1.current.getContext("2d");
      if (ctx) {
        if (chartRef1.current) {
          chartRef1.current.destroy(); // Destroy existing chart
        }

        chartRef1.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Object.keys(organizerData),
            datasets: [
              {
                label: "Opportunities by Organizer",
                data: Object.values(organizerData),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [organizerData]);

  // Initialize and update Chart 2 (Line Chart - Opportunities by End Date)
  useEffect(() => {
    if (chartContainer2.current) {
      const ctx = chartContainer2.current.getContext("2d");
      if (ctx) {
        if (chartRef2.current) {
          chartRef2.current.destroy(); // Destroy existing chart
        }

        chartRef2.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(endDateData),
            datasets: [
              {
                label: "Opportunities by End Date",
                data: Object.values(endDateData),
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 2,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [endDateData]);

  // Initialize and update Chart 3 (Pie Chart - Opportunities by Views)
  useEffect(() => {
    if (chartContainer3.current) {
      const ctx = chartContainer3.current.getContext("2d");
      if (ctx) {
        if (chartRef3.current) {
          chartRef3.current.destroy(); // Destroy existing chart
        }

        chartRef3.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(viewsData),
            datasets: [
              {
                label: "Opportunities by Views",
                data: Object.values(viewsData),
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }
  }, [viewsData]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics Dashboard</h1>
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