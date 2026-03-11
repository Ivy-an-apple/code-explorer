import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Zap,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useLearning, chaptersData, achievementsData } from '../context/LearningContext';
import ProgressBar from '../components/GameUI/ProgressBar';
import AIAssistant, { AIAssistantButton } from '../components/AIAssistant';

function LearnPage() {
  const { state, getTotalProgress } = useLearning();
  const { user, progress, achievements } = state;
  const [showAI, setShowAI] = useState(false);

  const totalProgress = getTotalProgress();
  const currentChapter = chaptersData.find(c => c.id === progress.currentChapter);
  const recentAchievements = achievementsData
    .filter(a => achievements.includes(a.id))
    .slice(-3);

  const stats = [
    { 
      icon: BookOpen, 
      label: '已完成课程', 
      value: `${progress.completedLessons.length}/${chaptersData.reduce((acc, c) => acc + c.lessons.length, 0)}`,
      color: 'blue'
    },
    { 
      icon: Trophy, 
      label: '获得成就', 
      value: `${achievements.length}/${achievementsData.length}`,
      color: 'yellow'
    },
    { 
      icon: Target, 
      label: '完成章节', 
      value: `${progress.completedChapters.length}/${chaptersData.length}`,
      color: 'green'
    },
    { 
      icon: Zap, 
      label: '总 XP', 
      value: user.totalXp,
      color: 'purple'
    },
  ];

  const quickActions = [
    {
      icon: BookOpen,
      label: '继续学习',
      description: currentChapter ? `第 ${currentChapter.id} 章: ${currentChapter.title}` : '开始学习',
      to: currentChapter ? `/learn/chapter/${currentChapter.id}` : '/learn/chapter/1',
      color: 'primary',
    },
    {
      icon: Trophy,
      label: '每日挑战',
      description: '完成编程练习获得额外 XP',
      to: '/learn/challenge/1',
      color: 'orange',
    },
    {
      icon: MessageCircle,
      label: '问 AI 助手',
      description: '有任何问题都可以问我',
      onClick: () => setShowAI(true),
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-500/30 p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                欢迎回来，{user.name}！
              </h1>
              <p className="text-secondary-300">
                今天是学习编程的第 <span className="text-primary-400 font-semibold">{user.streak}</span> 天，继续保持！
              </p>
            </div>
            
            <div className="md:w-64">
              <ProgressBar progress={totalProgress} size="md" />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
                className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-4"
              >
                <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color]} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-secondary-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            快捷操作
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = {
                primary: 'from-primary-500/20 to-primary-600/20 border-primary-500/30 hover:border-primary-500/50',
                orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 hover:border-orange-500/50',
                purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-500/50',
              };
              
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  {action.onClick ? (
                    <button
                      onClick={action.onClick}
                      className={`w-full text-left p-6 rounded-xl border bg-gradient-to-br ${colorClasses[action.color]} transition-all hover:scale-[1.02]`}
                    >
                      <Icon className="w-8 h-8 mb-3 text-white" />
                      <h3 className="text-lg font-semibold text-white mb-1">{action.label}</h3>
                      <p className="text-sm text-secondary-300">{action.description}</p>
                    </button>
                  ) : (
                    <Link
                      to={action.to}
                      className={`block p-6 rounded-xl border bg-gradient-to-br ${colorClasses[action.color]} transition-all hover:scale-[1.02]`}
                    >
                      <Icon className="w-8 h-8 mb-3 text-white" />
                      <h3 className="text-lg font-semibold text-white mb-1">{action.label}</h3>
                      <p className="text-sm text-secondary-300">{action.description}</p>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary-400" />
              学习章节
            </h2>
            <Link
              to="/learn/chapters"
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center"
            >
              查看全部
              <TrendingUp className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {chaptersData.slice(0, 4).map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="border border-secondary-700 rounded-xl overflow-hidden card-hover"
              >
                <Link
                  to={`/learn/chapter/${chapter.id}`}
                  className="block p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-3xl">
                      {chapter.icon}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-secondary-400">第 {chapter.id} 章</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{chapter.title}</h3>
                    <p className="text-sm text-secondary-400">{chapter.subtitle}</p>
                  </div>
                  <p className="text-sm text-secondary-300 mb-4 line-clamp-2">
                    {chapter.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">学习建议</h3>
              <p className="text-secondary-300 text-sm leading-relaxed">
                建议每天学习 30-60 分钟，保持学习的连续性。完成每个章节后记得做测验巩固知识。
                如果遇到问题，随时可以使用 AI 助手提问。坚持就是胜利！
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      <AIAssistantButton onClick={() => setShowAI(true)} />
      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} />
    </div>
  );
}

export default LearnPage;
