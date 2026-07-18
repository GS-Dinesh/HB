import React from 'react';
import { Flame, CheckCircle, Target, ListTodo } from 'lucide-react';

interface MetricRowProps {
  currentStreak: number;
  bestStreak: number;
  completedChecks: number;
  totalChecks: number;
  activeHabitsCount: number;
}

export const MetricRow: React.FC<MetricRowProps> = ({
  currentStreak,
  bestStreak,
  completedChecks,
  totalChecks,
  activeHabitsCount,
}) => {
  const completionRate = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
      {/* Card 1: Overall Progress */}
      <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <CheckCircle size={26} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Overall Progress</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-main)' }}>{completionRate}%</h2>
          <div className="linear-progress-track" style={{ marginTop: '0.4rem' }}>
            <div className="linear-progress-fill" style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
          </div>
        </div>
      </div>

      {/* Card 2: Current Streak */}
      <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--primary-red)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Flame size={26} style={{ filter: 'drop-shadow(0 0 5px var(--primary-red))' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Current Streak</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-main)' }}>{currentStreak} Days</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Best: {bestStreak} Days</span>
        </div>
      </div>

      {/* Card 3: Habits Completed */}
      <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          color: '#ef4444',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Target size={26} />
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Habits Completed</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-main)' }}>{completedChecks}/{totalChecks}</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Checked Tasks Ratio</span>
        </div>
      </div>

      {/* Card 4: Total Habits */}
      <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          background: 'rgba(161, 161, 170, 0.1)',
          color: '#a1a1aa',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ListTodo size={26} />
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Total Habits</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.1rem 0', color: 'var(--text-main)' }}>{activeHabitsCount}</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Active Trackers</span>
        </div>
      </div>
    </div>
  );
};
