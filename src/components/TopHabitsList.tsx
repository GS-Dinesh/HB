import React from 'react';

interface Habit {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TopHabitsListProps {
  habits: Habit[];
  days: string[];
  completions: Record<string, Record<string, boolean>>;
}

export const TopHabitsList: React.FC<TopHabitsListProps> = ({
  habits,
  days,
  completions,
}) => {
  // Calculate completion rates and attach to habits
  const scoredHabits = habits.map(habit => {
    let checkedCount = 0;
    days.forEach(day => {
      if (completions[habit.id]?.[day]) {
        checkedCount++;
      }
    });
    const rate = days.length > 0 ? Math.round((checkedCount / days.length) * 100) : 0;
    return { ...habit, rate };
  });

  // Sort descending by completion percentage and slice top 5
  const topHabits = scoredHabits.sort((a, b) => b.rate - a.rate).slice(0, 5);

  return (
    <div className="glow-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Top 5 Habits</h3>
      {habits.length === 0 ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          No data available
        </span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {topHabits.map((habit, index) => (
            <div key={habit.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                <span style={{ 
                  color: index === 0 ? 'var(--primary-red)' : index === 1 ? '#f87171' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  width: '12px'
                }}>
                  {index + 1}
                </span>
                <span style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {habit.name}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: habit.rate >= 70 ? '#10b981' : habit.rate >= 40 ? '#f59e0b' : 'var(--primary-red)' }}>
                {habit.rate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
