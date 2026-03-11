import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw,
  Star,
  Award
} from 'lucide-react';
import { useLearning } from '../context/LearningContext';

function QuizSystem({ quiz, onComplete, onClose }) {
  const { dispatch, actions } = useLearning();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];

  const handleSelectAnswer = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowResult(true);
    
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = correctCount * 10;

    dispatch({ 
      type: actions.UPDATE_QUIZ_SCORE, 
      payload: { quizId: quiz.id, score } 
    });
    dispatch({ type: actions.ADD_XP, payload: xpEarned });

    if (score === 100) {
      dispatch({ type: actions.UNLOCK_ACHIEVEMENT, payload: 'quiz-master' });
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      xpEarned: correctCount * 10,
    };
  };

  const getScoreMessage = (percentage) => {
    if (percentage === 100) return { text: '完美！你是测验大师！', icon: '🏆' };
    if (percentage >= 80) return { text: '太棒了！继续保持！', icon: '🌟' };
    if (percentage >= 60) return { text: '不错！还有提升空间', icon: '👍' };
    return { text: '加油！再试一次吧', icon: '💪' };
  };

  if (showResult) {
    const score = calculateScore();
    const message = getScoreMessage(score.percentage);

    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{message.icon}</div>
          <h2 className="text-2xl font-bold text-white mb-2">{message.text}</h2>
          <p className="text-secondary-400 mb-6">
            你答对了 {score.correct}/{score.total} 道题
          </p>

          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={score.percentage >= 60 ? '#22c55e' : '#ef4444'}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 352' }}
                  animate={{ strokeDasharray: `${(score.percentage / 100) * 352} 352` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{score.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-400">
              <Star className="w-5 h-5" />
              <span className="font-semibold">+{score.xpEarned} XP</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {questions.map((q, index) => {
              const isCorrect = selectedAnswers[index] === q.correct;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    isCorrect 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  <span className="text-secondary-200 text-sm">第 {index + 1} 题</span>
                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '正确' : '错误'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 px-4 py-2 border border-secondary-600 rounded-lg text-secondary-300 hover:text-white hover:border-secondary-400 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新测验</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all"
            >
              <span>完成</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          {quiz.title}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-secondary-400 text-sm">
            {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index === currentQuestion
                  ? 'bg-primary-500'
                  : index < currentQuestion
                  ? selectedAnswers[index] !== undefined
                    ? 'bg-green-500'
                    : 'bg-secondary-600'
                  : 'bg-secondary-700'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h3 className="text-lg font-medium text-white mb-4">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10 text-white'
                      : 'border-secondary-600 bg-secondary-800/50 text-secondary-300 hover:border-secondary-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isSelected
                          ? 'bg-primary-500 text-white'
                          : 'bg-secondary-700 text-secondary-400'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            currentQuestion === 0
              ? 'text-secondary-600 cursor-not-allowed'
              : 'text-secondary-300 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>上一题</span>
        </button>

        {currentQuestion === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < totalQuestions}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              Object.keys(selectedAnswers).length < totalQuestions
                ? 'bg-secondary-700 text-secondary-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            <span>提交答案</span>
            <Trophy className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedAnswers[currentQuestion] === undefined
                ? 'bg-secondary-700 text-secondary-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-500 text-white'
            }`}
          >
            <span>下一题</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function MiniQuiz({ question, onComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (selectedAnswer === question.correct && onComplete) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-4">
      <h4 className="text-white font-medium mb-3">{question.question}</h4>
      
      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === question.correct;
          const isWrong = showResult && isSelected && index !== question.correct;
          
          return (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full p-3 text-left rounded-lg border transition-all ${
                isCorrect
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : isWrong
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : isSelected
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-secondary-600 bg-secondary-800/50 text-secondary-300 hover:border-secondary-500'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            selectedAnswer === null
              ? 'bg-secondary-700 text-secondary-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-500 text-white'
          }`}
        >
          提交答案
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <span className={`text-sm ${selectedAnswer === question.correct ? 'text-green-400' : 'text-red-400'}`}>
            {selectedAnswer === question.correct ? '✓ 回答正确！' : '✗ 回答错误'}
          </span>
          <button
            onClick={handleRetry}
            className="text-secondary-400 hover:text-white text-sm transition-colors"
          >
            重试
          </button>
        </div>
      )}
    </div>
  );
}

export { QuizSystem, MiniQuiz };
export default QuizSystem;
