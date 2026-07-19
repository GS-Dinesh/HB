import { useState, useEffect } from 'react';
import { SidebarLeft } from './components/SidebarLeft';
import { getCookie, setCookie, eraseCookie } from './utils/cookies';
import { MetricRow } from './components/MetricRow';
import { DailyProgressBarChart } from './components/DailyProgressBarChart';
import { HabitChecklistGrid } from './components/HabitChecklistGrid';
import { OverallStatsDoughnut } from './components/OverallStatsDoughnut';
import { HabitAnalysisList } from './components/HabitAnalysisList';
import { TopHabitsList } from './components/TopHabitsList';
import { ModalAddHabit } from './components/ModalAddHabit';
import { ModalAchievement } from './components/ModalAchievement';
import { ModalOnboarding } from './components/ModalOnboarding';
import { ModalConfirm } from './components/ModalConfirm';
import { ACHIEVEMENTS_LIST } from './utils/achievements';
import type { Achievement } from './utils/achievements';
import { audio } from './utils/audio';
import { triggerConfetti } from './utils/confetti';
import { Plus, RefreshCw, LayoutDashboard } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UserStats {
  xp: number;
  level: number;
  totalCredits: number;
  unlockedAchievements: string[];
  username?: string;
  avatar?: string;
}

const DEFAULT_HABITS: Habit[] = [];

const DEFAULT_DAYS = Array.from({ length: 21 }, (_, i) => `Day ${i + 1}`);

