import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Trophy, 
  Zap, 
  Target,
  Award,
  BookOpen,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useLearning, chaptersData, achievementsData } from '../context/LearningContext';
import ProgressBar from '../components/GameUI/ProgressBar';

function ProfilePage() {
  const { state, getTotalProgress, getXpNeeded } = useLearning();
  const { user, progress, achievements } = state;

  const totalProgress = getTotalProgress();
  const xpNeeded = getXpNeeded();
  const xpProgress = Math.round((user.xp / xpNeeded) * 100);

  const unlockedAchievements = achievementsData.filter(a => achievements.includes(a.id));
  const lockedAchievements = achievementsData.filter(a => !achievements.includes(a.id));

  const stats = [
    { 
      icon: BookOpen, 
      label: '已完成课程', 
      value: progress.completedLessons.length,
      total: chaptersData.reduce((acc, c) => acc + c.lessons.length, 0),
      color: 'blue'
    },
    { 
      icon: Trophy, 
      label: '获得成就', 
      value: achievements.length,
      total: achievementsData.length,
      color: 'yellow'
    },
    { 
      icon: Target, 
      label: '完成章节', 
      value: progress.completedChapters.length,
      total: chaptersData.length,
      color: 'green'
    },
    { 
      icon: Zap, 
      label: '当前等级', 
      value: user.level,
      suffix: '级',
      color: 'purple'
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600/20 to-purple-600/20 border border-primary-500/30 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center text-yellow-400">
                  <Zap className="w-5 h-5 mr-1" />
                  等级 {user.level}
                </span>
                <span className="text-secondary-400">|</span>
                <span className="text-secondary-300">
                  总 XP: <span className="text-purple-400 font-semibold">{user.totalXp}</span>
                </span>
                <span className="text-secondary-400">|</span>
                <span className="flex items-center text-orange-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  连续学习 {user.streak} 天
                </span>
              </div>
            </div>
          </div>

          {/* 等级进度 */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary-400">升级进度</span>
              <span className="text-primary-400 font-semibold">{user.xp} / {xpNeeded} XP</span>
            </div>
            <ProgressBar progress={xpProgress} size="md" color="yellow" />
            <p className="text-sm text-secondary-400 mt-2">
              还需要 {xpNeeded - user.xp} XP 升级到等级 {user.level + 1}
            </p>
          </div>
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-500/20 text-blue-400',
              yellow: 'bg-yellow-500/20 text-yellow-400',
              green: 'bg-green-500/20 text-green-400',
              purple: 'bg-purple-500/20 text-purple-400',
            };
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-6 text-center"
              >
                <div className={`w-12 h-12 rounded-xl ${colorClasses[stat.color]} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-sm text-secondary-400">{stat.label}</div>
                {stat.total && (
                  <div className="text-xs text-secondary-500 mt-1">
                    / {stat.total}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 总体进度 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-400" />
              学习进度
            </h2>
            <span className="text-2xl font-bold text-primary-400">{totalProgress}%</span>
          </div>
          <ProgressBar progress={totalProgress} size="lg" />
          <p className="text-secondary-400 text-sm mt-4">
            已完成 {progress.completedLessons.length} 个课程，共 {chaptersData.reduce((acc, c) => acc + c.lessons.length, 0)} 个课程
          </p>
        </motion.div>

        {/* 成就展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            成就墙
          </h2>

          {/* 已解锁成就 */}
          {unlockedAchievements.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">已解锁 ({unlockedAchievements.length})</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {unlockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 animate-pulse-glow"
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                    <p className="text-sm text-secondary-300 mb-2">{achievement.description}</p>
                    <span className="text-xs text-yellow-400 font-semibold">+{achievement.xp} XP</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 未解锁成就 */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-400 mb-4">未解锁 ({lockedAchievements.length})</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {lockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="bg-secondary-800/30 border border-secondary-700 rounded-xl p-4 opacity-60"
                  >
                    <div className="text-4xl mb-3 grayscale">{achievement.icon}</div>
                    <h4 className="font-semibold text-secondary-400 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-secondary-500 mb-2">{achievement.description}</p>
                    <span className="text-xs text-secondary-500">+{achievement.xp} XP</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all"
          >
            继续学习
          </Link>
          <Link
            to="/learn/challenge/1"
            className="px-6 py-3 border border-secondary-600 hover:border-secondary-400 text-secondary-300 hover:text-white rounded-lg font-medium transition-all"
          >
            去挑战
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
