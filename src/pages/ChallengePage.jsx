import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  Trophy,
  Clock,
  Zap,
  Lightbulb,
  BookOpen,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Code,
  AlertCircle,
  Sparkles,
  Bot,
  GraduationCap,
  PlayCircle,
  Server,
  FileCode,
  Terminal
} from 'lucide-react';
import * as Babel from '@babel/standalone';
import { useLearning, challengesData } from '../context/LearningContext';
import { getHintsByChapter } from '../data/detailedHints';
import { getChallengeHints, getQuickTip } from '../data/challengeHints';
import AIAssistant from '../components/AIAssistant';

function ChallengePage() {
  const { challengeId } = useParams();
  const { state, dispatch, actions } = useLearning();
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [showHints, setShowHints] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [activeTab, setActiveTab] = useState('syntax'); // 'syntax', 'examples', 'mistakes'
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiInitialMessage, setAiInitialMessage] = useState('');
  const [previewError, setPreviewError] = useState(null);
  
  const challenge = challengesData.find(c => c.id === `challenge-${challengeId}`);
  
  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
    }
  }, [challengeId]);
  
  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">挑战未找到</h1>
          <Link to="/" className="text-primary-400 hover:text-primary-300">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const validationResult = checkCodeValidity(code, challenge);
      
      if (validationResult.valid) {
        setResult({
          success: true,
          message: validationResult.message || '代码运行成功！',
          xp: challenge.xp
        });
        dispatch({ type: actions.ADD_XP, payload: challenge.xp });
        // 记录挑战完成，用于成就系统
        dispatch({ 
          type: actions.UPDATE_CHALLENGE_SCORE, 
          payload: { challengeId: challenge.id, score: 100 } 
        });
        // 更新连续学习天数
        dispatch({ type: actions.UPDATE_STREAK });
      } else {
        setResult({
          success: false,
          message: validationResult.message || '代码似乎不完整，请检查是否包含必要的元素。',
          xp: 0
        });
      }
    }, 1000);
  };

  const checkCodeValidity = (code, challenge) => {
    if (!code || code.trim() === '' || code === challenge.starterCode) {
      return { valid: false, message: '请先编写代码' };
    }
    
    // 根据挑战类型进行不同的验证
    const challengeType = challenge.type || 'frontend';
    
    if (challengeType === 'backend') {
      return checkBackendCode(code, challenge);
    } else if (challengeType === 'docker') {
      return checkDockerCode(code, challenge);
    }
    
    // 前端挑战验证（原有逻辑）
    if (!code.includes('return')) {
      return { valid: false, message: '代码中缺少 return 语句' };
    }
    
    if (challenge.chapterId === 1) {
      return { valid: code.includes('<') && code.includes('>'), message: '请确保代码包含 JSX 标签' };
    } else if (challenge.chapterId === 2) {
      return { valid: code.includes('useState'), message: '请使用 useState Hook' };
    } else if (challenge.chapterId === 3) {
      return { valid: code.includes('className'), message: '请使用 className 设置样式' };
    } else if (challenge.chapterId === 4) {
      return { valid: code.includes('useState') && (code.includes('onClick') || code.includes('onChange')), message: '请使用 useState 和事件处理' };
    } else if (challenge.chapterId === 5) {
      return { valid: code.includes('Route') || code.includes('Link') || code.includes('Router'), message: '请使用路由相关组件' };
    } else if (challenge.chapterId === 6) {
      return { valid: code.includes('form') || code.includes('input') || code.includes('onSubmit'), message: '请创建表单元素' };
    } else if (challenge.chapterId === 7) {
      return { valid: code.includes('fetch') || code.includes('useEffect'), message: '请使用 useEffect 或 fetch' };
    }
    
    return { valid: true, message: '代码运行成功！' };
  };

  // 后端代码验证
  const checkBackendCode = (code, challenge) => {
    // 检查是否包含 require 或 import
    const hasRequire = code.includes('require(');
    const hasExpress = code.includes('express');
    const hasApp = code.includes('app') || code.includes('createServer');
    const hasListen = code.includes('.listen') || code.includes('server.listen');
    
    // 环境变量配置挑战 (9-1)
    if (challenge.id === 'challenge-9-1') {
      const hasProcessEnv = code.includes('process.env');
      const hasDefaultValue = code.includes('||') && code.includes('process.env');
      
      if (!hasProcessEnv) {
        return { valid: false, message: '请使用 process.env 读取环境变量' };
      }
      if (!hasDefaultValue) {
        return { valid: false, message: '请为环境变量提供默认值（使用 || 运算符）' };
      }
      return { valid: true, message: '环境变量配置正确！' };
    }
    
    // Express Hello World (8-1)
    if (challenge.id === 'challenge-8-1') {
      const hasRoute = code.includes('app.get') || code.includes('app.use');
      if (!hasExpress) {
        return { valid: false, message: '请引入 express 模块' };
      }
      if (!hasApp) {
        return { valid: false, message: '请创建 express 应用实例' };
      }
      if (!hasRoute) {
        return { valid: false, message: '请定义至少一个路由' };
      }
      if (!hasListen) {
        return { valid: false, message: '请调用 app.listen 启动服务器' };
      }
      return { valid: true, message: 'Express 服务器配置正确！' };
    }
    
    // REST API 基础 (8-2)
    if (challenge.id === 'challenge-8-2') {
      const hasGet = code.includes('app.get') || code.includes('router.get');
      const hasPost = code.includes('app.post') || code.includes('router.post');
      const hasJson = code.includes('express.json') || code.includes('body-parser');
      
      if (!hasExpress) {
        return { valid: false, message: '请引入 express 模块' };
      }
      if (!hasGet) {
        return { valid: false, message: '请定义 GET 路由' };
      }
      if (!hasPost) {
        return { valid: false, message: '请定义 POST 路由' };
      }
      return { valid: true, message: 'REST API 配置正确！' };
    }
    
    // 中间件使用 (8-3)
    if (challenge.id === 'challenge-8-3') {
      const hasMiddleware = code.includes('app.use') || code.includes('function') && code.includes('req') && code.includes('res') && code.includes('next');
      if (!hasMiddleware) {
        return { valid: false, message: '请创建并使用中间件' };
      }
      return { valid: true, message: '中间件配置正确！' };
    }
    
    // 通用后端验证
    if (!hasExpress && !hasRequire) {
      return { valid: false, message: '请引入必要的模块' };
    }
    
    return { valid: true, message: '后端代码验证通过！' };
  };

  // Docker 代码验证
  const checkDockerCode = (code, challenge) => {
    const hasFrom = code.includes('FROM');
    const hasWorkdir = code.includes('WORKDIR');
    const hasCopy = code.includes('COPY') || code.includes('ADD');
    const hasRun = code.includes('RUN');
    const hasExpose = code.includes('EXPOSE');
    const hasCmd = code.includes('CMD') || code.includes('ENTRYPOINT');
    
    // Dockerfile 挑战 (9-2)
    if (challenge.id === 'challenge-9-2') {
      if (!hasFrom) {
        return { valid: false, message: 'Dockerfile 必须包含 FROM 指令' };
      }
      if (!hasWorkdir) {
        return { valid: false, message: '请设置 WORKDIR 工作目录' };
      }
      if (!hasCopy) {
        return { valid: false, message: '请使用 COPY 复制文件' };
      }
      if (!hasRun) {
        return { valid: false, message: '请使用 RUN 安装依赖' };
      }
      if (!hasExpose) {
        return { valid: false, message: '请使用 EXPOSE 暴露端口' };
      }
      if (!hasCmd) {
        return { valid: false, message: '请使用 CMD 设置启动命令' };
      }
      return { valid: true, message: 'Dockerfile 配置正确！' };
    }
    
    // GitHub Actions (9-3)
    if (challenge.id === 'challenge-9-3') {
      const hasOn = code.includes('on:');
      const hasJobs = code.includes('jobs:');
      const hasSteps = code.includes('steps:');
      const hasUses = code.includes('uses:');
      
      if (!hasOn) {
        return { valid: false, message: '请定义触发条件 (on)' };
      }
      if (!hasJobs) {
        return { valid: false, message: '请定义任务 (jobs)' };
      }
      if (!hasSteps) {
        return { valid: false, message: '请定义步骤 (steps)' };
      }
      return { valid: true, message: 'CI/CD 配置正确！' };
    }
    
    // Nginx 配置 (9-4)
    if (challenge.id === 'challenge-9-4') {
      const hasServer = code.includes('server {');
      const hasListen = code.includes('listen');
      const hasLocation = code.includes('location');
      
      if (!hasServer) {
        return { valid: false, message: '请定义 server 块' };
      }
      if (!hasListen) {
        return { valid: false, message: '请设置监听端口 (listen)' };
      }
      if (!hasLocation) {
        return { valid: false, message: '请定义 location 路由' };
      }
      return { valid: true, message: 'Nginx 配置正确！' };
    }
    
    // 通用 Dockerfile 验证
    if (!hasFrom) {
      return { valid: false, message: 'Dockerfile 必须包含 FROM 指令' };
    }
    
    return { valid: true, message: '配置验证通过！' };
  };

  const handleReset = () => {
    setCode(challenge.starterCode);
    setResult(null);
    setPreviewError(null);
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(challenge.solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyExample = (exampleCode) => {
    setCode(exampleCode);
    setPreviewError(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-secondary-400 bg-secondary-500/20';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  // 获取当前挑战的针对性提示
  const challengeHints = getChallengeHints(`challenge-${challengeId}`);
  const quickTip = getQuickTip(`challenge-${challengeId}`);
  
  // 获取当前挑战相关的详细知识点
  const chapterHints = getHintsByChapter(challenge.chapterId);
  const relevantConcepts = challengeHints?.concepts || [];
  const hintsToShow = relevantConcepts.map(conceptId => 
    chapterHints?.concepts?.find(c => c.id === conceptId)
  ).filter(Boolean);

  // 打开 AI 助手并设置初始消息
  const openAIAssistant = (message = '') => {
    setAiInitialMessage(message);
    setShowAIAssistant(true);
  };

  // 获取检查代码的 AI 提示词
  const getCheckCodePrompt = () => {
    const challengeType = challenge.type || 'frontend';
    let prompt = `请帮我检查一下这段代码错在哪里：\n\`\`\`${challengeType === 'docker' ? 'dockerfile' : 'javascript'}\n${code}\n\`\`\``;
    
    if (previewError) {
      prompt += `\n\n报错信息：\n\`\`\`\n${previewError}\n\`\`\``;
    }
    
    prompt += `\n\n请分析错误原因并给出修改建议。`;
    return prompt;
  };

  // 获取针对当前挑战的 AI 提示
  const getAIHintPrompt = () => {
    return `我在做 "${challenge.title}" 这个挑战，遇到了困难。\n\n挑战描述：${challenge.description}\n\n我的代码：\n\`\`\`\n${code}\n\`\`\`\n\n请帮我分析并提供提示，不要直接给答案。`;
  };

  // 判断是否为后端或 Docker 挑战
  const isBackendChallenge = challenge.type === 'backend';
  const isDockerChallenge = challenge.type === 'docker';
  const isNonFrontendChallenge = isBackendChallenge || isDockerChallenge;

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to={`/learn/chapter/${challenge.chapterId}`}
            className="inline-flex items-center text-secondary-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回章节
          </Link>
        </motion.div>

        {/* 挑战标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                  {getDifficultyLabel(challenge.difficulty)}
                </span>
                <span className="flex items-center text-sm text-secondary-400">
                  <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                  +{challenge.xp} XP
                </span>
                {isBackendChallenge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    后端
                  </span>
                )}
                {isDockerChallenge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                    DevOps
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-secondary-300 leading-relaxed">{challenge.description}</p>
        </motion.div>

        {/* 三栏布局 */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* 左侧：知识点提示 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4"
          >
            {/* 快速提示卡片 */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">💡 快速提示</h3>
                  <p className="text-sm text-secondary-300">{quickTip}</p>
                </div>
              </div>
            </div>

            {/* 相关知识点 */}
            <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full flex items-center justify-between px-4 py-3 border-b border-secondary-700 hover:bg-secondary-700/50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">相关知识点 ({hintsToShow.length})</span>
                </div>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                      {hintsToShow.length > 0 ? (
                        hintsToShow.map((concept, index) => (
                          <div
                            key={concept.id}
                            className="border border-secondary-700 rounded-lg overflow-hidden bg-secondary-800/30"
                          >
                            <button
                              onClick={() => setActiveHint(activeHint === index ? null : index)}
                              className="w-full flex items-center justify-between px-3 py-3 bg-secondary-700/30 hover:bg-secondary-700/50 transition-colors text-left"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{concept.icon}</span>
                                <span className="text-sm font-medium text-blue-400">{concept.title}</span>
                              </div>
                              {activeHint === index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            <AnimatePresence>
                              {activeHint === index && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 space-y-3">
                                    {/* 标签切换 */}
                                    <div className="flex space-x-1 bg-secondary-900/50 rounded-lg p-1">
                                      <button
                                        onClick={() => setActiveTab('syntax')}
                                        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                                          activeTab === 'syntax' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'text-secondary-400 hover:text-white'
                                        }`}
                                      >
                                        <Code className="w-3 h-3 inline mr-1" />
                                        语法
                                      </button>
                                      <button
                                        onClick={() => setActiveTab('examples')}
                                        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                                          activeTab === 'examples' 
                                            ? 'bg-green-500 text-white' 
                                            : 'text-secondary-400 hover:text-white'
                                        }`}
                                      >
                                        <Lightbulb className="w-3 h-3 inline mr-1" />
                                        示例
                                      </button>
                                      <button
                                        onClick={() => setActiveTab('mistakes')}
                                        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                                          activeTab === 'mistakes' 
                                            ? 'bg-red-500 text-white' 
                                            : 'text-secondary-400 hover:text-white'
                                        }`}
                                      >
                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                        常见错误
                                      </button>
                                    </div>

                                    {/* 内容区域 */}
                                    <div className="text-xs">
                                      {activeTab === 'syntax' && (
                                        <div className="space-y-2">
                                          <pre className="bg-secondary-900 p-2 rounded overflow-x-auto">
                                            <code className="text-yellow-300">{concept.syntax}</code>
                                          </pre>
                                          <p className="text-secondary-300 whitespace-pre-line">{concept.explanation}</p>
                                        </div>
                                      )}
                                      
                                      {activeTab === 'examples' && (
                                        <div className="space-y-2">
                                          {concept.examples.slice(0, 2).map((example, i) => (
                                            <div key={i} className="bg-secondary-900/50 p-2 rounded">
                                              <p className="text-green-400 font-medium mb-1">{example.title}</p>
                                              <pre className="overflow-x-auto">
                                                <code className="text-secondary-300">{example.code}</code>
                                              </pre>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      {activeTab === 'mistakes' && (
                                        <div className="space-y-2">
                                          {concept.commonMistakes.slice(0, 2).map((mistake, i) => (
                                            <div key={i} className="bg-red-900/20 border border-red-500/20 p-2 rounded">
                                              <p className="text-red-400 font-medium mb-1">❌ {mistake.mistake}</p>
                                              <p className="text-secondary-400 line-through text-[10px]">{mistake.wrong}</p>
                                              <p className="text-green-400 mt-1">✓ 正确写法：</p>
                                              <p className="text-secondary-300 text-[10px]">{mistake.correct}</p>
                                              {mistake.note && (
                                                <p className="text-yellow-400/80 text-[10px] mt-1">💡 {mistake.note}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* AI 求助按钮 */}
                                    <button
                                      onClick={() => openAIAssistant(`我在学习 "${concept.title}"，请详细解释一下这个知识点，并给我一些练习建议。`)}
                                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 rounded-lg transition-all text-xs"
                                    >
                                      <Bot className="w-3 h-3 text-purple-400" />
                                      <span className="text-purple-400">问 AI 关于这个知识点</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-secondary-400 text-sm">暂无相关知识点</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!showHints && (
                <div className="p-4 text-center">
                  <p className="text-sm text-secondary-400">点击展开查看相关知识点</p>
                </div>
              )}
            </div>

            {/* 查看完整知识点链接 */}
            <Link
              to={`/learn/chapter/${challenge.chapterId}/summary`}
              className="mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-secondary-800/50 border border-secondary-700 hover:border-blue-500/50 hover:bg-secondary-700/50 rounded-xl transition-all text-sm text-secondary-300 hover:text-white"
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>查看本章完整知识点总结</span>
            </Link>

            {/* AI 助手快捷入口 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">需要更多帮助？</h3>
                  <p className="text-xs text-secondary-400 mb-3">
                    AI 助手可以帮你解释代码、提供学习建议
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => openAIAssistant(getAIHintPrompt())}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>获取当前挑战提示</span>
                    </button>
                    <button
                      onClick={() => openAIAssistant(getCheckCodePrompt())}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-secondary-700 hover:bg-secondary-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Code className="w-4 h-4" />
                      <span>分析我的代码</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 中间：代码编辑器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-secondary-400">
                  {isDockerChallenge ? 'Dockerfile 编辑器' : isBackendChallenge ? '代码编辑器' : '代码编辑器'}
                </span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[400px] p-4 bg-secondary-900 text-white font-mono text-sm resize-none focus:outline-none"
                spellCheck={false}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-700">
                <button
                  onClick={handleReset}
                  className="flex items-center px-4 py-2 text-secondary-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重置
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white rounded-lg font-medium transition-all"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      运行中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {isNonFrontendChallenge ? '验证代码' : '运行代码'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 代码编辑器下方的 AI 快捷按钮 */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => openAIAssistant(getCheckCodePrompt())}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-800 hover:bg-secondary-700 border border-secondary-700 rounded-lg transition-colors text-sm"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>检查代码</span>
              </button>
              <button
                onClick={() => openAIAssistant(`请解释这段代码的每一行：\n\`\`\`\n${code}\n\`\`\``)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-800 hover:bg-secondary-700 border border-secondary-700 rounded-lg transition-colors text-sm"
              >
                <Code className="w-4 h-4 text-blue-400" />
                <span>解释代码</span>
              </button>
            </div>
          </motion.div>

          {/* 右侧：预览和答案 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* 预览区 - 根据类型显示不同内容 */}
            <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-secondary-700">
                <span className="text-sm text-secondary-400">
                  {isBackendChallenge ? '代码分析' : isDockerChallenge ? '配置检查' : '实时预览'}
                </span>
              </div>
              <div className="h-[300px]">
                {isNonFrontendChallenge ? (
                  <BackendCodeAnalyzer code={code} challenge={challenge} />
                ) : (
                  <LivePreview 
                    code={code} 
                    starterCode={challenge.starterCode}
                    onError={setPreviewError}
                  />
                )}
              </div>
            </div>

            {/* 结果区 */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-xl p-4 ${
                  result.success 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result.success ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <span className="text-red-400">✕</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${
                      result.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.success ? '挑战成功！' : '挑战失败'}
                    </h3>
                    <p className="text-secondary-300 text-xs mt-1">{result.message}</p>
                    {result.success && (
                      <div className="flex items-center mt-2 text-yellow-400 text-sm">
                        <Trophy className="w-3 h-3 mr-1" />
                        <span className="font-semibold">+{result.xp} XP</span>
                      </div>
                    )}
                    {!result.success && (
                      <button
                        onClick={() => openAIAssistant(getCheckCodePrompt())}
                        className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        <Bot className="w-3 h-3 mr-1" />
                        问 AI 为什么失败
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 查看答案按钮 */}
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl transition-all"
            >
              {showSolution ? <EyeOff className="w-5 h-5 text-purple-400" /> : <Eye className="w-5 h-5 text-purple-400" />}
              <span className="text-purple-400 font-medium">
                {showSolution ? '隐藏答案' : '查看答案'}
              </span>
            </button>

            {/* 答案区域 */}
            <AnimatePresence>
              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-secondary-800/50 border border-purple-500/30 rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/20 bg-purple-500/10">
                    <span className="text-sm text-purple-400">参考答案</span>
                    <button
                      onClick={handleCopySolution}
                      className="flex items-center space-x-1 text-xs text-secondary-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? '已复制' : '复制'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs text-secondary-300 overflow-x-auto max-h-[300px] overflow-y-auto">
                    <code>{challenge.solution}</code>
                  </pre>
                  <div className="px-4 py-2 border-t border-purple-500/20">
                    <button
                      onClick={() => openAIAssistant(`请详细解释这段参考答案的实现思路：\n\`\`\`\n${challenge.solution}\n\`\`\`\n\n特别是我不太理解的部分，请逐行解释。`)}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-xs"
                    >
                      <Bot className="w-3 h-3" />
                      <span>请 AI 解释答案</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* AI 助手组件 */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)}
        initialMessage={aiInitialMessage}
      />
    </div>
  );
}

// 实时预览组件 - 使用本地 Babel 编译（仅用于前端挑战）
function LivePreview({ code, starterCode, onError }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);
  const [Component, setComponent] = useState(null);
  
  const currentCode = code || starterCode;
  
  useEffect(() => {
    try {
      setError(null);
      onError?.(null);
      
      const componentMatch = currentCode.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'App';
      
      const transformed = Babel.transform(currentCode, {
        presets: ['react'],
        plugins: [],
      }).code;
      
      const wrappedCode = `
        ${transformed}
        return ${componentName};
      `;
      
      const createComponent = new Function('React', wrappedCode);
      const CompiledComponent = createComponent(React);
      
      setComponent(() => CompiledComponent);
    } catch (err) {
      console.error('编译错误:', err);
      setError(err.message);
      onError?.(err.message);
      setComponent(null);
    }
  }, [currentCode, onError]);
  
  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-auto bg-gray-900"
    >
      {error ? (
        <div className="p-4 text-red-400 text-sm">
          <div className="font-bold mb-2">编译错误:</div>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      ) : Component ? (
        <div className="p-4">
          <Component />
        </div>
      ) : (
        <div className="p-4 text-gray-400">加载中...</div>
      )}
    </div>
  );
}

// 后端代码分析组件
function BackendCodeAnalyzer({ code, challenge }) {
  const [analysis, setAnalysis] = useState({ checks: [], status: 'checking' });
  
  useEffect(() => {
    const checks = [];
    
    if (challenge.type === 'backend') {
      // Express 相关检查
      if (challenge.id === 'challenge-8-1' || challenge.id.includes('challenge-8')) {
        checks.push({
          name: '引入 express',
          passed: code.includes('require(\'express\')') || code.includes('require("express")'),
          icon: <Server className="w-4 h-4" />
        });
        checks.push({
          name: '创建 app 实例',
          passed: code.includes('express()') || code.includes('createServer'),
          icon: <FileCode className="w-4 h-4" />
        });
        checks.push({
          name: '定义路由',
          passed: code.includes('app.get') || code.includes('app.post') || code.includes('app.use'),
          icon: <Code className="w-4 h-4" />
        });
        checks.push({
          name: '启动服务器',
          passed: code.includes('.listen'),
          icon: <Terminal className="w-4 h-4" />
        });
      }
      
      // 环境变量检查
      if (challenge.id === 'challenge-9-1') {
        checks.push({
          name: '使用 process.env',
          passed: code.includes('process.env'),
          icon: <Server className="w-4 h-4" />
        });
        checks.push({
          name: '提供默认值',
          passed: code.includes('process.env') && code.includes('||'),
          icon: <CheckCircle className="w-4 h-4" />
        });
        checks.push({
          name: '使用 dotenv（可选）',
          passed: code.includes('dotenv'),
          icon: <FileCode className="w-4 h-4" />
        });
      }
    } else if (challenge.type === 'docker') {
      // Dockerfile 检查
      if (challenge.id === 'challenge-9-2') {
        checks.push({
          name: 'FROM 指令',
          passed: code.includes('FROM'),
          icon: <Server className="w-4 h-4" />
        });
        checks.push({
          name: 'WORKDIR 指令',
          passed: code.includes('WORKDIR'),
          icon: <FileCode className="w-4 h-4" />
        });
        checks.push({
          name: 'COPY 指令',
          passed: code.includes('COPY') || code.includes('ADD'),
          icon: <Copy className="w-4 h-4" />
        });
        checks.push({
          name: 'RUN 指令',
          passed: code.includes('RUN'),
          icon: <Terminal className="w-4 h-4" />
        });
        checks.push({
          name: 'EXPOSE 指令',
          passed: code.includes('EXPOSE'),
          icon: <Eye className="w-4 h-4" />
        });
        checks.push({
          name: 'CMD 指令',
          passed: code.includes('CMD') || code.includes('ENTRYPOINT'),
          icon: <PlayCircle className="w-4 h-4" />
        });
      }
      
      // GitHub Actions 检查
      if (challenge.id === 'challenge-9-3') {
        checks.push({
          name: '触发条件 (on)',
          passed: code.includes('on:'),
          icon: <Zap className="w-4 h-4" />
        });
        checks.push({
          name: '任务定义 (jobs)',
          passed: code.includes('jobs:'),
          icon: <Server className="w-4 h-4" />
        });
        checks.push({
          name: '步骤定义 (steps)',
          passed: code.includes('steps:'),
          icon: <Terminal className="w-4 h-4" />
        });
      }
      
      // Nginx 配置检查
      if (challenge.id === 'challenge-9-4') {
        checks.push({
          name: 'server 块',
          passed: code.includes('server {'),
          icon: <Server className="w-4 h-4" />
        });
        checks.push({
          name: 'listen 指令',
          passed: code.includes('listen'),
          icon: <Eye className="w-4 h-4" />
        });
        checks.push({
          name: 'location 路由',
          passed: code.includes('location'),
          icon: <Code className="w-4 h-4" />
        });
      }
    }
    
    const passedCount = checks.filter(c => c.passed).length;
    const status = passedCount === checks.length ? 'complete' : passedCount > 0 ? 'partial' : 'checking';
    
    setAnalysis({ checks, status });
  }, [code, challenge]);
  
  return (
    <div className="h-full overflow-auto bg-secondary-900 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-white">代码结构检查</h4>
          <span className={`text-xs px-2 py-1 rounded-full ${
            analysis.status === 'complete' ? 'bg-green-500/20 text-green-400' :
            analysis.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-secondary-700 text-secondary-400'
          }`}>
            {analysis.status === 'complete' ? '已完成' :
             analysis.status === 'partial' ? '进行中' : '检查中'}
          </span>
        </div>
        
        {analysis.checks.length === 0 ? (
          <p className="text-secondary-400 text-sm">正在分析代码...</p>
        ) : (
          <div className="space-y-2">
            {analysis.checks.map((check, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  check.passed ? 'bg-green-500/10' : 'bg-secondary-800/50'
                }`}
              >
                <div className={`flex-shrink-0 ${check.passed ? 'text-green-400' : 'text-secondary-500'}`}>
                  {check.passed ? <CheckCircle className="w-4 h-4" /> : check.icon}
                </div>
                <span className={`text-sm ${check.passed ? 'text-green-400' : 'text-secondary-400'}`}>
                  {check.name}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {analysis.status === 'complete' && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm text-center">
              ✓ 代码结构完整，可以提交验证！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChallengePage;
