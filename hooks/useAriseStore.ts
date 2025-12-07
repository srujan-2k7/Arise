import { useState, useEffect, useCallback } from 'react';
import { Quest, StatType, UserStats, UserProfile, Rank } from '../types';

const STORAGE_KEY = 'arise_app_data_v1';

interface AppData {
  quests: Quest[];
  stats: UserStats;
  user: UserProfile;
}

const INITIAL_STATS: UserStats = {
  [StatType.ACADEMICS]: 0,
  [StatType.INTELLIGENCE]: 0,
  [StatType.STRENGTH]: 0,
  [StatType.ENDURANCE]: 0,
  [StatType.DISCIPLINE]: 0,
};

const INITIAL_USER: UserProfile = {
  name: 'Srujan',
  age: 20,
  level: 1,
  rank: Rank.E,
  totalXp: 0,
};

export const useAriseStore = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppData = JSON.parse(saved);
        setQuests(parsed.quests);
        setStats(parsed.stats);
        setUser(parsed.user);
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) {
      const data: AppData = { quests, stats, user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [quests, stats, user, isLoaded]);

  const calculateLevelAndRank = useCallback((currentStats: UserStats, currentTotalXp: number) => {
    // Level Up: When 100 XP reached in ALL stats (min stat value / 100) + 1
    const minStat = Math.min(
      currentStats[StatType.ACADEMICS],
      currentStats[StatType.INTELLIGENCE],
      currentStats[StatType.STRENGTH],
      currentStats[StatType.ENDURANCE],
      currentStats[StatType.DISCIPLINE]
    );
    
    const newLevel = Math.floor(minStat / 100) + 1;

    // Rank based on Total XP
    let newRank = Rank.E;
    if (currentTotalXp >= 50000) newRank = Rank.SSS;
    else if (currentTotalXp >= 20000) newRank = Rank.SS;
    else if (currentTotalXp >= 10000) newRank = Rank.S;
    else if (currentTotalXp >= 5000) newRank = Rank.A;
    else if (currentTotalXp >= 2000) newRank = Rank.B;
    else if (currentTotalXp >= 1000) newRank = Rank.C;
    else if (currentTotalXp >= 500) newRank = Rank.D;

    return { level: newLevel, rank: newRank };
  }, []);

  const addQuest = (quest: Quest) => {
    setQuests(prev => [...prev, quest]);
  };

  const deleteQuest = (id: string) => {
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  const completeQuest = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    // Update Stats
    const xpGain = quest.difficulty;
    const newStats = { ...stats, [quest.stat]: stats[quest.stat] + xpGain };
    
    // Update User Totals
    const newTotalXp = user.totalXp + xpGain;
    const { level, rank } = calculateLevelAndRank(newStats, newTotalXp);

    setStats(newStats);
    setUser(prev => ({ ...prev, totalXp: newTotalXp, level, rank }));
    
    // Remove completed quest
    deleteQuest(id);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
      setUser(prev => ({...prev, ...updates}));
  };

  return {
    quests,
    stats,
    user,
    addQuest,
    deleteQuest,
    completeQuest,
    updateUserProfile,
    isLoaded
  };
};
