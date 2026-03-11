import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Check, X, Loader2, Zap } from 'lucide-react';

function ApiPlayground() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/users/1');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const predefinedApis = [
    { name: '用户数据', url: 'https://jsonplaceholder.typicode.com/users/1', method: 'GET' },
    { name: '帖子列表', url: 'https://jsonplaceholder.typicode.com/posts', method: 'GET' },
    { name: '随机图片', url: 'https://dog.ceo/api/breeds/image/random', method: 'GET' },
    { name: '随机笑话', url: 'https://official-joke-api.appspot.com/random_joke', method: 'GET' },
  ];

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setActiveStep(1);

    const startTime = performance.now();

    try {
      setActiveStep(2);
      const res = await fetch(url, { method });
      
      setActiveStep(3);
      const data = await res.json();
      
      setActiveStep(4);
      const endTime = performance.now();
      setRequestTime(Math.round(endTime - startTime));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: data,
      });
      setActiveStep(5);
    } catch (err) {
      setError(err.message);
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResponse(null);
    setError(null);
    setRequestTime(null);
    setActiveStep(0);
  };

  const steps = [
    { id: 0, label: '准备请求', icon: '📝' },
    { id: 1, label: '发起请求', icon: '📤' },
    { id: 2, label: '等待响应', icon: '⏳' },
    { id: 3, label: '解析数据', icon: '🔄' },
    { id: 4, label: '完成', icon: '✅' },
  ];

  return (
    <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-secondary-700 bg-secondary-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            API 游乐场
          </h3>
          <button
            onClick={handleReset}
            className="text-secondary-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedApis.map((api, index) => (
            <button
              key={index}
              onClick={() => {
                setUrl(api.url);
                setMethod(api.method);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                url === api.url
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-secondary-700 text-secondary-300 hover:bg-secondary-600'
              }`}
            >
              {api.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-secondary-700 text-white px-3 py-2 rounded-lg border border-secondary-600 focus:outline-none focus:border-teal-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="输入 API URL..."
            className="flex-1 bg-secondary-700 text-white px-4 py-2 rounded-lg border border-secondary-600 focus:outline-none focus:border-teal-500 font-mono text-sm"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>请求中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>发送</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-secondary-400 mb-3">请求流程</h4>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  className={`flex flex-col items-center ${
                    activeStep >= step.id ? 'text-teal-400' : 'text-secondary-500'
                  }`}
                  animate={{
                    scale: activeStep === step.id ? 1.1 : 1,
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 ${
                      activeStep >= step.id
                        ? 'bg-teal-500/20 border-2 border-teal-500'
                        : 'bg-secondary-700 border-2 border-secondary-600'
                    }`}
                  >
                    {activeStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className="text-xs">{step.label}</span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      activeStep > step.id ? 'bg-teal-500' : 'bg-secondary-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 text-red-400 mb-2">
                <X className="w-5 h-5" />
                <span className="font-medium">请求失败</span>
              </div>
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {response.status} {response.statusText}
                  </span>
                  {requestTime && (
                    <span className="text-secondary-400 text-sm">
                      耗时 {requestTime}ms
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-secondary-900 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-secondary-800 border-b border-secondary-700">
                  <span className="text-secondary-400 text-sm font-medium">响应数据</span>
                </div>
                <pre className="p-4 overflow-auto max-h-80 text-sm">
                  <code className="text-green-400 font-mono whitespace-pre-wrap">
                    {JSON.stringify(response.data, null, 2)}
                  </code>
                </pre>
              </div>

              {response.data && response.data.message && (
                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                  <p className="text-teal-300">
                    <span className="font-medium">消息：</span> {response.data.message}
                  </p>
                </div>
              )}

              {response.data && response.data.image && (
                <div className="mt-4 text-center">
                  <img
                    src={response.data.image || response.data.message}
                    alt="API返回的图片"
                    className="max-w-full h-48 object-contain rounded-lg mx-auto"
                  />
                </div>
              )}

              {response.data && response.data.setup && response.data.data && response.data.data.punchline && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-lg">{response.data.setup}</p>
                  <p className="text-yellow-200 text-lg mt-2 font-medium">{response.data.punchline}</p>
                </div>
              )}
            </motion.div>
          )}

          {!response && !error && !loading && (
            <div className="text-center py-8 text-secondary-400">
              <p>选择一个预设 API 或输入自定义 URL，然后点击"发送"按钮</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ApiPlayground;
