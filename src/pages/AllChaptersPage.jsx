import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  ArrowLeft,
  Play
} from 'lucide-react';
import { useLearning, chaptersData } from '../context/LearningContext';
import ProgressBar from '../components/GameUI/ProgressBar';

function AllChaptersPage() {
  const { state, getChapterProgress } = useLearning();
  const { progress } = state;

  const isChapterCompleted = (chapterId) => {
    return progress.completedChapters.includes(chapterId);
  };

  const isLessonCompleted = (lessonId) => {
    return progress.completedLessons.includes(lessonId);
  };

  const getChapterLessonProgress = (chapter) => {
    const completedCount = chapter.lessons.filter(lesson => 
      isLessonCompleted(lesson.id)
    ).length;
    return {
      completed: completedCount,
      total: chapter.lessons.length
    };
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 导航 */}
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

        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">全部章节</h1>
          <p className="text-secondary-400">
            共 {chaptersData.length} 章，完成 {progress.completedChapters.length} 章
          </p>
        </motion.div>

        {/* 章节网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chaptersData.map((chapter, index) => {
            const chapterProgress = getChapterProgress(chapter.id);
            const lessonProgress = getChapterLessonProgress(chapter);
            const completed = isChapterCompleted(chapter.id);

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/learn/chapter/${chapter.id}`}
                  className={`block h-full border rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
                    completed 
                      ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50' 
                      : 'border-secondary-700 bg-secondary-800/30 hover:border-primary-500/30'
                  }`}
                >
                  <div className="p-6">
                    {/* 章节图标和状态 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-3xl">
                        {chapter.icon}
                      </div>
                      {completed && (
                        <span className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="w-5 h-5" />
                        </span>
                      )}
                    </div>

                    {/* 章节信息 */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-secondary-400">第 {chapter.id} 章</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{chapter.title}</h3>
                      <p className="text-sm text-secondary-400 line-clamp-2">{chapter.subtitle}</p>
                    </div>

                    {/* 进度信息 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-400">
                          课程进度 {lessonProgress.completed}/{lessonProgress.total}
                        </span>
                        <span className={`font-medium ${
                          completed ? 'text-green-400' : 'text-primary-400'
                        }`}>
                          {Math.round(chapterProgress)}%
                        </span>
                      </div>
                      <ProgressBar 
                        progress={chapterProgress} 
                        size="sm" 
                        color={completed ? 'green' : 'primary'}
                      />
                    </div>

                    {/* 进入按钮 */}
                    <div className="mt-4 pt-4 border-t border-secondary-700/50">
                      <div className={`flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition-all ${
                        completed 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-primary-600/20 text-primary-400'
                      }`}>
                        {completed ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>复习章节</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>{chapterProgress > 0 ? '继续学习' : '开始学习'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* 学习路径提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">学习建议</h3>
              <p className="text-secondary-300 text-sm leading-relaxed">
                建议按照章节顺序学习，循序渐进掌握知识。每章包含多个课程和实践练习，
                完成所有课程后可以参加章节测验巩固知识。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AllChaptersPage;
