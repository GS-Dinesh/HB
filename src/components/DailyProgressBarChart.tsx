import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface DailyProgressBarChartProps {
  days: string[];
  habits: Array<{ id: string }>;
  completions: Record<string, Record<string, boolean>>;
}

export const DailyProgressBarChart: React.FC<DailyProgressBarChartProps> = ({
  days,
  habits,
  completions,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Get last 7 days for the dashboard visualization
  const displayDays = days.slice(-7);

  // Compute completion rate for each display day
  const dataValues = displayDays.map(day => {
    if (habits.length === 0) return 0;
    let completedCount = 0;
    habits.forEach(habit => {
      if (completions[habit.id]?.[day]) {
        completedCount++;
      }
    });
    return Math.round((completedCount / habits.length) * 100);
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, '#ef4444'); // Crimson red top
    gradient.addColorStop(1, '#7f1d1d'); // Dark burgundy bottom

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: displayDays,
        datasets: [{
          label: 'Completion',
          data: dataValues,
          backgroundColor: gradient,
          borderColor: '#ef4444',
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.45,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.y}% completed`,
            },
            backgroundColor: '#151518',
            titleColor: '#f4f4f5',
            bodyColor: '#f4f4f5',
            borderColor: '#27272a',
            borderWidth: 1,
            titleFont: { family: 'Outfit' },
            bodyFont: { family: 'Outfit' }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: {
              color: 'rgba(39, 39, 42, 0.5)',
            },
            border: {
              dash: [4, 4]
            },
            ticks: {
              color: '#a1a1aa',
              callback: (value) => `${value}%`,
              font: {
                family: 'Outfit',
                size: 11
              }
            }
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#a1a1aa',
              font: {
                family: 'Outfit',
                size: 11
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [days, habits, completions]);

  return (
    <div className="glow-card" style={{ padding: '1.25rem', height: '280px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Daily Progress</h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Completion trends</span>
      </div>
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {habits.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Add habits to view daily trends
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
};
