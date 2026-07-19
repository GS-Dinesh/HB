import React from 'react';
import { Flame, Trash2, Check, X, Lock } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface HabitChecklistGridProps {
  habits: Habit[];
  days: string[];
  completions: Record<string, Record<string, boolean>>;
  onToggleCheck: (habitId: string, day: string) => void;
  onDeleteHabit: (habitId: string) => void;
  startDate: string;
}

export const HabitChecklistGrid: React.FC<HabitChecklistGridProps> = ({
  habits,
  days,
  completions,
  onToggleCheck,
  onDeleteHabit,
  startDate,
}) => {
  // Live Timer state
  const [timeRemaining, setTimeRemaining] = React.useState('');

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        return;
      }
      const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeRemaining(`${hrs}:${mins}:${secs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate todayIndex based on startDate
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - start.getTime();
  const todayIndex = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  // Calculate current streak and max streak for a habit
  const calculateStreak = (habitId: string) => {
    let current = 0;
    let max = 0;
    let temp = 0;

    // Max Streak: Longest contiguous run of checked days
    for (let i = 0; i < days.length; i++) {
      const isChecked = completions[habitId]?.[days[i]] || false;
      if (isChecked) {
        temp++;
        if (temp > max) max = temp;
      } else {
        temp = 0;
      }
    }

    // Current Streak counting backwards from today index
    let startIdx = todayIndex;
    if (startIdx >= days.length) {
      startIdx = days.length - 1;
    }
    
    const isTodayChecked = completions[habitId]?.[days[startIdx]] || false;
    const isYesterdayChecked = startIdx > 0 ? completions[habitId]?.[days[startIdx - 1]] || false : false;
    
    if (isTodayChecked) {
      for (let i = startIdx; i >= 0; i--) {
        if (completions[habitId]?.[days[i]]) {
          current++;
        } else {
          break;
        }
      }
    } else if (isYesterdayChecked) {
      for (let i = startIdx - 1; i >= 0; i--) {
        if (completions[habitId]?.[days[i]]) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, max };
  };

  return (
    <div className="glow-card" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Title & Actions bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Habit Checklist</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {todayIndex < days.length ? (
              <>
                Active: <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>{days[todayIndex]}</span>
                <span style={{ color: 'var(--text-dark)' }}>|</span>
                Ends in: <span style={{ color: 'var(--primary-red)', fontWeight: 700, fontFamily: 'monospace' }}>{timeRemaining}</span>
              </>
            ) : (
              <span style={{ color: 'var(--difficulty-easy)', fontWeight: 700 }}>21-day program completed!</span>
            )}
          </span>
        </div>
      </div>

      {/* Grid container with Horizontal Scroll */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        {habits.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No habits added yet. Click "+ Add Habit" above to get started!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
                {/* Habit details column */}
                <th style={{ padding: '1rem 1.5rem', width: '220px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>Habit</th>
                
                {/* Scrollable Day Columns */}
                {days.map((day, idx) => {
                  const isActive = idx === todayIndex;
                  return (
                    <th key={day} style={{ 
                      padding: '0.75rem 0.5rem', 
                      textAlign: 'center', 
                      fontSize: '0.75rem', 
                      color: isActive ? 'var(--primary-red)' : 'var(--text-muted)', 
                      fontWeight: 700,
                      width: '65px',
                      minWidth: '65px',
                      backgroundColor: isActive ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                        <span>{day}</span>
                        {isActive && (
                          <span style={{ fontSize: '0.55rem', color: 'var(--primary-red)', textTransform: 'uppercase', fontWeight: 800 }}>
                            Today
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
                
                {/* Streaks and Actions */}
                <th style={{ padding: '1rem 1rem', textAlign: 'center', width: '90px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Streak</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', width: '80px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {habits.map(habit => {
                const streak = calculateStreak(habit.id);
                return (
                  <tr key={habit.id} className="habit-row" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'background-color 0.2s' }}>
                    
                    {/* Habit Info */}
                    <td style={{ padding: '1rem 1.5rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxWidth: '200px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={habit.name}>
                          {habit.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className={`badge badge-${habit.difficulty}`}>
                            {habit.difficulty}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Checkboxes per day */}
                    {days.map((day, idx) => {
                      const isChecked = completions[habit.id]?.[day] || false;
                      const isPast = idx < todayIndex;
                      const isToday = idx === todayIndex;

                      return (
                        <td 
                          key={day} 
                          style={{ 
                            textAlign: 'center', 
                            verticalAlign: 'middle', 
                            padding: '0.5rem',
                            backgroundColor: isToday ? 'rgba(239, 68, 68, 0.01)' : 'transparent'
                          }}
                        >
                          {isPast ? (
                            isChecked ? (
                              <div className="checkmark-completed" title="Completed">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="checkmark-missed" title="Missed">
                                <X size={14} strokeWidth={3} />
                              </div>
                            )
                          ) : isToday ? (
                            <label className="checkbox-container">
                              <input 
                                type="checkbox" 
                                checked={isChecked} 
                                onChange={() => onToggleCheck(habit.id, day)}
                              />
                              <span className="checkmark animate-pulse-border">
                                <Check />
                              </span>
                            </label>
                          ) : (
                            <div className="checkmark-locked" title="Locked (Future day)">
                              <Lock size={12} strokeWidth={2.5} style={{ opacity: 0.5 }} />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Streak fire indicator */}
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: streak.current > 0 ? 'var(--primary-red)' : 'var(--text-dark)' }}>
                          <Flame size={16} style={{ filter: streak.current > 0 ? 'drop-shadow(0 0 4px var(--primary-red))' : 'none' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{streak.current}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>max: {streak.max}</span>
                      </div>
                    </td>

                    {/* Delete action */}
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', verticalAlign: 'middle' }}>
                      <button 
                        onClick={() => onDeleteHabit(habit.id)}
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          color: 'var(--text-dark)', 
                          cursor: 'pointer', 
                          transition: 'color 0.2s' 
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-red)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dark)'}
                        title="Delete Habit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
