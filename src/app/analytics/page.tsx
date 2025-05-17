"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import styles from "./Analytics.module.css";
import { analyticsService } from "@/services/AnalyticsService";

// Register Chart.js components
Chart.register(...registerables);

interface OrganizerData {
  name: string;
  count: number;
}

interface MonthlyData {
  [key: string]: number;
}

interface ViewsData {
  [key: string]: number;
}

interface ChartData {
  organizers: OrganizerData[];
  monthly: MonthlyData;
  views: ViewsData;
  summary: any; // Replace with proper type if possible
}

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState<ChartData>({
    organizers: [],
    monthly: {},
    views: {},
    summary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chart refs
  const chartRef1 = useRef<Chart | null>(null);
  const chartRef2 = useRef<Chart | null>(null);
  const chartRef3 = useRef<Chart | null>(null);
  const chartContainer1 = useRef<HTMLCanvasElement>(null);
  const chartContainer2 = useRef<HTMLCanvasElement>(null);
  const chartContainer3 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [organizers, monthly, views, summary] = await Promise.all([
          analyticsService.getTopOrganizers(),
          analyticsService.getMonthlyCounts(),
          analyticsService.getViewsDistribution(),
          analyticsService.getSummaryStats()
        ]);
        
        setChartData({
          organizers: Array.isArray(organizers) ? organizers : [],
          monthly: monthly || {},
          views: views || {},
          summary
        });
      } catch (error) {
        console.error("Failed to load analytics", error);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialize charts when data loads
  useEffect(() => {
    if (!loading && chartData.organizers.length > 0) {
      updateChart1(chartData.organizers);
      updateChart2(chartData.monthly);
      updateChart3(chartData.views);
    }
  }, [loading, chartData]);

  // Chart update functions
  const updateChart1 = (data: OrganizerData[]) => {
    try {
      if (!chartContainer1.current) {
        console.warn("Chart container 1 not found");
        return;
      }
      
      const ctx = chartContainer1.current.getContext("2d");
      if (!ctx) {
        console.warn("Could not get 2D context");
        return;
      }
    
      // Destroy previous chart if exists
      if (chartRef1.current) {
        chartRef1.current.destroy();
        chartRef1.current = null;
      }
    
      // Don't proceed if no data
      if (!data || data.length === 0) {
        console.warn("No data provided for chart 1");
        return;
      }
    
      chartRef1.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            label: "Top Organizers",
            data: data.map(item => item.count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Add this
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} opportunities` } }
          },
          scales: { 
            y: { 
              beginAtZero: true,
              title: { display: true, text: 'Number of Opportunities' }
            },
            x: { title: { display: true, text: 'Organizer' } }
          },
        },
      });
    } catch (error) {
      console.error("Error creating chart 1:", error);
    }
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
        plugins: {
          tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} opportunities ending` } }
        }
      }
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
        plugins: {
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} opportunities` } }
        }
      }
    });
  };

  if (loading) {
    return <div className={styles.container}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

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