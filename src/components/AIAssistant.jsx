import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2,
  Settings,
  Trash2,
  Sparkles,
  Code,
  Lightbulb,
  BookOpen,
  Maximize2,
  Minimize2
} from 'lucide-react';

const AI_MODES = [
  { id: 'chat', label: '问答对话', icon: MessageCircle, description: '询问编程相关问题' },
  { id: 'explain', label: '代码解释', icon: Code, description: '粘贴代码，AI帮你解释' },
  { id: 'suggest', label: '学习建议', icon: Lightbulb, description: '获取个性化学习建议' },
];

const SYSTEM_PROMPTS = {
  chat: `你是一个专业的编程学习助手，帮助用户学习前端开发。请用简洁、友好的中文回答问题。回答时可以包含代码示例，使用 markdown 格式。`,
  explain: `你是一个代码解释专家。用户会粘贴代码片段，请用中文详细解释代码的功能、原理和关键点。使用 markdown 格式，代码块使用正确的语法高亮。`,
  suggest: `你是一个学习顾问。根据用户的学习进度和问题，给出个性化的学习建议。建议要具体、可执行。使用 markdown 格式回答。`,
};

function AIAssistant({ isOpen, onClose, initialMessage = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState('chat');
  const [isExpanded, setIsExpanded] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(52);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const textareaContainerRef = useRef(null);
  const initialMessageSent = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('ai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 处理拖拽调整高度
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaY = dragStartY.current - e.clientY;
      const newHeight = Math.max(52, Math.min(400, dragStartHeight.current + deltaY));
      setTextareaHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = textareaHeight;
  };

  // 处理初始消息
  useEffect(() => {
    if (isOpen && initialMessage && !initialMessageSent.current && apiKey) {
      initialMessageSent.current = true;
      setInput(initialMessage);
    }
    
    if (!isOpen) {
      initialMessageSent.current = false;
    }
  }, [isOpen, initialMessage, apiKey]);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('ai_api_key', key);
    setShowSettings(false);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const callDoubaoAPI = async (userMessage) => {
    if (!apiKey) {
      throw new Error('请先设置 API Key');
    }

    const systemPrompt = SYSTEM_PROMPTS[mode];
    
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Doubao-Seed-1.8_TPM_OUT1K',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '抱歉，我无法生成回复。';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await callDoubaoAPI(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ 错误: ${error.message}\n\n请检查你的 API Key 是否正确设置。`,
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    const formatContent = (content) => {
      // 处理代码块
      const parts = content.split(/(```[\s\S]*?```)/g);
      return parts.map((part, i) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
          if (match) {
            const [, lang, code] = match;
            return (
              <pre key={i} className="bg-secondary-900 rounded-lg p-3 my-2 overflow-x-auto max-w-full">
                <code className={`text-sm font-mono ${lang === 'javascript' || lang === 'jsx' ? 'text-yellow-400' : 'text-green-400'}`}>
                  {code.trim()}
                </code>
              </pre>
            );
          }
        }
        // 处理行内代码
        if (part.includes('`')) {
          const inlineParts = part.split(/(`[^`]+`)/g);
          return (
            <span key={i}>
              {inlineParts.map((inline, j) => {
                if (inline.startsWith('`') && inline.endsWith('`')) {
                  return (
                    <code key={j} className="bg-secondary-900 px-1 py-0.5 rounded text-yellow-400 font-mono text-sm">
                      {inline.slice(1, -1)}
                    </code>
                  );
                }
                return <span key={j}>{inline}</span>;
              })}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      });
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-3 max-w-[90%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser ? 'bg-primary-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
          }`}>
            {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
          <div className={`p-4 rounded-2xl ${
            isUser 
              ? 'bg-primary-500 text-white' 
              : message.isError
              ? 'bg-red-500/10 border border-red-500/20 text-red-300'
              : 'bg-secondary-700 text-secondary-100'
          }`}>
            <div className="text-sm whitespace-pre-wrap break-words overflow-hidden">
              {formatContent(message.content)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-secondary-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[95vw] h-[95vh] max-w-none' 
                : 'w-full max-w-3xl h-[85vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="p-4 border-b border-secondary-700 bg-secondary-900 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI 学习助手</h2>
                    <p className="text-xs text-secondary-400">基于豆包大模型</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                    title={isExpanded ? '缩小窗口' : '放大窗口'}
                  >
                    {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearMessages}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-secondary-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* API Key 设置 */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-secondary-700"
                >
                  <label className="block text-sm text-secondary-400 mb-2">API Key</label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="输入你的豆包 API Key"
                      className="flex-1 bg-secondary-700 text-white px-3 py-2 rounded-lg border border-secondary-600 focus:outline-none focus:border-primary-500"
                    />
                    <button
                      onClick={() => saveApiKey(apiKey)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
                    >
                      保存
                    </button>
                  </div>
                  <p className="text-xs text-secondary-500 mt-2">
                    API Key 将保存在本地浏览器中，不会上传到服务器
                  </p>
                </motion.div>
              )}

              {/* 模式选择 */}
              <div className="flex space-x-2 mt-4">
                {AI_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                      mode === m.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-secondary-700 text-secondary-400 hover:text-white'
                    }`}
                  >
                    <m.icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">开始学习之旅</h3>
                  <p className="text-secondary-400 text-sm max-w-xs">
                    {mode === 'chat' && '问我任何编程问题，我会尽力帮助你理解'}
                    {mode === 'explain' && '粘贴代码片段，我会帮你解释每一行的作用'}
                    {mode === 'suggest' && '告诉我你的学习进度，我会给出个性化建议'}
                  </p>
                  {!apiKey && (
                    <p className="text-yellow-400 text-sm mt-4">
                      ⚠️ 请先点击右上角设置按钮配置 API Key
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {messages.map((message, index) => renderMessage(message, index))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start space-x-3 mb-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-secondary-700 p-3 rounded-xl">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* 输入区域 */}
            <div className="p-4 border-t border-secondary-700 bg-secondary-900 flex-shrink-0">
              {/* 拖拽调整高度条 */}
              <div
                onMouseDown={handleDragStart}
                className={`w-full h-2 flex items-center justify-center cursor-ns-resize mb-2 group ${
                  isDragging ? 'bg-primary-500/30' : ''
                }`}
                title="拖拽调整输入框高度"
              >
                <div className={`w-12 h-1 rounded-full transition-colors ${
                  isDragging ? 'bg-primary-400' : 'bg-secondary-600 group-hover:bg-secondary-500'
                }`} />
              </div>
              
              <div className="flex space-x-3 items-end">
                <div ref={textareaContainerRef} className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'chat' ? '输入你的问题，按 Enter 发送，Shift+Enter 换行...' :
                      mode === 'explain' ? '粘贴代码片段，按 Enter 发送...' :
                      '描述你的学习情况，按 Enter 发送...'
                    }
                    className="w-full bg-secondary-700 text-white px-4 py-3 rounded-xl border border-secondary-600 focus:outline-none focus:border-primary-500 resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-track-transparent"
                    style={{ 
                      height: `${textareaHeight}px`,
                      minHeight: '52px',
                      maxHeight: '400px'
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !apiKey}
                  className={`px-5 py-3 rounded-xl font-medium transition-all flex-shrink-0 ${
                    !input.trim() || isLoading || !apiKey
                      ? 'bg-secondary-700 text-secondary-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-secondary-500 mt-2 text-center">
                Enter 发送 · Shift+Enter 换行 · 上方拖拽调整高度
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AIAssistantButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/25 flex items-center justify-center z-40"
    >
      <Sparkles className="w-6 h-6" />
    </motion.button>
  );
}

export { AIAssistant, AIAssistantButton };
export default AIAssistant;
