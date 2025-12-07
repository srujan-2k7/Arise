import React, { useState } from 'react';
import { useAriseStore } from './hooks/useAriseStore';
import { QuestTab } from './components/QuestTab';
import { StatsTab } from './components/StatsTab';
import { MentorTab } from './components/MentorTab';
import { CalendarTab } from './components/CalendarTab';
import { ProfileTab } from './components/ProfileTab';
import { Scroll, BarChart2, User, Calendar, BrainCircuit } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

enum Tab {
  QUESTS = 'quests',
  STATS = 'stats',
  MENTOR = 'mentor',
  CALENDAR = 'calendar',
  PROFILE = 'profile',
}

const App: React.FC = () => {
  const { quests, stats, user, addQuest, deleteQuest, completeQuest, updateUserProfile, isLoaded } = useAriseStore();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.QUESTS);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-arise-red font-display tracking-widest uppercase animate-pulse">
        <div className="text-4xl font-bold mb-2">System</div>
        <div className="text-sm">Initializing Arise...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.QUESTS:
        return <QuestTab quests={quests} onAdd={addQuest} onDelete={deleteQuest} onComplete={completeQuest} />;
      case Tab.STATS:
        return <StatsTab stats={stats} />;
      case Tab.MENTOR:
        return <MentorTab />;
      case Tab.CALENDAR:
        return <CalendarTab quests={quests} />;
      case Tab.PROFILE:
        return <ProfileTab user={user} stats={stats} onUpdate={updateUserProfile} />;
      default:
        return <QuestTab quests={quests} onAdd={addQuest} onDelete={deleteQuest} onComplete={completeQuest} />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className="relative flex flex-col items-center justify-center w-full py-3 group"
    >
      <div className={`transition-all duration-300 ${activeTab === tab ? 'text-arise-red -translate-y-1' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
        <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] mt-1 font-display font-bold tracking-widest uppercase transition-colors duration-300 ${activeTab === tab ? 'text-white' : 'text-transparent'}`}>
        {label}
      </span>
      {activeTab === tab && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute bottom-0 w-8 h-1 bg-arise-red rounded-t-full shadow-[0_-2px_8px_rgba(220,38,38,0.8)]" 
        />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-black text-white border-x border-zinc-900 shadow-2xl overflow-hidden relative font-sans selection:bg-arise-red selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none z-0" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-black/90 border-t border-zinc-900 flex justify-around items-center z-50 backdrop-blur-xl h-20 pb-2">
        <NavButton tab={Tab.QUESTS} icon={Scroll} label="Quests" />
        <NavButton tab={Tab.STATS} icon={BarChart2} label="Stats" />
        <NavButton tab={Tab.MENTOR} icon={BrainCircuit} label="Mentor" />
        <NavButton tab={Tab.CALENDAR} icon={Calendar} label="Dates" />
        <NavButton tab={Tab.PROFILE} icon={User} label="Profile" />
      </nav>
    </div>
  );
};

export default App;