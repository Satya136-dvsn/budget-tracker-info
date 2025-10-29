import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../utils/currencyFormatter';

ChartJS.register(ArcElement, Tooltip, Legend);

const PureCategoryChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Generate demo data for the chart
    const generateDemoData = () => {
      const categories = [
        { name: 'Food & Dining', amount: 8500, color: 'rgba(16, 185, 129, 0.8)' },
        { name: 'Transportation', amount: 6200, color: 'rgba(102, 126, 234, 0.8)' },
        { name: 'Shopping', amount: 4800, color: 'rgba(139, 92, 246, 0.8)' },
        { name: 'Entertainment', amount: 3200, color: 'rgba(245, 158, 11, 0.8)' },
        { name: 'Bills & Utilities', amount: 2800, color: 'rgba(239, 68, 68, 0.8)' }
      ];

      const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

      return {
        labels: categories.map(cat => cat.name),
        datasets: [
          {
            data: categories.map(cat => cat.amount),
            backgroundColor: categories.map(cat => cat.color),
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            hoverBackgroundColor: categories.map(cat => {
              // Brighten the color on hover
              const rgba = cat.color.match(/rgba?\(([^)]+)\)/)[1].split(',');
              return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.9)`;
            }),
            hoverBorderColor: 'rgba(255, 255, 255, 0.4)',
            hoverBorderWidth: 4,
            hoverOffset: 8,
            spacing: 2,
          }
        ]
      };
    };

    setChartData(generateDemoData());
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'nearest'
    },
    plugins: {
      legend: {
        display: false, // Hide legend for clean look
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13,
          weight: '500'
        },
        filter: function(tooltipItem) {
          return tooltipItem.parsed > 0;
        },
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `Amount: ${formatCurrency(context.parsed)}`;
          },
          afterLabel: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `Percentage: ${percentage}%`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverBorderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        hoverOffset: 8
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart'
    },
    onHover: (event, activeElements, chart) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
    },
    cutout: 0, // Full pie chart
    radius: '85%', // Make it fill most of the container with some padding
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
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default PureCategoryChart;