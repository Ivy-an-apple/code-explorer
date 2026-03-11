import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { useLearning, achievementsData } from '../../context/LearningContext';

function AchievementNotification() {
  const { state } = useLearning();
  const { achievements } = state;
  const [newAchievement, setNewAchievement] = useState(null);
  const [prevAchievements, setPrevAchievements] = useState(achievements);

  useEffect(() => {
    // 检测新解锁的成就
    const newlyUnlocked = achievements.filter(
      id => !prevAchievements.includes(id)
    );

    if (newlyUnlocked.length > 0) {
      // 显示最新解锁的成就
      const achievementId = newlyUnlocked[newlyUnlocked.length - 1];
      const achievement = achievementsData.find(a => a.id === achievementId);
      if (achievement) {
        setNewAchievement(achievement);
        
        // 3秒后自动隐藏
        setTimeout(() => {
          setNewAchievement(null);
        }, 5000);
      }
    }

    setPrevAchievements(achievements);
  }, [achievements, prevAchievements]);

  const handleClose = () => {
    setNewAchievement(null);
  };

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 shadow-2xl backdrop-blur-lg min-w-[320px]">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-yellow-400 font-bold text-lg">成就解锁！</h3>
                  <button
                    onClick={handleClose}
                    className="text-secondary-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-4xl">{newAchievement.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-xl">{newAchievement.title}</h4>
                    <p className="text-secondary-300 text-sm">{newAchievement.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-yellow-400 font-bold">+{newAchievement.xp} XP</span>
                </div>
              </div>
            </div>
            
            {/* 装饰性光效 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse pointer-events-none" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-ping delay-150" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AchievementNotification;
