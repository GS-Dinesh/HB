import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface OverallStatsDoughnutProps {
  completed: number;
  total: number;
}

export const OverallStatsDoughnut: React.FC<OverallStatsDoughnutProps> = ({
  completed,
  total,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const left = Math.max(0, total - completed);
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Left'],
        datasets: [{
          data: total === 0 ? [0, 1] : [completed, left],
          backgroundColor: total === 0 ? ['rgba(39,39,42,0.2)', '#27272a'] : ['#ef4444', '#27272a'],
          borderColor: '#151518',
          borderWidth: 2,
          hoverOffset: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: total > 0,
            backgroundColor: '#151518',
            titleColor: '#f4f4f5',
            bodyColor: '#f4f4f5',
            borderColor: '#27272a',
            borderWidth: 1,
            titleFont: { family: 'Outfit' },
            bodyFont: { family: 'Outfit' }
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
  }, [completed, total, left]);

  return (
    <div className="glow-card" style={{ padding: '1.25rem', height: '280px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Overall Stats</h3>
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>
        {/* Canvas for Doughnut */}
        <div style={{ position: 'relative', width: '130px', height: '130px', margin: 'auto 0' }}>
          <canvas ref={canvasRef} />
          {/* Centered text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', lineHeight: 1 }}>{rate}%</span>
            <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginTop: '0.15rem' }}>Completed</span>
          </div>
        </div>

        {/* Legend Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.65rem', paddingLeft: '1.5rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block', flexShrink: 0 }}></span>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completed</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{completed}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27272a', display: 'inline-block', flexShrink: 0 }}></span>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Left</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{left}</span>
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border-color)', margin: '0.15rem 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent', border: '1px solid var(--text-muted)', display: 'inline-block', flexShrink: 0 }}></span>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Possible</span>
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
