import React, { useState } from 'react';
import { Quest, StatType } from '../types';
import { Plus, Trash2, CheckCircle, Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestTabProps {
  quests: Quest[];
  onAdd: (q: Quest) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

export const QuestTab: React.FC<QuestTabProps> = ({ quests, onAdd, onDelete, onComplete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestName, setNewQuestName] = useState('');
  const [newQuestDiff, setNewQuestDiff] = useState(1);
  const [newQuestStat, setNewQuestStat] = useState<StatType>(StatType.STRENGTH);
  const [newQuestDate, setNewQuestDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedQuests = [...quests].sort((a, b) => b.difficulty - a.difficulty);

  const handleAdd = () => {
    if (!newQuestName.trim()) return;
    const quest: Quest = {
      id: Date.now().toString(),
      name: newQuestName,
      difficulty: newQuestDiff,
      stat: newQuestStat,
      date: newQuestDate,
      completed: false
    };
    onAdd(quest);
    setNewQuestName('');
    setNewQuestDiff(1);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col p-5 space-y-4 pb-28">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wider shadow-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]">
            Quest Log
          </h2>
          <div className="h-1 w-12 bg-arise-red rounded-full mt-1"></div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-arise-card border border-arise-border hover:border-arise-red text-white p-3 rounded-xl shadow-lg shadow-black/50 transition-all group"
        >
          <Plus size={24} className="group-hover:text-arise-red transition-colors" />
        </motion.button>
      </header>

      {sortedQuests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1, 0.95] }} 
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Flame size={64} className="mb-4 text-zinc-800" />
          </motion.div>
          <p className="font-display text-xl uppercase tracking-widest">No Active Quests</p>
          <p className="text-xs mt-2">The system awaits your input.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          <AnimatePresence>
            {sortedQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-0 rounded-lg flex justify-between items-stretch group relative overflow-hidden hover:border-zinc-700 transition-colors"
              >
                {/* Difficulty Indicator Strip */}
                <div className={`w-1.5 ${
                  quest.difficulty >= 8 ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 
                  quest.difficulty >= 5 ? 'bg-arise-red shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 
                  'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                }`} />
                
                <div className="flex-1 p-4 pl-3 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{quest.name}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] text-zinc-400 font-bold uppercase mt-2 tracking-wider">
                    <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-300">{quest.stat}</span>
                    <span className={`${
                      quest.difficulty >= 8 ? 'text-purple-400' : 
                      quest.difficulty >= 5 ? 'text-arise-red' : 
                      'text-blue-400'
                    }`}>Rank {quest.difficulty}</span>
                    <span>{quest.date}</span>
                  </div>
                </div>

                <div className="flex items-center px-2 space-x-1 bg-zinc-950/30 border-l border-zinc-800/50">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onComplete(quest.id)}
                    className="p-2 text-zinc-500 hover:text-green-500 transition-colors rounded-lg hover:bg-green-500/10"
                    title="Complete"
                  >
                    <CheckCircle size={22} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(quest.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Quest Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-950 border border-arise-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-xl font-display font-bold text-white uppercase tracking-wider">New Quest</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-arise-red uppercase tracking-widest mb-2">Details</label>
                  <input
                    type="text"
                    value={newQuestName}
                    onChange={(e) => setNewQuestName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-white p-4 rounded-xl focus:border-arise-red focus:outline-none focus:ring-1 focus:ring-arise-red transition-all placeholder-zinc-700"
                    placeholder="Quest Objective..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Stat</label>
                    <div className="relative">
                      <select
                        value={newQuestStat}
                        onChange={(e) => setNewQuestStat(e.target.value as StatType)}
                        className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl appearance-none focus:border-arise-red focus:outline-none"
                      >
                        {Object.values(StatType).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Difficulty</label>
                    <div className="relative">
                      <select
                        value={newQuestDiff}
                        onChange={(e) => setNewQuestDiff(Number(e.target.value))}
                        className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl appearance-none focus:border-arise-red focus:outline-none font-mono"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>Rank {n}</option>)}
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Deadline</label>
                  <input 
                    type="date"
                    value={newQuestDate}
                    onChange={(e) => setNewQuestDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-white p-3 rounded-xl focus:border-arise-red focus:outline-none text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAdd}
                    className="w-full py-4 bg-arise-red hover:bg-red-700 text-white font-display font-bold uppercase tracking-widest rounded-xl shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all transform active:scale-95"
                  >
                    Initialize Quest
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};