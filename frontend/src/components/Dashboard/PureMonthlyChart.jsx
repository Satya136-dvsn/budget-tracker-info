import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/currencyFormatter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PureMonthlyChart = ({ months = 3 }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Generate demo data for the chart
    const generateDemoData = () => {
      const monthNames = ['Jul 25', 'Aug 25', 'Sep 25'];
      const incomeData = [5000, 5200, 5100];
      const expenseData = [3500, 3700, 3600];
      const savingsData = [1500, 1500, 1500];

      return {
        labels: monthNames,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            borderColor: 'rgba(16, 185, 129, 0.8)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: 'rgba(16, 185, 129, 0.8)',
            pointBorderColor: 'rgba(255, 255, 255, 0.9)',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: 'rgba(239, 68, 68, 0.8)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: 'rgba(239, 68, 68, 0.8)',
            pointBorderColor: 'rgba(255, 255, 255, 0.9)',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Net Savings',
            data: savingsData,
            borderColor: 'rgba(102, 126, 234, 0.8)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(102, 126, 234, 0.8)',
            pointBorderColor: 'rgba(255, 255, 255, 0.9)',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      };
    };

    setChartData(generateDemoData());
  }, [months]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for clean look
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11,
            weight: '500'
          },
          callback: function(value) {
            return '₹' + (value / 1000) + 'k';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  if (!chartData) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        Loading chart...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PureMonthlyChart;