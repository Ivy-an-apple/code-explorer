import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ArrowRight, Server, Globe, Database, Code } from 'lucide-react';

function ApiFlowVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [dataPacket, setDataPacket] = useState(null);

  const phases = [
    {
      id: 1,
      title: '1. 发起请求',
      description: '浏览器调用 fetch() 函数',
      code: `fetch('https://api.example.com/data')`,
      duration: 1500,
    },
    {
      id: 2,
      title: '2. 网络传输',
      description: '请求通过互联网发送到服务器',
      code: `// HTTP Request\nGET /data HTTP/1.1\nHost: api.example.com`,
      duration: 2000,
    },
    {
      id: 3,
      title: '3. 服务器处理',
      description: '服务器接收请求并处理数据',
      code: `// Server Processing\napp.get('/data', (req, res) => {\n  const data = getData();\n  res.json(data);\n});`,
      duration: 1500,
    },
    {
      id: 4,
      title: '4. 返回响应',
      description: '服务器返回 JSON 数据',
      code: `// HTTP Response\n{\n  "status": 200,\n  "data": {...}\n}`,
      duration: 2000,
    },
    {
      id: 5,
      title: '5. 解析数据',
      description: '前端解析 JSON 并更新界面',
      code: `const data = await response.json();\nsetData(data);`,
      duration: 1500,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    if (currentPhase > phases.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => prev + 1);
    }, phases[currentPhase - 1]?.duration || 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, currentPhase]);

  const handlePlay = () => {
    setCurrentPhase(1);
    setIsPlaying(true);
    setDataPacket(null);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase(0);
    setDataPacket(null);
  };

  const nodes = [
    { id: 'client', label: '客户端', icon: Globe, position: 'left' },
    { id: 'network', label: '网络', icon: ArrowRight, position: 'center' },
    { id: 'server', label: '服务器', icon: Server, position: 'right' },
  ];

  return (
    <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-secondary-700 bg-secondary-900/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-400" />
            API 数据流可视化
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              <span>播放动画</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-secondary-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            <motion.div
              className={`flex flex-col items-center p-4 rounded-xl ${
                currentPhase >= 1 ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-secondary-700/50 border-2 border-secondary-600'
              }`}
              animate={{
                scale: currentPhase === 1 || currentPhase === 5 ? 1.05 : 1,
              }}
            >
              <Globe className={`w-8 h-8 ${currentPhase >= 1 ? 'text-blue-400' : 'text-secondary-400'}`} />
              <span className={`mt-2 text-sm font-medium ${currentPhase >= 1 ? 'text-blue-400' : 'text-secondary-400'}`}>
                客户端
              </span>
              <span className="text-xs text-secondary-500 mt-1">浏览器</span>
            </motion.div>

            <div className="flex-1 mx-4 relative h-2 bg-secondary-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{
                  width: currentPhase >= 2 && currentPhase <= 4 ? '100%' : currentPhase >= 5 ? '100%' : '0%',
                }}
                transition={{ duration: 1.5 }}
              />
              <AnimatePresence>
                {currentPhase >= 2 && currentPhase <= 4 && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
                    initial={{ left: '0%' }}
                    animate={{ left: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'linear' }}
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className={`flex flex-col items-center p-4 rounded-xl ${
                currentPhase >= 3 ? 'bg-purple-500/20 border-2 border-purple-500' : 'bg-secondary-700/50 border-2 border-secondary-600'
              }`}
              animate={{
                scale: currentPhase === 3 ? 1.05 : 1,
              }}
            >
              <Server className={`w-8 h-8 ${currentPhase >= 3 ? 'text-purple-400' : 'text-secondary-400'}`} />
              <span className={`mt-2 text-sm font-medium ${currentPhase >= 3 ? 'text-purple-400' : 'text-secondary-400'}`}>
                服务器
              </span>
              <span className="text-xs text-secondary-500 mt-1">API</span>
            </motion.div>
          </div>
        </div>

        <div className="space-y-3">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className={`p-4 rounded-lg border transition-all ${
                currentPhase === phase.id
                  ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/30'
                  : currentPhase > phase.id
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-secondary-700/30 border-secondary-700'
              }`}
              animate={{
                opacity: currentPhase >= phase.id ? 1 : 0.5,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentPhase > phase.id
                          ? 'bg-green-500 text-white'
                          : currentPhase === phase.id
                          ? 'bg-teal-500 text-white'
                          : 'bg-secondary-600 text-secondary-400'
                      }`}
                    >
                      {currentPhase > phase.id ? '✓' : phase.id}
                    </span>
                    <h4 className="font-medium text-white">{phase.title}</h4>
                  </div>
                  <p className="text-secondary-400 text-sm ml-8">{phase.description}</p>
                </div>
              </div>
              <motion.div
                className="mt-3 ml-8"
                initial={false}
                animate={{
                  height: currentPhase === phase.id ? 'auto' : 0,
                  opacity: currentPhase === phase.id ? 1 : 0,
                }}
              >
                <pre className="bg-secondary-900 rounded-lg p-3 overflow-x-auto">
                  <code className="text-green-400 font-mono text-sm whitespace-pre">{phase.code}</code>
                </pre>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {!isPlaying && currentPhase === 0 && (
          <div className="text-center py-8 text-secondary-400">
            <p>点击"播放动画"查看 API 请求的完整流程</p>
          </div>
        )}

        {currentPhase > phases.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
          >
            <p className="text-green-400 font-medium">🎉 API 请求流程完成！</p>
            <p className="text-green-300 text-sm mt-1">数据已成功获取并显示在界面上</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ApiFlowVisualizer;
