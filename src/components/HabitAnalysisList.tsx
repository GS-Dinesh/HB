import React from 'react';

interface Habit {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface HabitAnalysisListProps {
  habits: Habit[];
  days: string[];
  completions: Record<string, Record<string, boolean>>;
}

export const HabitAnalysisList: React.FC<HabitAnalysisListProps> = ({
  habits,
  days,
  completions,
}) => {
  return (
    <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Analysis</h3>
      {habits.length === 0 ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          No habits recorded
        </span>
      ) : (
        habits.map(habit => {
          // Calculate specific habit completion percentage
          let checkedCount = 0;
          days.forEach(day => {
            if (completions[habit.id]?.[day]) {
              checkedCount++;
            }
          });
          const rate = days.length > 0 ? Math.round((checkedCount / days.length) * 100) : 0;

          return (
            <div key={habit.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                  {habit.name}
                </span>
                <span style={{ color: rate >= 70 ? '#10b981' : rate >= 40 ? '#f59e0b' : 'var(--primary-red)' }}>{rate}%</span>
              </div>
              <div className="linear-progress-track">
                <div 
                  className="linear-progress-fill" 
                  style={{ 
                    width: `${rate}%`,
                    background: 'linear-gradient(90deg, #ef4444, #f87171)',
                    boxShadow: '0 0 5px rgba(239, 68, 68, 0.4)'
                  }}
                ></div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
