import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, Terminal, Eye, Code2, Lightbulb, Check, X } from 'lucide-react';
import * as Babel from '@babel/standalone';

const challengeTemplates = {
  'counter': {
    title: '计数器组件',
    description: '创建一个可以增减数字的计数器',
    difficulty: 'easy',
    starterCode: `function Counter() {
  // 在这里编写你的代码
  // 提示：使用 useState 来管理计数状态
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {/* 显示计数 */}
      {/* 添加按钮 */}
      {/* 减少按钮 */}
    </div>
  );
}`,
    solution: `function Counter() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '48px', margin: '20px 0' }}>{count}</h2>
      <button 
        onClick={() => setCount(count - 1)}
        style={{ 
          padding: '10px 20px', 
          margin: '0 10px',
          fontSize: '18px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        减少
      </button>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          padding: '10px 20px', 
          margin: '0 10px',
          fontSize: '18px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        增加
      </button>
    </div>
  );
}`,
  },
};

// 本地预览组件
function LocalPreview({ code }) {
  const [error, setError] = useState(null);
  const [Component, setComponent] = useState(null);
  
  useEffect(() => {
    try {
      setError(null);
      
      // 提取组件名
      const componentMatch = code.match(/function\s+(\w+)\s*\(/);
      const componentName = componentMatch ? componentMatch[1] : 'App';
      
      // 使用 Babel 编译 JSX
      const transformed = Babel.transform(code, {
        presets: ['react'],
      }).code;
      
      // 创建组件
      const wrappedCode = `${transformed}; return ${componentName};`;
      const createComponent = new Function('React', wrappedCode);
      const CompiledComponent = createComponent(React);
      
      setComponent(() => CompiledComponent);
    } catch (err) {
      console.error('编译错误:', err);
      setError(err.message);
      setComponent(null);
    }
  }, [code]);
  
  if (error) {
    return (
      <div className="p-4 text-red-400 text-sm">
        <div className="font-bold mb-2">编译错误:</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }
  
  if (!Component) {
    return <div className="p-4 text-gray-400">加载中...</div>;
  }
  
  return (
    <div className="p-4">
      <Component />
    </div>
  );
}

function CodePlayground({ challengeId, onComplete, customCode, title, description }) {
  const [code, setCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  
  const challenge = challengeId ? challengeTemplates[challengeId] : null;
  
  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
    } else if (customCode) {
      setCode(customCode);
    } else {
      setCode(`function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello World!</h1>
      <p>开始编写你的代码吧！</p>
    </div>
  );
}`);
    }
  }, [challengeId, customCode]);
  
  const handleReset = () => {
    if (challenge) {
      setCode(challenge.starterCode);
    } else if (customCode) {
      setCode(customCode);
    }
    setShowSolution(false);
  };
  
  const handleShowSolution = () => {
    if (challenge?.solution) {
      setCode(challenge.solution);
      setShowSolution(true);
    }
  };
  
  return (
    <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-secondary-700 bg-secondary-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Code2 className="w-5 h-5 mr-2 text-primary-400" />
              {challenge?.title || title || '代码游乐场'}
            </h3>
            {(challenge?.description || description) && (
              <p className="text-secondary-400 text-sm mt-1">
                {challenge?.description || description}
              </p>
            )}
          </div>
          {challenge?.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              challenge.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {challenge.difficulty === 'easy' ? '简单' : challenge.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-secondary-800 border-b border-secondary-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'editor' 
                ? 'bg-primary-500/20 text-primary-400' 
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>代码</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'preview' 
                ? 'bg-primary-500/20 text-primary-400' 
                : 'text-secondary-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>预览</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1.5 bg-secondary-700 hover:bg-secondary-600 text-secondary-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重置</span>
          </button>
          {challenge?.solution && (
            <button
              onClick={handleShowSolution}
              className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showSolution ? '已显示答案' : '显示答案'}</span>
            </button>
          )}
          {onComplete && (
            <button
              onClick={onComplete}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>完成</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-secondary-900" style={{ minHeight: '400px' }}>
        {activeTab === 'editor' ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] p-4 bg-secondary-900 text-white font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
        ) : (
          <div className="h-[400px] overflow-auto">
            <LocalPreview code={code} />
          </div>
        )}
      </div>
    </div>
  );
}

export { challengeTemplates };
export default CodePlayground;
