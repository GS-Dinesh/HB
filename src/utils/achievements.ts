export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Reference for Lucide icons
  xpReward: number;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit task',
    icon: 'CheckSquare',
    xpReward: 50
  },
  {
    id: 'streak_starter',
    title: 'Streak Starter',
    description: 'Reach a 3-day streak on any habit',
    icon: 'Flame',
    xpReward: 100
  },
  {
    id: 'habit_master',
    title: 'Habit Master',
    description: 'Create 5 or more active habits at the same time',
    icon: 'Award',
    xpReward: 150
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Check all habits on any single day',
    icon: 'Zap',
    xpReward: 200
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Earn a total of 500 or more Credits (XP)',
    icon: 'Coins',
    xpReward: 250
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Unlock all other achievements',
    icon: 'Trophy',
    xpReward: 300
  }
];
