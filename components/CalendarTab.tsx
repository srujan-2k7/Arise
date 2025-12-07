import React from 'react';
import { Quest } from '../types';
import { Calendar as CalendarIcon, Target } from 'lucide-react';

interface CalendarTabProps {
  quests: Quest[];
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ quests }) => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentYear, today.getMonth(), 1).getDay();

  // Simple random daily goal
  const dailyGoals = [
    "Complete 1 'Strength' Quest",
    "Study for 1 hour (Academics)",
    "Meditate (Discipline)",
    "Review your progress",
    "Rest and recover"
  ];
  const todaysGoal = dailyGoals[today.getDate() % dailyGoals.length];

  const getQuestsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return quests.filter(q => q.date === dateStr && !q.completed);
  };

  const renderCalendarGrid = () => {
    const grid = [];
    for (let i = 0; i < startDay; i++) {
      grid.push(<div key={`empty-${i}`} className="h-12" />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate();
      const dayQuests = getQuestsForDay(i);
      const hasQuests = dayQuests.length > 0;

      grid.push(
        <div 
          key={i} 
          className={`h-12 border border-zinc-900 flex flex-col items-center justify-center relative rounded-md transition-colors ${
            isToday 
            ? 'bg-arise-red text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] border-transparent' 
            : 'text-zinc-500 hover:bg-zinc-900'
          }`}
        >
          <span className={`font-display font-bold text-lg ${isToday ? '' : ''}`}>{i}</span>
          {hasQuests && !isToday && (
             <div className="absolute bottom-1 w-1 h-1 rounded-full bg-arise-red"></div>
          )}
          {hasQuests && isToday && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></div>
          )}
        </div>
      );
    }
    return grid;
  };

  const todaysQuests = getQuestsForDay(today.getDate());

  return (
    <div className="h-full flex flex-col p-5 pb-28 overflow-y-auto">
      <header className="mb-6">
        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
          Schedule
        </h2>
        <div className="h-1 w-12 bg-arise-red rounded-full mt-1"></div>
      </header>

      {/* Month View */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-20 h-20 bg-arise-red/10 blur-2xl rounded-full"></div>
         <div className="text-center font-display font-bold text-white mb-6 text-xl uppercase tracking-widest">
            {currentMonth} <span className="text-arise-red">{currentYear}</span>
         </div>
         
         <div className="grid grid-cols-7 gap-1 text-center mb-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
             <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
         </div>
         <div className="grid grid-cols-7 gap-1">
             {renderCalendarGrid()}
         </div>
      </div>

      {/* Daily Goal */}
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-arise-red/30 p-5 bg-gradient-to-r from-black to-zinc-900">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-arise-red"></div>
            <h3 className="text-arise-red font-bold text-xs uppercase flex items-center mb-2 tracking-widest">
                <Target size={14} className="mr-2" /> Daily Objective
            </h3>
            <p className="text-white font-display text-lg">"{todaysGoal}"</p>
        </div>

        <h3 className="text-white font-display font-bold mt-6 uppercase tracking-wider text-sm">Priority Tasks</h3>
        <div className="space-y-2">
            {todaysQuests.length > 0 ? (
            todaysQuests.map(q => (
                <div key={q.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm">
                    <div>
                        <div className="font-bold text-white">{q.name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{q.stat}</div>
                    </div>
                    <div className="text-xs font-bold text-arise-red border border-arise-red/30 px-2 py-1 rounded bg-red-900/10 uppercase">
                        Rank {q.difficulty}
                    </div>
                </div>
            ))
            ) : (
                <div className="p-4 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-600 text-xs uppercase tracking-widest">
                    No active tasks for today
                </div>
            )}
        </div>
      </div>
    </div>
  );
};