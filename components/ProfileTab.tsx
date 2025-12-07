import React, { useState } from 'react';
import { UserProfile, UserStats } from '../types';
import { User, TrendingUp, Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileTabProps {
  user: UserProfile;
  stats: UserStats;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, stats, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAge, setEditAge] = useState(user.age.toString());

  const handleSave = () => {
    onUpdate({
      name: editName,
      age: parseInt(editAge) || user.age
    });
    setIsEditing(false);
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'S': case 'SS': case 'SSS': return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]';
      case 'A': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]';
      case 'B': return 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="h-full flex flex-col p-6 pb-28 overflow-y-auto">
      <div className="flex justify-end mb-2">
         <button 
           onClick={() => {
             if(isEditing) handleSave(); 
             else setIsEditing(true);
           }}
           className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-800"
         >
           {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
         </button>
      </div>

      <div className="flex flex-col items-center mb-10 relative">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-32 h-32 rounded-full bg-black border-2 border-arise-red flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] relative z-10"
        >
            <User size={64} className="text-arise-red" />
        </motion.div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 w-32 h-32 rounded-full border border-arise-red/30 animate-ping opacity-20"></div>

        {isEditing ? (
          <div className="flex flex-col items-center space-y-2 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4">
             <input 
               type="text" 
               value={editName}
               onChange={(e) => setEditName(e.target.value)}
               className="bg-zinc-900 border border-zinc-700 text-center text-xl font-bold text-white rounded p-2 w-full focus:border-arise-red focus:outline-none"
             />
             <div className="flex items-center space-x-2">
               <span className="text-zinc-500 text-sm">Age:</span>
               <input 
                type="number" 
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 text-center text-sm font-bold text-white rounded p-1 w-16 focus:border-arise-red focus:outline-none"
               />
             </div>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">{user.name}</h2>
            <div className="text-arise-muted font-display uppercase tracking-widest text-sm mt-1">Player</div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div whileHover={{ y: -2 }} className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center backdrop-blur-sm">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Level</span>
              <span className="text-4xl font-display font-bold text-white">{user.level}</span>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-800 flex flex-col items-center backdrop-blur-sm">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Rank</span>
              <span className={`text-4xl font-display font-black ${getRankColor(user.rank)}`}>{user.rank}</span>
          </motion.div>
      </div>

      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 p-6 mb-6 shadow-lg">
          <h3 className="text-white font-display font-bold mb-4 flex items-center uppercase tracking-wider text-sm">
              <TrendingUp size={16} className="mr-2 text-arise-red" /> Total Experience
          </h3>
          <div className="flex items-baseline space-x-2 mb-3">
             <span className="text-5xl font-display font-bold text-white tracking-tight">{user.totalXp.toLocaleString()}</span>
             <span className="text-sm text-zinc-500 font-bold">XP</span>
          </div>
          <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (user.totalXp % 1000) / 10)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-arise-red h-full shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
              />
          </div>
          <p className="text-[10px] text-right text-zinc-600 mt-2 uppercase tracking-widest">
            {1000 - (user.totalXp % 1000)} XP to next milestone
          </p>
      </div>

      <div className="space-y-3">
          <div className="flex justify-between items-center text-sm p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-xl">
              <span className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Age</span>
              <span className="text-white font-display font-bold text-lg">{user.age}</span>
          </div>
          <div className="flex justify-between items-center text-sm p-4 bg-zinc-900/20 border border-zinc-800/50 rounded-xl">
              <span className="text-zinc-500 font-bold uppercase text-xs tracking-wider">Status</span>
              <span className="text-green-500 font-display font-bold uppercase tracking-wider text-sm border border-green-900/30 bg-green-900/10 px-2 py-0.5 rounded">Healthy</span>
          </div>
      </div>
    </div>
  );
};