export default function App() {
  // Load State from Cookies (with LocalStorage fallback)
  const [habits, setHabits] = useState<Habit[]>(() => {
    const cookieSaved = getCookie('hg_habits');
    if (cookieSaved) {
      try {
        return JSON.parse(cookieSaved);
      } catch (e) {
        console.error('Failed to parse habits cookie:', e);
      }
    }
    const saved = localStorage.getItem('hg_habits');
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [days, setDays] = useState<string[]>(() => {
    const cookieSaved = getCookie('hg_days');
    if (cookieSaved) {
      try {
        return JSON.parse(cookieSaved);
      } catch (e) {
        console.error('Failed to parse days cookie:', e);
      }
    }
    const saved = localStorage.getItem('hg_days');
    return saved ? JSON.parse(saved) : DEFAULT_DAYS;
  });

  const [completions, setCompletions] = useState<Record<string, Record<string, boolean>>>(() => {
    const cookieSaved = getCookie('hg_completions');
    if (cookieSaved) {
      try {
        return JSON.parse(cookieSaved);
      } catch (e) {
        console.error('Failed to parse completions cookie:', e);
      }
    }
    const saved = localStorage.getItem('hg_completions');
    return saved ? JSON.parse(saved) : {};
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const cookieSaved = getCookie('hg_stats');
    let saved = null;
    if (cookieSaved) {
      saved = cookieSaved;
    } else {
      saved = localStorage.getItem('hg_stats');
    }
    const defaultStats = { 
      xp: 0, 
      level: 1, 
      totalCredits: 0, 
      unlockedAchievements: [],
      username: '',
      avatar: ''
    };
    if (!saved) return defaultStats;
    try {
      const parsed = JSON.parse(saved);
      return { ...defaultStats, ...parsed };
    } catch (e) {
      console.error('Failed to parse stats:', e);
      return defaultStats;
    }
  });

  const [startDate, setStartDate] = useState<string>(() => {
    const cookieSaved = getCookie('hg_start_date');
    if (cookieSaved) return cookieSaved;
    const saved = localStorage.getItem('hg_start_date');
    if (saved) return saved;
    const nowStr = new Date().toISOString();
    setCookie('hg_start_date', nowStr);
    localStorage.setItem('hg_start_date', nowStr);
    return nowStr;
  });

  // UI state
  const [isNewUser, setIsNewUser] = useState<boolean>(() => {
    const cookieSaved = getCookie('hg_stats');
    if (cookieSaved) {
      try {
        const parsed = JSON.parse(cookieSaved);
        if (parsed && parsed.username) return false;
      } catch (e) {}
    }
    const localSaved = localStorage.getItem('hg_stats');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (parsed && parsed.username) return false;
      } catch (e) {}
    }
    return true;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);

  // Confirmation Modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Sync to Cookies and LocalStorage on changes
  useEffect(() => {
    const serialized = JSON.stringify(habits);
    setCookie('hg_habits', serialized);
    localStorage.setItem('hg_habits', serialized);
  }, [habits]);

  useEffect(() => {
    const serialized = JSON.stringify(days);
    setCookie('hg_days', serialized);
    localStorage.setItem('hg_days', serialized);
  }, [days]);

  useEffect(() => {
    const serialized = JSON.stringify(completions);
    setCookie('hg_completions', serialized);
    localStorage.setItem('hg_completions', serialized);
  }, [completions]);

  useEffect(() => {
    const serialized = JSON.stringify(stats);
    setCookie('hg_stats', serialized);
    localStorage.setItem('hg_stats', serialized);
  }, [stats]);

  useEffect(() => {
    setCookie('hg_start_date', startDate);
    localStorage.setItem('hg_start_date', startDate);
  }, [startDate]);

  // Total possible checklist slots
  const totalPossibleChecks = habits.length * days.length;

  // Calculate current completed checks
  let completedChecks = 0;
  habits.forEach(habit => {
    days.forEach(day => {
      if (completions[habit.id]?.[day]) {
        completedChecks++;
      }
    });
  });

  // Calculate overall streak
  const calculateOverallStreak = () => {
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let d = 0; d < days.length; d++) {
      const day = days[d];
      let dayCompleted = false;
      for (let h = 0; h < habits.length; h++) {
        if (completions[habits[h].id]?.[day]) {
          dayCompleted = true;
          break;
        }
      }

      if (dayCompleted) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    // Current Streak counting backwards (with 1 day buffer)
    let lastCheckedIdx = -1;
    for (let d = days.length - 1; d >= 0; d--) {
      const day = days[d];
      let dayCompleted = false;
      for (let h = 0; h < habits.length; h++) {
        if (completions[habits[h].id]?.[day]) {
          dayCompleted = true;
          break;
        }
      }
      if (dayCompleted) {
        lastCheckedIdx = d;
        break;
      }
    }

    if (lastCheckedIdx !== -1 && lastCheckedIdx >= days.length - 2) {
      for (let d = lastCheckedIdx; d >= 0; d--) {
        const day = days[d];
        let dayCompleted = false;
        for (let h = 0; h < habits.length; h++) {
          if (completions[habits[h].id]?.[day]) {
            dayCompleted = true;
            break;
          }
        }
        if (dayCompleted) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return { currentStreak, bestStreak };
  };

  const { currentStreak, bestStreak } = calculateOverallStreak();

  // Onboarding Complete Action
  const handleOnboardingComplete = (name: string, avatarData: string) => {
    setStats(prev => ({
      ...prev,
      username: name,
      avatar: avatarData
    }));
    setIsNewUser(false);
    setTimeout(() => {
      audio.playLevelUp();
      triggerConfetti();
    }, 200);
  };

  // Add Habit Action
  const handleAddHabit = (name: string, description: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name,
      description,
      difficulty
    };
    setHabits(prev => [...prev, newHabit]);
  };



  // Delete Habit Action
  const handleDeleteHabit = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Habit',
      message: 'Are you sure you want to delete this habit tracker? This action cannot be undone.',
      onConfirm: () => {
        setHabits(prev => prev.filter(h => h.id !== id));
        setCompletions(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };



  // Toggle Check Action & XP System
  const handleToggleCheck = (habitId: string, day: string) => {
    const dayIndex = days.indexOf(day);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - start.getTime();
    const todayIndex = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    if (dayIndex !== todayIndex) {
      return;
    }

    const isNowChecked = !(completions[habitId]?.[day] || false);
    
    // Play synthesis sound
    audio.playToggle(isNowChecked);

    // Calculate XP reward
    const targetHabit = habits.find(h => h.id === habitId);
    if (!targetHabit) return;

    let xpChange = 10; // Easy default
    if (targetHabit.difficulty === 'medium') xpChange = 20;
    else if (targetHabit.difficulty === 'hard') xpChange = 30;

    const actualXpChange = isNowChecked ? xpChange : -xpChange;

    // Toggle completion state
    setCompletions(prev => {
      const habitComps = prev[habitId] ? { ...prev[habitId] } : {};
      if (isNowChecked) {
        habitComps[day] = true;
      } else {
        delete habitComps[day];
      }
      return {
        ...prev,
        [habitId]: habitComps
      };
    });

    // Update Stats and Handle Level Up
    setStats(prev => {
      let newXp = prev.xp + actualXpChange;
      let newLevel = prev.level;
      let totalCr = Math.max(0, prev.totalCredits + actualXpChange);

      if (newXp < 0) {
        // Prevent dropping levels, just cap XP at 0 if it goes negative
        newXp = 0;
      }

      // Check level up threshold
      const xpNeeded = newLevel * 150;
      if (isNowChecked && newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
        // Trigger Level Up celebratory elements
        setTimeout(() => {
          triggerConfetti();
          audio.playLevelUp();
        }, 300);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalCredits: totalCr
      };
    });
  };

  // Run Achievement Verification Loop
  useEffect(() => {
    const checkAchievements = () => {
      const unlocked = [...stats.unlockedAchievements];
      const newlyUnlocked: string[] = [];

      // 1. First Step
      if (!unlocked.includes('first_step') && completedChecks >= 1) {
        newlyUnlocked.push('first_step');
      }

      // 2. Streak Starter
      if (!unlocked.includes('streak_starter')) {
        let has3Streak = false;
        for (const habit of habits) {
          let temp = 0;
          for (const day of days) {
            if (completions[habit.id]?.[day]) {
              temp++;
              if (temp >= 3) {
                has3Streak = true;
                break;
              }
            } else {
              temp = 0;
            }
          }
          if (has3Streak) break;
        }
        if (has3Streak) newlyUnlocked.push('streak_starter');
      }

      // 3. Habit Master
      if (!unlocked.includes('habit_master') && habits.length >= 5) {
        newlyUnlocked.push('habit_master');
      }

      // 4. Perfectionist
      if (!unlocked.includes('perfectionist') && habits.length > 0 && days.length > 0) {
        let perfectDayFound = false;
        for (const day of days) {
          let allChecked = true;
          for (const habit of habits) {
            if (!completions[habit.id]?.[day]) {
              allChecked = false;
              break;
            }
          }
          if (allChecked) {
            perfectDayFound = true;
            break;
          }
        }
        if (perfectDayFound) newlyUnlocked.push('perfectionist');
      }

      // 5. Century Club
      if (!unlocked.includes('century_club') && stats.totalCredits >= 500) {
        newlyUnlocked.push('century_club');
      }

      // 6. Completionist
      const coreAchievements = ['first_step', 'streak_starter', 'habit_master', 'perfectionist', 'century_club'];
      const currentUnlocksCombined = [...unlocked, ...newlyUnlocked];
      const allCoreUnlocked = coreAchievements.every(id => currentUnlocksCombined.includes(id));
      
      if (!unlocked.includes('completionist') && allCoreUnlocked) {
        newlyUnlocked.push('completionist');
      }

      if (newlyUnlocked.length > 0) {
        // Unlock first new achievement found
        const firstNewId = newlyUnlocked[0];
        const achDef = ACHIEVEMENTS_LIST.find(a => a.id === firstNewId);
        
        if (achDef) {
          // Update unlocked status
          setStats(prev => {
            let nextXp = prev.xp + achDef.xpReward;
            let nextLevel = prev.level;
            let nextCredits = prev.totalCredits + achDef.xpReward;

            const nextXpNeeded = nextLevel * 150;
            if (nextXp >= nextXpNeeded) {
              nextXp -= nextXpNeeded;
              nextLevel += 1;
              setTimeout(() => {
                triggerConfetti();
                audio.playLevelUp();
              }, 400);
            }

            return {
              ...prev,
              xp: nextXp,
              level: nextLevel,
              totalCredits: nextCredits,
              unlockedAchievements: [...prev.unlockedAchievements, achDef.id]
            };
          });

          // Show celebration modal
          setActiveAchievement(achDef);
        }
      }
    };

    checkAchievements();
  }, [completions, habits, days, stats.unlockedAchievements, stats.totalCredits, completedChecks]);

  // Reset Application Action
  const handleResetData = () => {
    setConfirmState({
      isOpen: true,
      title: 'Reset Application Data',
      message: 'Reset all habit tracking data? This cannot be undone.',
      onConfirm: () => {
        setHabits(DEFAULT_HABITS);
        setDays(DEFAULT_DAYS);
        setCompletions({});
        setStats({ 
          xp: 0, 
          level: 1, 
          totalCredits: 0, 
          unlockedAchievements: [],
          username: '',
          avatar: ''
        });
        const nowStr = new Date().toISOString();
        setStartDate(nowStr);
        localStorage.clear();
        eraseCookie('hg_habits');
        eraseCookie('hg_days');
        eraseCookie('hg_completions');
        eraseCookie('hg_stats');
        eraseCookie('hg_start_date');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  };

  return (
    <div className="dashboard-layout">
      
      {/* Left Column (Sticky Sidebar) */}
      <aside className="sidebar-aside">
        <SidebarLeft 
          username={stats.username || 'Player'}
          avatar={stats.avatar || ''}
          onUpdateProfile={(name, avatarVal) => {
            setStats(prev => ({ ...prev, username: name, avatar: avatarVal }));
          }}
          level={stats.level} 
          xp={stats.xp} 
          xpNeeded={stats.level * 150} 
          totalCredits={stats.totalCredits} 
          achievements={ACHIEVEMENTS_LIST} 
          unlockedIds={stats.unlockedAchievements} 
        />
      </aside>

      {/* Main Layout Area */}
      <main className="main-content-area">
        
        {/* Mobile Action Buttons (Visible only on mobile) */}
        <div className="mobile-action-buttons">
          <button className="btn-secondary" onClick={handleResetData} style={{ fontSize: '0.75rem' }}>
            <RefreshCw size={14} /> Reset Data
          </button>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Habit
          </button>
        </div>

        {/* Dashboard Header Banner */}
        <header className="main-header">
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={22} style={{ color: 'var(--primary-red)' }} /> Annual Habit Tracker
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyze and track habits over custom sequential intervals.</span>
          </div>
          
          <div className="desktop-action-buttons" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" onClick={handleResetData} style={{ fontSize: '0.75rem' }}>
              <RefreshCw size={14} /> Reset Data
            </button>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} /> Add Habit
            </button>
          </div>
        </header>

        {/* top row statistics cards */}
        <div className="metrics-row-wrapper">
          <MetricRow 
            currentStreak={currentStreak} 
            bestStreak={bestStreak} 
            completedChecks={completedChecks} 
            totalChecks={totalPossibleChecks} 
            activeHabitsCount={habits.length} 
          />
        </div>

        {/* Split Grid Area */}
        <div className="split-columns-grid">
          
          {/* Main Grid: Checklist & Daily Progress Bar Chart */}
          <div className="main-left-column">
            <div className="daily-progress-card">
              <DailyProgressBarChart 
                days={days} 
                habits={habits} 
                completions={completions} 
              />
            </div>
            <div className="checklist-card">
              <HabitChecklistGrid 
                habits={habits} 
                days={days} 
                completions={completions} 
                onToggleCheck={handleToggleCheck} 
                onDeleteHabit={handleDeleteHabit} 
                startDate={startDate}
              />
            </div>
          </div>

          {/* Right Column: Doughnut overall rate, Analysis list, Top habits list */}
          <div className="main-right-column">
            <div className="overall-stats-card">
              <OverallStatsDoughnut 
                completed={completedChecks} 
                total={totalPossibleChecks} 
              />
            </div>
            <div className="analysis-card">
              <HabitAnalysisList 
                habits={habits} 
                days={days} 
                completions={completions} 
              />
            </div>
            <div className="top-habits-card">
              <TopHabitsList 
                habits={habits} 
                days={days} 
                completions={completions} 
              />
            </div>
          </div>

        </div>

      </main>

      {/* Modal Actions */}
      <ModalAddHabit 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddHabit} 
      />

      <ModalAchievement 
        isOpen={activeAchievement !== null} 
        onClose={() => setActiveAchievement(null)} 
        achievement={activeAchievement} 
      />

      <ModalOnboarding 
        isOpen={isNewUser}
        onComplete={handleOnboardingComplete}
      />

      <ModalConfirm 
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
