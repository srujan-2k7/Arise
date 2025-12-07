import React from 'react';
import { UserStats, StatType } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';

interface StatsTabProps {
  stats: UserStats;
}

export const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  // Map full stat names to first letter for the chart
  const data = Object.values(StatType).map((statName) => ({
    subject: statName.charAt(0), // Only first letter
    full: statName,
    A: stats[statName],
    fullMark: Math.max(...Object.values(stats), 100), 
  }));

  return (
    <div className="h-full flex flex-col p-5 pb-28 overflow-y-auto">
       <header className="mb-6">
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
            Status
          </h2>
          <div className="h-1 w-12 bg-arise-red rounded-full mt-1"></div>
        </header>
      
      {/* Hexograph */}
      <div className="relative w-full aspect-square mb-6 -mx-2">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 to-transparent rounded-full animate-pulse" />
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#27272a" strokeWidth={1} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#ffffff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Rajdhani' }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Stats"
              dataKey="A"
              stroke="#ef4444"
              strokeWidth={3}
              fill="#ef4444"
              fillOpacity={0.5}
              isAnimationActive={true}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats List */}
      <div className="grid gap-3">
        {Object.values(StatType).map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat} 
            className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
          >
            <div className="flex items-center">
               <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center font-display font-bold text-arise-red mr-3">
                 {stat.charAt(0)}
               </div>
               <div>
                  <h4 className="text-white font-display font-bold uppercase tracking-wider">{stat}</h4>
               </div>
            </div>
            <div className="text-xl font-mono font-bold text-white">
              {stats[stat]} <span className="text-xs text-zinc-600 ml-1">XP</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 border border-dashed border-zinc-800 rounded-xl text-center">
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Level up required: All stats {'>'} {Math.floor(Math.min(...Object.values(stats))/100 + 1) * 100} XP
          </p>
      </div>
    </div>
  );
};