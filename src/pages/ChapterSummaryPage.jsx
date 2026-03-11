import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Lightbulb, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  CheckCircle,
  Target,
  Layers
} from 'lucide-react';
import { getHintsByChapter } from '../data/detailedHints';
import { chaptersData } from '../context/LearningContext';

function ChapterSummaryPage() {
  const { chapterId } = useParams();
  const [activeConcept, setActiveConcept] = useState(null);
  const [activeTab, setActiveTab] = useState('syntax');
  
  const chapter = chaptersData.find(c => c.id === parseInt(chapterId));
  const chapterHints = getHintsByChapter(parseInt(chapterId));
  
  if (!chapter || !chapterHints) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">章节未找到</h1>
          <Link to="/learn" className="text-primary-400 hover:text-primary-300">
            返回学习页面
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >n          <Link 
            to={`/learn/chapter/${chapterId}`}
            className="inline-flex items-center text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回章节
          </Link>
        </motion.div>

        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{chapter.title}</h1>
              <p className="text-secondary-400 mt-1">完整知识点总结</p>
            </div>
          </div>
          <p className="text-secondary-300 leading-relaxed">{chapter.description}</p>
        </motion.div>

        {/* 统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{chapterHints.concepts.length}</div>
            <div className="text-sm text-secondary-400">核心知识点</div>
          </div>
          <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {chapterHints.concepts.reduce((acc, c) => acc + c.examples.length, 0)}
            </div>
            <div className="text-sm text-secondary-400">代码示例</div>
          </div>
          <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {chapterHints.concepts.reduce((acc, c) => acc + c.commonMistakes.length, 0)}
            </div>
            <div className="text-sm text-secondary-400">常见错误</div>
          </div>
        </motion.div>

        {/* 知识点列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-white flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-400" />
            知识点详解
          </h2>
          
          {chapterHints.concepts.map((concept, index) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setActiveConcept(activeConcept === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 bg-secondary-700/30 hover:bg-secondary-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{concept.icon}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">{concept.title}</h3>
                    <p className="text-sm text-secondary-400">
                      {concept.examples.length} 个示例 · {concept.commonMistakes.length} 个常见错误
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-secondary-500">点击展开</span>
                  {activeConcept === index ? (
                    <ChevronUp className="w-5 h-5 text-secondary-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeConcept === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* 标签切换 */}
                      <div className="flex space-x-2 bg-secondary-900/50 rounded-lg p-1">
                        <button
                          onClick={() => setActiveTab('syntax')}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === 'syntax' 
                              ? 'bg-blue-500 text-white' 
                              : 'text-secondary-400 hover:text-white'
                          }`}
                        >
                          <Code className="w-4 h-4" />
                          <span>语法说明</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('examples')}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === 'examples' 
                              ? 'bg-green-500 text-white' 
                              : 'text-secondary-400 hover:text-white'
                          }`}
                        >
                          <Lightbulb className="w-4 h-4" />
                          <span>代码示例</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('mistakes')}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            activeTab === 'mistakes' 
                              ? 'bg-red-500 text-white' 
                              : 'text-secondary-400 hover:text-white'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>常见错误</span>
                        </button>
                      </div>

                      {/* 内容区域 */}
                      <div className="text-sm">
                        {activeTab === 'syntax' && (
                          <div className="space-y-4">
                            <div className="bg-secondary-900 rounded-lg p-4 overflow-x-auto">
                              <pre className="text-yellow-300">
                                <code>{concept.syntax}</code>
                              </pre>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                              <h4 className="font-medium text-blue-400 mb-2 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2" />
                                详细说明
                              </h4>
                              <p className="text-secondary-300 whitespace-pre-line leading-relaxed">
                                {concept.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {activeTab === 'examples' && (
                          <div className="space-y-4">
                            {concept.examples.map((example, i) => (
                              <div key={i} className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <h4 className="font-medium text-green-400 mb-2 flex items-center">
                                  <Target className="w-4 h-4 mr-2" />
                                  {example.title}
                                </h4>
                                <div className="bg-secondary-900 rounded-lg p-3 overflow-x-auto">
                                  <pre className="text-secondary-300">
                                    <code>{example.code}</code>
                                  </pre>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {activeTab === 'mistakes' && (
                          <div className="space-y-4">
                            {concept.commonMistakes.map((mistake, i) => (
                              <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <h4 className="font-medium text-red-400 mb-3 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                  ❌ {mistake.mistake}
                                </h4>
                                <div className="space-y-3">
                                  <div className="bg-secondary-900 rounded-lg p-3">
                                    <p className="text-xs text-red-400 mb-1">错误写法：</p>
                                    <code className="text-secondary-400 line-through">{mistake.wrong}</code>
                                  </div>
                                  <div className="bg-green-500/10 rounded-lg p-3">
                                    <p className="text-xs text-green-400 mb-1">✓ 正确写法：</p>
                                    <code className="text-secondary-300">{mistake.correct}</code>
                                  </div>
                                  {mistake.note && (
                                    <p className="text-yellow-400/80 text-xs bg-yellow-500/10 rounded-lg p-2">
                                      💡 {mistake.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* 底部导航 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex justify-between items-center"
        >
          <Link
            to={`/learn/chapter/${chapterId}`}
            className="flex items-center space-x-2 px-6 py-3 bg-secondary-800 hover:bg-secondary-700 border border-secondary-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回章节</span>
          </Link>
          
          <div className="text-secondary-400 text-sm">
            已掌握本章知识点？去挑战练习吧！
          </div>
          
          <Link
            to={`/learn/chapter/${chapterId}`}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>开始挑战</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default ChapterSummaryPage;
