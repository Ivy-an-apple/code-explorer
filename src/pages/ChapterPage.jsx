import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  Play,
  ArrowLeft,
  ArrowRight,
  Trophy,
  X,
  Eye
} from 'lucide-react';
import { useLearning, chaptersData, challengesData } from '../context/LearningContext';
import ProgressBar from '../components/GameUI/ProgressBar';
import LessonContent from '../components/LessonContent';
import ApiPlayground from '../components/ApiPlayground';
import ApiFlowVisualizer from '../components/ApiFlowVisualizer';
import QuizSystem from '../components/QuizSystem';
import CodePlayground from '../components/CodePlayground';

function ChapterPage() {
  const { chapterId } = useParams();
  const { state, getChapterProgress, dispatch, actions } = useLearning();
  const { progress } = state;
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showPlayground, setShowPlayground] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const chapter = chaptersData.find(c => c.id === parseInt(chapterId));
  const chapterProgress = getChapterProgress(parseInt(chapterId));
  
  // 获取当前章节的编程挑战
  const chapterChallenges = challengesData.filter(c => c.chapterId === parseInt(chapterId));

  // 自动检测章节完成
  useEffect(() => {
    if (chapter && chapterProgress === 100 && !progress.completedChapters.includes(chapter.id)) {
      dispatch({ type: actions.COMPLETE_CHAPTER, payload: chapter.id });
      // 章节完成奖励 XP
      dispatch({ type: actions.ADD_XP, payload: 50 });
    }
  }, [chapterProgress, chapter, progress.completedChapters, dispatch, actions]);
  
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">章节未找到</h1>
          <Link to="/" className="text-primary-400 hover:text-primary-300">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons.includes(lessonId);
  };

  const isChapterCompleted = progress.completedChapters.includes(chapter.id);
  const isChapterUnlocked = chapter.id === 1 || progress.completedChapters.includes(chapter.id - 1);

  const handleLessonComplete = (lessonId, xp) => {
    if (!isLessonCompleted(lessonId)) {
      dispatch({ type: actions.COMPLETE_LESSON, payload: lessonId });
      dispatch({ type: actions.ADD_XP, payload: xp });
      // 更新连续学习天数
      dispatch({ type: actions.UPDATE_STREAK });
    }
    setSelectedLesson(null);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'concept': return <BookOpen className="w-5 h-5" />;
      case 'practice': return <Play className="w-5 h-5" />;
      case 'challenge': return <Trophy className="w-5 h-5" />;
      case 'visual': return <Eye className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'concept': return '概念';
      case 'practice': return '实践';
      case 'challenge': return '挑战';
      case 'visual': return '可视化';
      default: return '课程';
    }
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'concept': return 'bg-blue-500/20 text-blue-400';
      case 'practice': return 'bg-green-500/20 text-green-400';
      case 'challenge': return 'bg-orange-500/20 text-orange-400';
      case 'visual': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-secondary-500/20 text-secondary-400';
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-6xl">{chapter.icon}</span>
            <div>
              <span className="text-sm text-secondary-400">第 {chapter.id} 章</span>
              <h1 className="text-3xl font-bold text-white">{chapter.title}</h1>
              <p className="text-secondary-400">{chapter.subtitle}</p>
            </div>
          </div>
          <p className="text-secondary-300 leading-relaxed">{chapter.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">章节进度</h2>
            {isChapterCompleted && (
              <span className="flex items-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                已完成
              </span>
            )}
          </div>
          <ProgressBar 
            progress={chapterProgress} 
            size="lg" 
            color={chapter.color}
          />
        </motion.div>

        {chapter.id === 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">互动工具</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowPlayground(true)}
                className="p-4 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl hover:border-teal-500/40 transition-all text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">🎮</span>
                  <span className="font-medium text-white">API 游乐场</span>
                </div>
                <p className="text-secondary-400 text-sm">实时调用 API，查看请求和响应</p>
              </button>
              <button
                onClick={() => setSelectedLesson({ id: 'visual-flow', title: 'API 数据流可视化', type: 'visual' })}
                className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all text-left"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">📊</span>
                  <span className="font-medium text-white">数据流可视化</span>
                </div>
                <p className="text-secondary-400 text-sm">动画演示 API 请求的完整流程</p>
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-white mb-6">课程内容</h2>
          
          {chapter.lessons.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`border rounded-xl p-6 transition-all cursor-pointer ${
                  completed 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-secondary-700 bg-secondary-800/30 hover:border-primary-500/30'
                }`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      completed ? 'bg-green-500/20 text-green-400' : 'bg-primary-500/20 text-primary-400'
                    }`}>
                      {completed ? <CheckCircle className="w-6 h-6" /> : getLessonIcon(lesson.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getLessonTypeColor(lesson.type)}`}>
                          {getLessonTypeLabel(lesson.type)}
                        </span>
                        <span className="text-xs text-secondary-400">+{lesson.xp} XP</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{lesson.title}</h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLessonClick(lesson);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      completed 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-primary-600 hover:bg-primary-500 text-white'
                    }`}
                  >
                    {completed ? '复习' : '开始学习'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {chapterChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8"
          >
            <h2 className="text-xl font-bold text-white mb-6">编程挑战</h2>
            <div className="space-y-4">
              {chapterChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    to={`/learn/challenge/${challenge.id.replace('challenge-', '')}`}
                    className="block border border-secondary-700 bg-secondary-800/30 hover:border-orange-500/30 rounded-xl p-6 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/20 text-orange-400">
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                              challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {challenge.difficulty === 'easy' ? '简单' :
                               challenge.difficulty === 'medium' ? '中等' : '困难'}
                            </span>
                            <span className="text-xs text-secondary-400">+{challenge.xp} XP</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                          <p className="text-secondary-400 text-sm mt-1">{challenge.description}</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-all">
                        开始挑战
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {chapter.quiz && chapter.quiz.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">{chapter.quiz.title}</h2>
              </div>
              <button 
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all"
              >
                开始测验
              </button>
            </div>
            <p className="text-secondary-300 text-sm">
              完成本章节所有课程后，通过测验巩固知识，获得额外 XP！
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between mt-12"
        >
          {chapter.id > 1 && (
            <Link
              to={`/learn/chapter/${chapter.id - 1}`}
              className="flex items-center px-6 py-3 border border-secondary-600 rounded-lg text-secondary-300 hover:text-white hover:border-secondary-400 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              上一章
            </Link>
          )}
          
          {chapter.id < chaptersData.length && (
            <Link
              to={`/learn/chapter/${chapter.id + 1}`}
              className="flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all ml-auto"
            >
              下一章
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="min-h-screen py-8 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getLessonTypeColor(selectedLesson.type)}`}>
                      {getLessonTypeLabel(selectedLesson.type)}
                    </span>
                    <h2 className="text-xl font-bold text-white">{selectedLesson.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-secondary-800 border border-secondary-700 rounded-xl p-6">
                  {selectedLesson.id === 'visual-flow' ? (
                    <ApiFlowVisualizer />
                  ) : selectedLesson.id.match(/^[1-9]-\d$/) ? (
                    <LessonContent 
                      lessonId={selectedLesson.id} 
                      onComplete={() => handleLessonComplete(selectedLesson.id, selectedLesson.xp)}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-secondary-400">课程内容正在编写中...</p>
                      <button
                        onClick={() => handleLessonComplete(selectedLesson.id, selectedLesson.xp)}
                        className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all"
                      >
                        标记为已完成
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlayground && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setShowPlayground(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="min-h-screen py-8 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎮</span>
                    <h2 className="text-xl font-bold text-white">API 游乐场</h2>
                  </div>
                  <button
                    onClick={() => setShowPlayground(false)}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <ApiPlayground />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuiz && chapter.quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setShowQuiz(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="min-h-screen py-8 px-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-2xl bg-secondary-800 border border-secondary-700 rounded-2xl overflow-hidden">
                <QuizSystem 
                  quiz={chapter.quiz} 
                  onClose={() => setShowQuiz(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChapterPage;
