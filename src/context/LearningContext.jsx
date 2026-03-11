import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 初始状态
const initialState = {
  user: {
    name: '代码探险家',
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    lastStudyDate: null,
  },
  progress: {
    currentChapter: 1,
    completedLessons: [],
    completedChapters: [],
    quizScores: {},
    challengeScores: {},
  },
  achievements: [],
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    darkMode: true,
  },
};

// 从 localStorage 加载状态
const loadState = () => {
  try {
    const savedState = localStorage.getItem('codeExplorerState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('加载状态失败:', error);
  }
  return initialState;
};

// 成就检查函数 - 根据当前状态检查应解锁的成就
export function checkAchievements(state) {
  const newAchievements = [];
  const { user, progress, achievements } = state;
  
  // 1. 第一步 - 完成第一个课程
  if (progress.completedLessons.length >= 1 && !achievements.includes('first-step')) {
    newAchievements.push('first-step');
  }
  
  // 2. Hello World - 运行第一个项目 (通过完成第一个实践课程)
  const hasCompletedPracticeLesson = progress.completedLessons.some(lessonId => {
    const chapter = chaptersData.find(c => c.lessons.some(l => l.id === lessonId));
    const lesson = chapter?.lessons.find(l => l.id === lessonId);
    return lesson?.type === 'practice' || lesson?.type === 'challenge';
  });
  if (hasCompletedPracticeLesson && !achievements.includes('hello-world')) {
    newAchievements.push('hello-world');
  }
  
  // 3. Bug 猎手 - 成功修复代码错误 (通过完成编程挑战)
  const completedChallenges = Object.keys(progress.challengeScores || {});
  if (completedChallenges.length >= 1 && !achievements.includes('bug-hunter')) {
    newAchievements.push('bug-hunter');
  }
  
  // 4. 测验大师 - 满分完成测验 (在 QuizSystem 中单独处理)
  
  // 5. 连续学习 - 连续学习3天
  if (user.streak >= 3 && !achievements.includes('streak-3')) {
    newAchievements.push('streak-3');
  }
  
  // 6. 章节完成者 - 完成第一个章节
  if (progress.completedChapters.length >= 1 && !achievements.includes('chapter-complete')) {
    newAchievements.push('chapter-complete');
  }
  
  // 7. 进阶学习者 - 达到等级 5
  if (user.level >= 5 && !achievements.includes('level-5')) {
    newAchievements.push('level-5');
  }
  
  // 8. 全栈工程师 - 完成所有章节
  if (progress.completedChapters.length >= chaptersData.length && !achievements.includes('full-stack')) {
    newAchievements.push('full-stack');
  }
  
  return newAchievements;
}

// Action 类型
const ACTIONS = {
  UPDATE_USER: 'UPDATE_USER',
  ADD_XP: 'ADD_XP',
  LEVEL_UP: 'LEVEL_UP',
  COMPLETE_LESSON: 'COMPLETE_LESSON',
  COMPLETE_CHAPTER: 'COMPLETE_CHAPTER',
  UPDATE_QUIZ_SCORE: 'UPDATE_QUIZ_SCORE',
  UPDATE_CHALLENGE_SCORE: 'UPDATE_CHALLENGE_SCORE',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_PROGRESS: 'RESET_PROGRESS',
  UPDATE_STREAK: 'UPDATE_STREAK',
};

// Reducer
function learningReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case ACTIONS.ADD_XP: {
      const newTotalXp = state.user.totalXp + action.payload;
      const newXp = state.user.xp + action.payload;
      const xpNeeded = state.user.level * 100;
      
      let newLevel = state.user.level;
      let remainingXp = newXp;
      
      if (newXp >= xpNeeded) {
        newLevel = state.user.level + 1;
        remainingXp = newXp - xpNeeded;
      }

      return {
        ...state,
        user: {
          ...state.user,
          xp: remainingXp,
          totalXp: newTotalXp,
          level: newLevel,
        },
      };
    }

    case ACTIONS.COMPLETE_LESSON:
      if (state.progress.completedLessons.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLessons: [...state.progress.completedLessons, action.payload],
        },
      };

    case ACTIONS.COMPLETE_CHAPTER:
      if (state.progress.completedChapters.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          completedChapters: [...state.progress.completedChapters, action.payload],
          currentChapter: Math.max(state.progress.currentChapter, action.payload + 1),
        },
      };

    case ACTIONS.UPDATE_QUIZ_SCORE:
      return {
        ...state,
        progress: {
          ...state.progress,
          quizScores: {
            ...state.progress.quizScores,
            [action.payload.quizId]: action.payload.score,
          },
        },
      };

    case ACTIONS.UPDATE_CHALLENGE_SCORE:
      return {
        ...state,
        progress: {
          ...state.progress,
          challengeScores: {
            ...state.progress.challengeScores,
            [action.payload.challengeId]: action.payload.score,
          },
        },
      };

    case ACTIONS.UNLOCK_ACHIEVEMENT:
      if (state.achievements.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };

    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case ACTIONS.RESET_PROGRESS:
      return initialState;

    case ACTIONS.UPDATE_STREAK: {
      const today = new Date().toDateString();
      const lastStudy = state.user.lastStudyDate;
      
      let newStreak = state.user.streak;
      
      if (lastStudy) {
        const lastDate = new Date(lastStudy);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // 今天已经学习过，不更新
          return state;
        } else if (diffDays === 1) {
          // 连续学习
          newStreak = state.user.streak + 1;
        } else {
          // 中断后重新开始
          newStreak = 1;
        }
      } else {
        // 第一次学习
        newStreak = 1;
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          streak: newStreak,
          lastStudyDate: today,
        },
      };
    }

    default:
      return state;
  }
}

// Context
const LearningContext = createContext();

// Provider 组件
export function LearningProvider({ children }) {
  const [state, dispatch] = useReducer(learningReducer, loadState());

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('codeExplorerState', JSON.stringify(state));
  }, [state]);

  // 自动检测并解锁成就
  useEffect(() => {
    const newAchievements = checkAchievements(state);
    newAchievements.forEach(achievementId => {
      dispatch({ type: ACTIONS.UNLOCK_ACHIEVEMENT, payload: achievementId });
    });
  }, [
    state.progress.completedLessons.length,
    state.progress.completedChapters.length,
    state.user.level,
    state.user.streak,
    Object.keys(state.progress.challengeScores || {}).length
  ]);

  // 计算章节进度
  const getChapterProgress = (chapterId) => {
    const chapter = chaptersData.find(c => c.id === chapterId);
    if (!chapter) return 0;
    
    const completedLessons = chapter.lessons.filter(lesson => 
      state.progress.completedLessons.includes(lesson.id)
    ).length;
    
    return Math.round((completedLessons / chapter.lessons.length) * 100);
  };

  // 计算总进度
  const getTotalProgress = () => {
    const totalLessons = chaptersData.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
    return Math.round((state.progress.completedLessons.length / totalLessons) * 100);
  };

  // 获取下一级所需 XP
  const getXpNeeded = () => {
    return state.user.level * 100;
  };

  const value = {
    state,
    dispatch,
    actions: ACTIONS,
    getChapterProgress,
    getTotalProgress,
    getXpNeeded,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

// 自定义 Hook
export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning 必须在 LearningProvider 内使用');
  }
  return context;
}

// 章节数据
export const chaptersData = [
  {
    id: 1,
    title: '新手村',
    subtitle: '开发环境搭建',
    description: '从零开始，搭建你的开发环境',
    icon: '🌱',
    color: 'green',
    lessons: [
      { id: '1-1', title: '什么是前后端分离？', type: 'concept', xp: 10 },
      { id: '1-2', title: '安装 Node.js 和 VS Code', type: 'practice', xp: 20 },
      { id: '1-3', title: '认识命令行工具', type: 'concept', xp: 15 },
      { id: '1-4', title: '运行你的第一个项目', type: 'practice', xp: 25 },
    ],
    quiz: {
      id: 'quiz-1',
      title: '新手村测验',
      questions: [
        {
          id: 1,
          question: 'Node.js 是什么？',
          options: ['浏览器', 'JavaScript 运行时', '数据库', '操作系统'],
          correct: 1,
        },
        {
          id: 2,
          question: 'VS Code 是什么类型的工具？',
          options: ['浏览器', '代码编辑器', '数据库管理工具', '图片处理软件'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 2,
    title: '工具大师',
    subtitle: '必备软件详解',
    description: '深入了解开发工具的使用',
    icon: '⚙️',
    color: 'blue',
    lessons: [
      { id: '2-1', title: 'VS Code 深度使用指南', type: 'concept', xp: 15 },
      { id: '2-2', title: '浏览器开发者工具', type: 'practice', xp: 20 },
      { id: '2-3', title: 'Git 版本控制入门', type: 'concept', xp: 25 },
      { id: '2-4', title: 'npm 包管理器详解', type: 'practice', xp: 20 },
    ],
    quiz: {
      id: 'quiz-2',
      title: '工具大师测验',
      questions: [
        {
          id: 1,
          question: 'Git 的主要作用是什么？',
          options: ['写代码', '版本控制', '运行代码', '调试程序'],
          correct: 1,
        },
      ],
    },
  },
  {
    id: 3,
    title: '页面魔法师',
    subtitle: 'HTML/CSS 基础',
    description: '学习构建网页的基础知识',
    icon: '🎨',
    color: 'purple',
    lessons: [
      { id: '3-1', title: 'HTML 标签语义化', type: 'concept', xp: 15 },
      { id: '3-2', title: 'CSS 选择器与盒模型', type: 'concept', xp: 20 },
      { id: '3-3', title: 'Flexbox 布局实战', type: 'practice', xp: 25 },
      { id: '3-4', title: 'Tailwind CSS 快速上手', type: 'practice', xp: 20 },
    ],
    quiz: {
      id: 'quiz-3',
      title: '页面魔法师测验',
      questions: [],
    },
  },
  {
    id: 4,
    title: 'React 入门',
    subtitle: '组件化思维',
    description: '掌握现代前端开发框架',
    icon: '⚡',
    color: 'cyan',
    lessons: [
      { id: '4-1', title: '什么是 React？', type: 'concept', xp: 15 },
      { id: '4-2', title: 'JSX 语法详解', type: 'concept', xp: 20 },
      { id: '4-3', title: '组件与 Props', type: 'practice', xp: 25 },
      { id: '4-4', title: 'State 状态管理', type: 'practice', xp: 25 },
      { id: '4-5', title: '动手：做一个计数器组件', type: 'challenge', xp: 30 },
    ],
    quiz: {
      id: 'quiz-4',
      title: 'React 入门测验',
      questions: [],
    },
  },
  {
    id: 5,
    title: '路由导航',
    subtitle: '单页应用原理',
    description: '理解 SPA 和路由机制',
    icon: '🛣️',
    color: 'orange',
    lessons: [
      { id: '5-1', title: '什么是 SPA？', type: 'concept', xp: 15 },
      { id: '5-2', title: 'React Router 使用', type: 'practice', xp: 25 },
      { id: '5-3', title: '导航栏组件开发', type: 'practice', xp: 25 },
      { id: '5-4', title: '实战：完善网站导航', type: 'challenge', xp: 30 },
    ],
    quiz: {
      id: 'quiz-5',
      title: '路由导航测验',
      questions: [],
    },
  },
  {
    id: 6,
    title: '表单与交互',
    subtitle: '用户输入处理',
    description: '学习处理用户输入和表单验证',
    icon: '📝',
    color: 'pink',
    lessons: [
      { id: '6-1', title: '表单元素详解', type: 'concept', xp: 15 },
      { id: '6-2', title: '受控组件与非受控组件', type: 'concept', xp: 20 },
      { id: '6-3', title: '表单验证逻辑', type: 'practice', xp: 25 },
      { id: '6-4', title: '实战：联系表单开发', type: 'challenge', xp: 30 },
    ],
    quiz: {
      id: 'quiz-6',
      title: '表单与交互测验',
      questions: [],
    },
  },
  {
    id: 7,
    title: '学会调用API',
    subtitle: '工具宝箱',
    description: '掌握前端与后端通信的核心技能',
    icon: '🔧',
    color: 'teal',
    lessons: [
      { id: '7-1', title: '什么是 API？', type: 'concept', xp: 15 },
      { id: '7-2', title: 'fetch 函数详解', type: 'concept', xp: 20 },
      { id: '7-3', title: '处理 API 响应', type: 'practice', xp: 25 },
      { id: '7-4', title: '错误处理与 Loading 状态', type: 'practice', xp: 25 },
      { id: '7-5', title: '实战：调用天气 API', type: 'challenge', xp: 35 },
    ],
    quiz: {
      id: 'quiz-7',
      title: 'API 调用测验',
      questions: [
        {
          id: 1,
          question: 'API 是什么的缩写？',
          options: ['Application Programming Interface', 'Application Program Integration', 'Automated Programming Interface', 'Application Process Interface'],
          correct: 0,
        },
        {
          id: 2,
          question: 'fetch() 函数返回什么？',
          options: ['字符串', '数字', 'Promise', '数组'],
          correct: 2,
        },
        {
          id: 3,
          question: 'HTTP 状态码 200 表示什么？',
          options: ['请求失败', '请求成功', '服务器错误', '资源未找到'],
          correct: 1,
        },
        {
          id: 4,
          question: '以下哪个是正确的 fetch 调用方式？',
          options: ['fetch(url).then(res => res.json())', 'fetch(url).json()', 'fetch(url).response.json()', 'fetch.json(url)'],
          correct: 0,
        },
      ],
    },
  },
  {
    id: 8,
    title: '后端世界',
    subtitle: 'Node.js 与 Express',
    description: '探索服务器端开发',
    icon: '🖥️',
    color: 'indigo',
    lessons: [
      { id: '8-1', title: '什么是服务器？', type: 'concept', xp: 15 },
      { id: '8-2', title: 'Express 框架入门', type: 'practice', xp: 25 },
      { id: '8-3', title: 'API 接口设计', type: 'concept', xp: 20 },
      { id: '8-4', title: '邮件服务集成', type: 'practice', xp: 25 },
      { id: '8-5', title: '数据流动画演示', type: 'visual', xp: 20 },
    ],
    quiz: {
      id: 'quiz-8',
      title: '后端世界测验',
      questions: [],
    },
  },
  {
    id: 9,
    title: '部署上线',
    subtitle: '让世界看到你的作品',
    description: '学习项目部署和上线',
    icon: '🚀',
    color: 'yellow',
    lessons: [
      { id: '9-1', title: '购买域名和服务器', type: 'concept', xp: 15 },
      { id: '9-2', title: '项目打包构建', type: 'practice', xp: 20 },
      { id: '9-3', title: 'Nginx 配置', type: 'practice', xp: 25 },
      { id: '9-4', title: '数据库部署简介', type: 'concept', xp: 20 },
      { id: '9-5', title: '终极挑战：部署你的学习网站', type: 'challenge', xp: 50 },
    ],
    quiz: {
      id: 'quiz-9',
      title: '部署上线测验',
      questions: [],
    },
  },
];

// 成就数据
export const achievementsData = [
  {
    id: 'first-step',
    title: '第一步',
    description: '完成第一个课程',
    icon: '👣',
    xp: 10,
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    description: '运行第一个项目',
    icon: '👋',
    xp: 20,
  },
  {
    id: 'bug-hunter',
    title: 'Bug 猎手',
    description: '成功修复一个代码错误',
    icon: '🐛',
    xp: 30,
  },
  {
    id: 'quiz-master',
    title: '测验大师',
    description: '完成一次测验并获得满分',
    icon: '💯',
    xp: 50,
  },
  {
    id: 'streak-3',
    title: '连续学习',
    description: '连续学习 3 天',
    icon: '🔥',
    xp: 30,
  },
  {
    id: 'chapter-complete',
    title: '章节完成者',
    description: '完成第一个章节',
    icon: '📚',
    xp: 50,
  },
  {
    id: 'level-5',
    title: '进阶学习者',
    description: '达到等级 5',
    icon: '⭐',
    xp: 100,
  },
  {
    id: 'full-stack',
    title: '全栈工程师',
    description: '完成所有章节',
    icon: '🏆',
    xp: 500,
  },
];

// 编程挑战数据
export const challengesData = [
  // 第1章 新手村 - 开发环境搭建
  {
    id: 'challenge-1-1',
    chapterId: 1,
    title: 'Hello World',
    description: '创建你的第一个 React 组件，显示 "Hello World"',
    difficulty: 'easy',
    xp: 20,
    starterCode: `function HelloWorld() {
  // 在这里编写你的代码
  // 返回一个 h1 标签，显示 "Hello World"
  
  return (
    <div>
      {/* 在这里写代码 */}
    </div>
  );
}`,
    solution: `function HelloWorld() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-500">
        Hello World
      </h1>
      <p className="mt-4 text-gray-600">
        欢迎来到 React 的世界！
      </p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-1-2',
    chapterId: 1,
    title: '个人信息卡片',
    description: '创建一个展示个人信息的卡片组件',
    difficulty: 'easy',
    xp: 25,
    starterCode: `function ProfileCard() {
  // 定义你的个人信息
  const name = "你的名字";
  const age = 25;
  const hobby = "编程";
  
  return (
    <div>
      {/* 显示姓名、年龄、爱好 */}
    </div>
  );
}`,
    solution: `function ProfileCard() {
  const name = "张三";
  const age = 25;
  const hobby = "编程";
  
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
        👤
      </div>
      <h2 className="text-xl font-bold text-center mb-2">{name}</h2>
      <p className="text-gray-600 text-center">年龄: {age}</p>
      <p className="text-gray-600 text-center">爱好: {hobby}</p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-1-3',
    chapterId: 1,
    title: '简单的按钮组件',
    description: '创建一个可点击的按钮，点击后弹出提示',
    difficulty: 'easy',
    xp: 20,
    starterCode: `function ClickButton() {
  // 创建一个按钮
  // 点击时弹出 alert("你点击了按钮！")
  
  return (
    <div className="p-8 text-center">
      {/* 在这里创建按钮 */}
    </div>
  );
}`,
    solution: `function ClickButton() {
  const handleClick = () => {
    alert("你点击了按钮！");
  };
  
  return (
    <div className="p-8 text-center">
      <button 
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        点击我
      </button>
    </div>
  );
}`,
  },
  {
    id: 'challenge-1-4',
    chapterId: 1,
    title: '多元素布局',
    description: '使用 div 和 CSS 类创建一个简单的布局',
    difficulty: 'easy',
    xp: 25,
    starterCode: `function SimpleLayout() {
  // 创建一个包含头部、内容区、底部的简单布局
  
  return (
    <div>
      {/* 头部 */}
      {/* 内容区 */}
      {/* 底部 */}
    </div>
  );
}`,
    solution: `function SimpleLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">我的网站</h1>
      </header>
      
      <main className="flex-1 p-8 bg-gray-100">
        <h2 className="text-2xl mb-4">欢迎来到首页</h2>
        <p className="text-gray-700">这是内容区域</p>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 我的网站</p>
      </footer>
    </div>
  );
}`,
  },
  {
    id: 'challenge-1-5',
    chapterId: 1,
    title: '图片展示组件',
    description: '创建一个展示图片和标题的组件',
    difficulty: 'easy',
    xp: 25,
    starterCode: `function ImageCard() {
  // 使用 img 标签展示图片
  // 添加标题和描述文字
  
  return (
    <div>
      {/* 图片 */}
      {/* 标题 */}
      {/* 描述 */}
    </div>
  );
}`,
    solution: `function ImageCard() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" 
        alt="风景"
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">美丽的山景</h3>
        <p className="text-gray-600">这是一张展示大自然美景的照片</p>
      </div>
    </div>
  );
}`,
  },

  // 第2章 工具大师 - 必备软件详解
  {
    id: 'challenge-2-1',
    chapterId: 2,
    title: '待办事项列表',
    description: '创建一个简单的待办事项列表，可以添加新项目',
    difficulty: 'easy',
    xp: 30,
    starterCode: `function TodoList() {
  // 创建一个待办事项列表
  // 使用 useState 管理列表数据
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">待办事项</h2>
      {/* 输入框和添加按钮 */}
      {/* 待办列表 */}
    </div>
  );
}`,
    solution: `function TodoList() {
  const [todos, setTodos] = React.useState(['学习 React', '练习代码']);
  const [input, setInput] = React.useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input]);
      setInput('');
    }
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">待办事项</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入新任务"
          className="flex-1 border p-2 rounded"
        />
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          添加
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, i) => (
          <li key={i} className="bg-gray-100 p-3 rounded">{todo}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  {
    id: 'challenge-2-2',
    chapterId: 2,
    title: '计算器',
    description: '创建一个简单的计算器，支持加减乘除',
    difficulty: 'medium',
    xp: 40,
    starterCode: `function Calculator() {
  // 创建一个简单的计算器
  // 支持 +、-、*、/ 运算
  
  return (
    <div className="p-4">
      {/* 显示区域 */}
      {/* 数字按钮 */}
      {/* 运算符按钮 */}
    </div>
  );
}`,
    solution: `function Calculator() {
  const [display, setDisplay] = React.useState('0');
  const [prev, setPrev] = React.useState(null);
  const [op, setOp] = React.useState(null);
  
  const handleNum = (num) => {
    setDisplay(display === '0' ? num : display + num);
  };
  
  const handleOp = (operation) => {
    setPrev(parseFloat(display));
    setOp(operation);
    setDisplay('0');
  };
  
  const calculate = () => {
    const current = parseFloat(display);
    let result;
    switch(op) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = prev / current; break;
      default: return;
    }
    setDisplay(String(result));
    setOp(null);
  };
  
  const clear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
  };
  
  return (
    <div className="p-4 max-w-xs mx-auto bg-gray-900 rounded-xl">
      <div className="bg-gray-800 text-white text-right p-4 text-2xl mb-4 rounded">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['7','8','9','/'].map(n => (
          <button key={n} onClick={() => n === '/' ? handleOp('/') : handleNum(n)} 
            className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600">
            {n}
          </button>
        ))}
        {['4','5','6','*'].map(n => (
          <button key={n} onClick={() => n === '*' ? handleOp('*') : handleNum(n)} 
            className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600">
            {n}
          </button>
        ))}
        {['1','2','3','-'].map(n => (
          <button key={n} onClick={() => n === '-' ? handleOp('-') : handleNum(n)} 
            className="bg-gray-700 text-white p-4 rounded hover:bg-gray-600">
            {n}
          </button>
        ))}
        {['0','C','=','+'].map(n => (
          <button key={n} 
            onClick={() => {
              if (n === 'C') clear();
              else if (n === '=') calculate();
              else if (n === '+') handleOp('+');
              else handleNum(n);
            }} 
            className={\`p-4 rounded \${n === '=' ? 'bg-blue-500' : 'bg-gray-700'} text-white hover:opacity-80\`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-2-3',
    chapterId: 2,
    title: '颜色选择器',
    description: '创建一个颜色选择器，点击颜色改变背景色',
    difficulty: 'easy',
    xp: 25,
    starterCode: `function ColorPicker() {
  // 创建几个颜色按钮
  // 点击后改变页面背景色
  
  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">选择背景颜色</h2>
      {/* 颜色按钮 */}
    </div>
  );
}`,
    solution: `function ColorPicker() {
  const [bgColor, setBgColor] = React.useState('white');
  
  const colors = [
    { name: '红色', value: '#ef4444' },
    { name: '绿色', value: '#22c55e' },
    { name: '蓝色', value: '#3b82f6' },
    { name: '黄色', value: '#eab308' },
    { name: '紫色', value: '#a855f7' },
  ];
  
  return (
    <div className="min-h-screen p-8 transition-colors duration-300" style={{ backgroundColor: bgColor }}>
      <h2 className="text-xl mb-4 font-bold">选择背景颜色</h2>
      <div className="flex gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => setBgColor(color.value)}
            className="w-16 h-16 rounded-lg shadow-lg hover:scale-110 transition-transform"
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
      </div>
      <p className="mt-4">当前颜色: {bgColor}</p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-2-4',
    chapterId: 2,
    title: '时钟组件',
    description: '创建一个实时显示当前时间的时钟',
    difficulty: 'medium',
    xp: 35,
    starterCode: `function Clock() {
  // 使用 useState 和 useEffect 创建实时时钟
  // 每秒更新一次时间
  
  return (
    <div className="p-8 text-center">
      {/* 显示当前时间 */}
    </div>
  );
}`,
    solution: `function Clock() {
  const [time, setTime] = React.useState(new Date());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  return (
    <div className="p-8 text-center bg-gray-900 text-white rounded-xl max-w-md mx-auto">
      <div className="text-5xl font-mono font-bold mb-4">
        {formatTime(time)}
      </div>
      <div className="text-xl text-gray-400">
        {formatDate(time)}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-2-5',
    chapterId: 2,
    title: '评分组件',
    description: '创建一个五星评分组件，可以点击选择评分',
    difficulty: 'easy',
    xp: 30,
    starterCode: `function StarRating() {
  // 创建5个星星
  // 点击星星设置评分
  // 鼠标悬停时高亮
  
  return (
    <div className="p-4">
      <h3 className="mb-2">请评分:</h3>
      {/* 星星 */}
    </div>
  );
}`,
    solution: `function StarRating() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  
  return (
    <div className="p-4">
      <h3 className="mb-2 font-bold">请评分:</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl transition-colors"
            style={{ color: star <= (hover || rating) ? '#fbbf24' : '#d1d5db' }}
          >
            ★
          </button>
        ))}
      </div>
      <p className="mt-2 text-gray-600">
        {rating > 0 ? \`你给了 \${rating} 星\` : '点击星星评分'}
      </p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-2-6',
    chapterId: 2,
    title: '标签页组件',
    description: '创建一个可以切换内容的标签页组件',
    difficulty: 'medium',
    xp: 35,
    starterCode: `function Tabs() {
  // 创建3个标签页
  // 点击标签切换显示内容
  
  return (
    <div className="p-4">
      {/* 标签按钮 */}
      {/* 内容区域 */}
    </div>
  );
}`,
    solution: `function Tabs() {
  const [activeTab, setActiveTab] = React.useState('home');
  
  const tabs = [
    { id: 'home', label: '首页', content: '欢迎来到首页！这是首页的内容。' },
    { id: 'about', label: '关于', content: '关于我们：我们是一个优秀的团队。' },
    { id: 'contact', label: '联系', content: '联系方式：email@example.com' },
  ];
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={\`px-4 py-2 \${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-b-lg mt-2">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
}`,
  },

  // 第3章 页面魔法师 - HTML/CSS基础
  {
    id: 'challenge-3-1',
    chapterId: 3,
    title: '卡片布局',
    description: '使用 Flexbox 创建一个响应式卡片布局',
    difficulty: 'easy',
    xp: 30,
    starterCode: `function CardLayout() {
  // 创建3个卡片，使用 Flexbox 布局
  // 在大屏幕上水平排列，小屏幕上垂直排列
  
  return (
    <div className="p-4">
      {/* 卡片容器 */}
      {/* 卡片1 */}
      {/* 卡片2 */}
      {/* 卡片3 */}
    </div>
  );
}`,
    solution: `function CardLayout() {
  const cards = [
    { title: '卡片1', desc: '这是第一张卡片', color: 'bg-blue-500' },
    { title: '卡片2', desc: '这是第二张卡片', color: 'bg-green-500' },
    { title: '卡片3', desc: '这是第三张卡片', color: 'bg-purple-500' },
  ];
  
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {cards.map((card, i) => (
          <div key={i} className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={\`h-32 \${card.color}\`}></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-3-2',
    chapterId: 3,
    title: '导航栏',
    description: '创建一个响应式导航栏，支持移动端菜单',
    difficulty: 'medium',
    xp: 40,
    starterCode: `function Navbar() {
  // 创建导航栏
  // 桌面端显示水平菜单
  // 移动端显示汉堡菜单
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      {/* Logo */}
      {/* 导航链接 */}
      {/* 移动端菜单按钮 */}
    </nav>
  );
}`,
    solution: `function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const links = ['首页', '关于', '服务', '联系'];
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold">Logo</div>
          
          {/* 桌面端菜单 */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <a key={link} href="#" className="hover:text-gray-300">
                {link}
              </a>
            ))}
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* 移动端菜单 */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {links.map((link) => (
              <a key={link} href="#" className="block py-2 hover:text-gray-300">
                {link}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}`,
  },
  {
    id: 'challenge-3-3',
    chapterId: 3,
    title: '网格画廊',
    description: '使用 CSS Grid 创建一个图片画廊',
    difficulty: 'easy',
    xp: 30,
    starterCode: `function ImageGallery() {
  // 使用 CSS Grid 创建图片画廊
  // 桌面端显示3列，平板2列，手机1列
  
  return (
    <div className="p-4">
      {/* 图片网格 */}
    </div>
  );
}`,
    solution: `function ImageGallery() {
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300',
  ];
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-lg shadow-lg">
            <img 
              src={src} 
              alt={\`图片 \${i + 1}\`}
              className="w-full h-48 object-cover hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-3-4',
    chapterId: 3,
    title: '登录表单',
    description: '创建一个美观的登录表单',
    difficulty: 'medium',
    xp: 35,
    starterCode: `function LoginForm() {
  // 创建登录表单
  // 包含用户名、密码输入框和登录按钮
  
  return (
    <div className="p-4">
      {/* 登录表单 */}
    </div>
  );
}`,
    solution: `function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">登录</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">用户名</label>
            <input 
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">密码</label>
            <input 
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              placeholder="请输入密码"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            登录
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          还没有账号？ <a href="#" className="text-blue-500">立即注册</a>
        </p>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-3-5',
    chapterId: 3,
    title: '价格卡片',
    description: '创建一个定价页面的价格卡片组件',
    difficulty: 'medium',
    xp: 40,
    starterCode: `function PricingCard() {
  // 创建3个价格卡片
  // 突出显示推荐方案
  
  return (
    <div className="p-4">
      {/* 价格卡片 */}
    </div>
  );
}`,
    solution: `function PricingCard() {
  const plans = [
    { name: '基础版', price: '¥29', features: ['1个用户', '5GB 存储', '基础支持'], popular: false },
    { name: '专业版', price: '¥99', features: ['5个用户', '50GB 存储', '优先支持', '高级功能'], popular: true },
    { name: '企业版', price: '¥299', features: ['无限用户', '无限存储', '24/7支持', '定制功能'], popular: false },
  ];
  
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={\`flex-1 max-w-sm rounded-2xl p-6 \${
              plan.popular 
                ? 'bg-blue-600 text-white shadow-xl scale-105' 
                : 'bg-white shadow-lg'
            }\`}
          >
            {plan.popular && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                推荐
              </span>
            )}
            <h3 className="text-xl font-bold mt-4">{plan.name}</h3>
            <p className="text-3xl font-bold my-4">{plan.price}<span className="text-sm font-normal">/月</span></p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              className={\`w-full py-2 rounded-lg font-bold \${
                plan.popular 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-600 text-white'
              }\`}
            >
              选择方案
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },

  // 第4章 React入门 - 组件化思维
  {
    id: 'challenge-4-1',
    chapterId: 4,
    title: '商品卡片',
    description: '使用 Props 创建可复用的商品卡片组件',
    difficulty: 'easy',
    xp: 30,
    starterCode: `// 创建 ProductCard 组件，接收 name, price, image 作为 props
function ProductCard(props) {
  // 使用 props 显示商品信息
  
  return (
    <div>
      {/* 商品图片 */}
      {/* 商品名称 */}
      {/* 商品价格 */}
    </div>
  );
}

function App() {
  // 使用 ProductCard 显示3个不同的商品
  return (
    <div className="p-4">
      {/* 商品卡片1 */}
      {/* 商品卡片2 */}
      {/* 商品卡片3 */}
    </div>
  );
}`,
    solution: `function ProductCard({ name, price, image }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-red-500 text-xl font-bold mt-2">¥{price}</p>
        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          加入购物车
        </button>
      </div>
    </div>
  );
}

function App() {
  const products = [
    { name: '无线耳机', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300' },
    { name: '智能手表', price: 899, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' },
    { name: '蓝牙音箱', price: 199, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300' },
  ];
  
  return (
    <div className="p-4 flex gap-4 flex-wrap justify-center">
      {products.map((product) => (
        <ProductCard key={product.name} {...product} />
      ))}
    </div>
  );
}`,
  },
  {
    id: 'challenge-4-2',
    chapterId: 4,
    title: '计数器进阶',
    description: '创建一个功能完善的计数器，支持步长设置',
    difficulty: 'easy',
    xp: 35,
    starterCode: `function AdvancedCounter() {
  // 创建计数器
  // 支持设置步长（每次增加/减少的数量）
  // 支持重置
  // 显示操作历史
  
  return (
    <div className="p-4">
      {/* 计数显示 */}
      {/* 步长设置 */}
      {/* 操作按钮 */}
      {/* 历史记录 */}
    </div>
  );
}`,
    solution: `function AdvancedCounter() {
  const [count, setCount] = React.useState(0);
  const [step, setStep] = React.useState(1);
  const [history, setHistory] = React.useState([]);
  
  const updateCount = (operation) => {
    const newCount = operation === 'add' ? count + step : count - step;
    setCount(newCount);
    setHistory([\`\${operation === 'add' ? '+' : '-'}\${step} = \${newCount}\`, ...history].slice(0, 5));
  };
  
  const reset = () => {
    setCount(0);
    setHistory([]);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto bg-gray-50 rounded-xl">
      <div className="text-center mb-6">
        <span className="text-5xl font-bold text-blue-600">{count}</span>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">步长:</label>
        <input 
          type="number" 
          value={step} 
          onChange={(e) => setStep(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
          min="1"
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => updateCount('subtract')}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          -{step}
        </button>
        <button 
          onClick={reset}
          className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        >
          重置
        </button>
        <button 
          onClick={() => updateCount('add')}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          +{step}
        </button>
      </div>
      
      {history.length > 0 && (
        <div className="bg-white p-3 rounded">
          <h4 className="font-bold mb-2">最近操作:</h4>
          <ul className="text-sm text-gray-600">
            {history.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`,
  },
  {
    id: 'challenge-4-3',
    chapterId: 4,
    title: '列表渲染与过滤',
    description: '创建一个可搜索和过滤的用户列表',
    difficulty: 'medium',
    xp: 40,
    starterCode: `function UserList() {
  // 创建一个用户列表
  // 支持按姓名搜索
  // 支持按角色过滤
  
  const users = [
    { id: 1, name: '张三', role: '管理员', avatar: '👨‍💼' },
    { id: 2, name: '李四', role: '用户', avatar: '👩‍💻' },
    { id: 3, name: '王五', role: '用户', avatar: '👨‍🎨' },
    { id: 4, name: '赵六', role: '编辑', avatar: '👩‍💼' },
  ];
  
  return (
    <div className="p-4">
      {/* 搜索框 */}
      {/* 角色过滤器 */}
      {/* 用户列表 */}
    </div>
  );
}`,
    solution: `function UserList() {
  const [search, setSearch] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('全部');
  
  const users = [
    { id: 1, name: '张三', role: '管理员', avatar: '👨‍💼' },
    { id: 2, name: '李四', role: '用户', avatar: '👩‍💻' },
    { id: 3, name: '王五', role: '用户', avatar: '👨‍🎨' },
    { id: 4, name: '赵六', role: '编辑', avatar: '👩‍💼' },
    { id: 5, name: '钱七', role: '管理员', avatar: '👩‍💻' },
  ];
  
  const roles = ['全部', ...new Set(users.map(u => u.role))];
  
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === '全部' || user.role === filterRole;
    return matchSearch && matchRole;
  });
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">用户列表</h2>
      
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="搜索用户..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        
        <select 
          value={filterRole} 
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      
      <div className="space-y-2">
        {filteredUsers.map(user => (
          <div key={user.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl mr-3">{user.avatar}</span>
            <div className="flex-1">
              <p className="font-bold">{user.name}</p>
              <span className="text-sm text-gray-500">{user.role}</span>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-gray-500 text-center">
        共 {filteredUsers.length} 位用户
      </p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-4-4',
    chapterId: 4,
    title: '模态框组件',
    description: '创建一个可复用的模态框（弹窗）组件',
    difficulty: 'medium',
    xp: 45,
    starterCode: `// 创建 Modal 组件
function Modal({ isOpen, onClose, title, children }) {
  // 如果 isOpen 为 false，不渲染任何内容
  // 显示标题和内容
  // 提供关闭按钮
  
  return (
    <div>
      {/* 模态框内容 */}
    </div>
  );
}

function App() {
  // 使用 Modal 组件
  return (
    <div className="p-4">
      {/* 触发按钮 */}
      {/* Modal 组件 */}
    </div>
  );
}`,
    solution: `function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div className="p-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        打开模态框
      </button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="提示"
      >
        <p className="text-gray-700">这是一个模态框组件！</p>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            关闭
          </button>
        </div>
      </Modal>
    </div>
  );
}`,
  },
  {
    id: 'challenge-4-5',
    chapterId: 4,
    title: '购物车组件',
    description: '创建一个简单的购物车，支持添加、删除、修改数量',
    difficulty: 'hard',
    xp: 60,
    starterCode: `function ShoppingCart() {
  // 创建购物车组件
  // 支持添加商品、删除商品、修改数量
  // 显示总价
  
  const [cart, setCart] = React.useState([
    { id: 1, name: '商品A', price: 99, quantity: 1 },
    { id: 2, name: '商品B', price: 199, quantity: 2 },
  ]);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">购物车</h2>
      {/* 购物车列表 */}
      {/* 总价 */}
    </div>
  );
}`,
    solution: `function ShoppingCart() {
  const [cart, setCart] = React.useState([
    { id: 1, name: '无线耳机', price: 299, quantity: 1 },
    { id: 2, name: '手机壳', price: 49, quantity: 2 },
  ]);
  
  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };
  
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">购物车 ({cart.length})</h2>
      
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">购物车是空的</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-red-500">¥{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>总计:</span>
              <span className="text-red-500">¥{total}</span>
            </div>
            <button className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
              结算
            </button>
          </div>
        </>
      )}
    </div>
  );
}`,
  },

  // 第5章 路由导航 - 单页应用原理
  {
    id: 'challenge-5-1',
    chapterId: 5,
    title: '多页面导航',
    description: '使用 React Router 创建一个包含多个页面的应用',
    difficulty: 'medium',
    xp: 40,
    starterCode: `// 创建一个包含首页、关于页、联系页的应用
// 使用 React Router 实现页面切换

function App() {
  // 配置路由
  // 首页 /
  // 关于页 /about
  // 联系页 /contact
  
  return (
    <div>
      {/* 导航栏 */}
      {/* 路由配置 */}
    </div>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">🏠 首页</h1>
      <p>欢迎来到首页！</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">ℹ️ 关于</h1>
      <p>这是关于页面</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">📧 联系</h1>
      <p>这是联系页面</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex space-x-4 justify-center">
          <Link to="/" className="hover:text-blue-400">首页</Link>
          <Link to="/about" className="hover:text-blue-400">关于</Link>
          <Link to="/contact" className="hover:text-blue-400">联系</Link>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'challenge-5-2',
    chapterId: 5,
    title: '动态路由',
    description: '创建用户详情页，通过 URL 参数显示不同用户信息',
    difficulty: 'medium',
    xp: 45,
    starterCode: `// 创建用户列表和用户详情页
// 点击用户跳转到详情页 /user/:id

function UserList() {
  const users = [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
    { id: 3, name: '王五' },
  ];
  
  return (
    <div className="p-4">
      {/* 用户列表 */}
    </div>
  );
}

function UserDetail() {
  // 获取 URL 参数 id
  // 显示对应用户信息
  
  return (
    <div className="p-4">
      {/* 用户详情 */}
    </div>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function UserList() {
  const users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 },
  ];
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">用户列表</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id}>
            <Link 
              to={\`/user/\${user.id}\`}
              className="block p-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              {user.name} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UserDetail() {
  const { id } = useParams();
  const users = [
    { id: 1, name: '张三', age: 25, job: '前端工程师' },
    { id: 2, name: '李四', age: 30, job: '产品经理' },
    { id: 3, name: '王五', age: 28, job: '设计师' },
  ];
  
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    return <div className="p-4">用户不存在</div>;
  }
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <Link to="/" className="text-blue-500 mb-4 block">← 返回列表</Link>
      <div className="bg-gray-100 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
        <p className="text-gray-600">年龄: {user.age}</p>
        <p className="text-gray-600">职业: {user.job}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'challenge-5-3',
    chapterId: 5,
    title: '嵌套路由',
    description: '创建带有侧边栏的嵌套路由布局',
    difficulty: 'hard',
    xp: 50,
    starterCode: `// 创建一个带有侧边栏的布局
// 主区域根据路由显示不同内容
// /dashboard -> 仪表盘
// /dashboard/settings -> 设置
// /dashboard/profile -> 个人资料

function DashboardLayout() {
  return (
    <div className="flex">
      {/* 侧边栏 */}
      {/* 主内容区 - Outlet */}
    </div>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">管理后台</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
            📊 仪表盘
          </Link>
          <Link to="/dashboard/settings" className="block p-2 hover:bg-gray-700 rounded">
            ⚙️ 设置
          </Link>
          <Link to="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">
            👤 个人资料
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">用户数</p>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">订单数</p>
          <p className="text-2xl font-bold">567</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">收入</p>
          <p className="text-2xl font-bold">¥89,000</p>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">设置</h1>
      <div className="bg-white p-6 rounded shadow">
        <label className="block mb-4">
          <span className="text-gray-700">网站名称</span>
          <input type="text" className="mt-1 block w-full border rounded p-2" />
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">保存</button>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">个人资料</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
            👤
          </div>
          <div>
            <p className="font-bold">管理员</p>
            <p className="text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'challenge-5-4',
    chapterId: 5,
    title: '404页面',
    description: '创建自定义的 404 页面和路由守卫',
    difficulty: 'medium',
    xp: 35,
    starterCode: `// 创建 404 页面
// 当访问不存在的路由时显示
// 包含返回首页的链接

function NotFound() {
  return (
    <div className="p-4">
      {/* 404 页面内容 */}
    </div>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">首页</h1>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">页面未找到</p>
        <p className="text-gray-500 mb-8">
          您访问的页面不存在或已被移除
        </p>
        <Link 
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4">
        <Link to="/" className="mr-4">首页</Link>
        <Link to="/nonexistent" className="text-red-400">测试404</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },
  {
    id: 'challenge-5-5',
    chapterId: 5,
    title: '面包屑导航',
    description: '创建自动显示当前路径的面包屑导航组件',
    difficulty: 'hard',
    xp: 55,
    starterCode: `// 创建面包屑导航组件
// 根据当前路径自动显示层级
// 如：首页 > 产品 > 电子产品 > 手机

function Breadcrumb() {
  // 获取当前路径
  // 解析路径层级
  // 渲染面包屑
  
  return (
    <nav className="p-4">
      {/* 面包屑内容 */}
    </nav>
  );
}`,
    solution: `import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const pathMap = {
    'products': '产品',
    'electronics': '电子产品',
    'phones': '手机',
    'about': '关于我们',
    'contact': '联系我们',
  };
  
  return (
    <nav className="p-4 bg-gray-100">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">首页</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = \`/\${pathnames.slice(0, index + 1).join('/')}\`;
          const isLast = index === pathnames.length - 1;
          
          return (
            <li key={name} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-600">{pathMap[name] || name}</span>
              ) : (
                <Link to={routeTo} className="text-blue-500 hover:underline">
                  {pathMap[name] || name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Products() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">产品分类</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/products/electronics" className="p-4 bg-blue-100 rounded hover:bg-blue-200">
          电子产品
        </Link>
      </div>
    </div>
  );
}

function Electronics() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">电子产品</h1>
      <Link to="/products/electronics/phones" className="p-4 bg-green-100 rounded hover:bg-green-200 block">
        手机
      </Link>
    </div>
  );
}

function Phones() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">手机产品</h1>
      <div className="grid grid-cols-3 gap-4">
        {['iPhone 15', 'Samsung S24', '小米14'].map(phone => (
          <div key={phone} className="p-4 border rounded">
            <p className="font-bold">{phone}</p>
            <p className="text-gray-500">¥5999</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<div className="p-4"><h1 className="text-2xl font-bold">首页</h1></div>} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/electronics" element={<Electronics />} />
        <Route path="/products/electronics/phones" element={<Phones />} />
      </Routes>
    </BrowserRouter>
  );
}`,
  },

  // 第6章 表单与交互 - 用户输入处理
  {
    id: 'challenge-6-1',
    chapterId: 6,
    title: '注册表单',
    description: '创建一个完整的用户注册表单，包含验证',
    difficulty: 'medium',
    xp: 45,
    starterCode: `function RegisterForm() {
  // 创建注册表单
  // 包含：用户名、邮箱、密码、确认密码
  // 验证：所有字段必填，邮箱格式，密码至少6位，两次密码一致
  
  return (
    <div className="p-4">
      {/* 注册表单 */}
    </div>
  );
}`,
    solution: `function RegisterForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.username) newErrors.username = '用户名不能为空';
    if (!formData.email) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^\\S+@\\S+\\.\\S+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('注册成功:', formData);
    } else {
      setErrors(newErrors);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  
  if (submitted) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-500 mb-4">✓ 注册成功！</h2>
        <p>欢迎加入我们，{formData.username}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">用户注册</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="username"
            placeholder="用户名"
            value={formData.username}
            onChange={handleChange}
            className={\`w-full border p-3 rounded \${errors.username ? 'border-red-500' : ''}\`}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>
        
        <div>
          <input
            name="email"
            type="email"
            placeholder="邮箱"
            value={formData.email}
            onChange={handleChange}
            className={\`w-full border p-3 rounded \${errors.email ? 'border-red-500' : ''}\`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <input
            name="password"
            type="password"
            placeholder="密码"
            value={formData.password}
            onChange={handleChange}
            className={\`w-full border p-3 rounded \${errors.password ? 'border-red-500' : ''}\`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        
        <div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="确认密码"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={\`w-full border p-3 rounded \${errors.confirmPassword ? 'border-red-500' : ''}\`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          注册
        </button>
      </form>
    </div>
  );
}`,
  },
  {
    id: 'challenge-6-2',
    chapterId: 6,
    title: '动态表单字段',
    description: '创建可以动态添加和删除的表单字段',
    difficulty: 'hard',
    xp: 55,
    starterCode: `function DynamicForm() {
  // 创建一个技能表单
  // 可以添加多个技能
  // 每个技能包含名称和熟练度
  // 可以删除已添加的技能
  
  return (
    <div className="p-4">
      {/* 动态表单 */}
    </div>
  );
}`,
    solution: `function DynamicForm() {
  const [skills, setSkills] = React.useState([
    { id: 1, name: 'JavaScript', level: '熟练' }
  ]);
  
  const addSkill = () => {
    setSkills([...skills, { id: Date.now(), name: '', level: '入门' }]);
  };
  
  const removeSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };
  
  const updateSkill = (id, field, value) => {
    setSkills(skills.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交的技能:', skills);
    alert('提交成功！');
  };
  
  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">技能清单</h2>
      
      <form onSubmit={handleSubmit}>
        {skills.map((skill, index) => (
          <div key={skill.id} className="flex gap-2 mb-4 items-start">
            <span className="text-gray-500 mt-3">{index + 1}.</span>
            <input
              placeholder="技能名称"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <select
              value={skill.level}
              onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
              className="border p-2 rounded w-28"
            >
              <option>入门</option>
              <option>熟练</option>
              <option>精通</option>
            </select>
            <button
              type="button"
              onClick={() => removeSkill(skill.id)}
              className="text-red-500 hover:text-red-700 px-2"
            >
              ✕
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addSkill}
          className="w-full border-2 border-dashed border-gray-300 p-3 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 mb-4"
        >
          + 添加技能
        </button>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          提交
        </button>
      </form>
    </div>
  );
}`,
  },
  {
    id: 'challenge-6-3',
    chapterId: 6,
    title: '搜索过滤',
    description: '实现实时搜索和过滤功能',
    difficulty: 'medium',
    xp: 40,
    starterCode: `function SearchFilter() {
  // 创建一个产品列表
  // 支持按名称搜索
  // 支持按分类过滤
  // 支持按价格排序
  
  return (
    <div className="p-4">
      {/* 搜索和过滤控件 */}
      {/* 产品列表 */}
    </div>
  );
}`,
    solution: `function SearchFilter() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('name');
  
  const products = [
    { id: 1, name: 'iPhone 15', category: '手机', price: 5999 },
    { id: 2, name: 'MacBook Pro', category: '电脑', price: 12999 },
    { id: 3, name: 'AirPods', category: '配件', price: 1299 },
    { id: 4, name: 'iPad Air', category: '平板', price: 4799 },
    { id: 5, name: 'Apple Watch', category: '配件', price: 2999 },
    { id: 6, name: 'iPhone 14', category: '手机', price: 4999 },
  ];
  
  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'all' || p.category === category;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">产品列表</h2>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索产品..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-3 rounded"
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-3 rounded"
        >
          <option value="all">所有分类</option>
          <option value="手机">手机</option>
          <option value="电脑">电脑</option>
          <option value="平板">平板</option>
          <option value="配件">配件</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-3 rounded"
        >
          <option value="name">按名称</option>
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.category}</p>
            <p className="text-red-500 font-bold mt-2">¥{product.price}</p>
          </div>
        ))}
      </div>
      
      <p className="text-center text-gray-500 mt-4">
        共 {filteredProducts.length} 个产品
      </p>
    </div>
  );
}`,
  },
  {
    id: 'challenge-6-4',
    chapterId: 6,
    title: '文件上传预览',
    description: '创建图片上传组件，支持预览和删除',
    difficulty: 'hard',
    xp: 50,
    starterCode: `function ImageUploader() {
  // 创建图片上传组件
  // 选择图片后显示预览
  // 可以删除已选择的图片
  // 限制文件类型和大小
  
  return (
    <div className="p-4">
      {/* 上传区域 */}
      {/* 预览区域 */}
    </div>
  );
}`,
    solution: `function ImageUploader() {
  const [images, setImages] = React.useState([]);
  const [error, setError] = React.useState('');
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError('');
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('图片大小不能超过5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">图片上传</h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-input"
        />
        <label htmlFor="image-input" className="cursor-pointer">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600">点击或拖拽上传图片</p>
          <p className="text-gray-400 text-sm mt-1">支持 JPG、PNG，最大 5MB</p>
        </label>
      </div>
      
      {error && (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      )}
      
      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-4">已选择 {images.length} 张图片</h3>
          <div className="grid grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,
  },
  {
    id: 'challenge-6-5',
    chapterId: 6,
    title: '分步表单',
    description: '创建多步骤表单向导',
    difficulty: 'hard',
    xp: 60,
    starterCode: `function StepForm() {
  // 创建3步表单向导
  // 第1步：基本信息（姓名、邮箱）
  // 第2步：详细信息（地址、电话）
  // 第3步：确认和提交
  
  return (
    <div className="p-4">
      {/* 步骤指示器 */}
      {/* 表单内容 */}
      {/* 导航按钮 */}
    </div>
  );
}`,
    solution: `function StepForm() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [completed, setCompleted] = React.useState(false);
  
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const handleSubmit = () => {
    setCompleted(true);
    console.log('提交数据:', formData);
  };
  
  if (completed) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-500 mb-4">提交成功！</h2>
        <p className="text-gray-600">感谢您的填写</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">用户注册</h2>
      
      {/* 步骤指示器 */}
      <div className="flex mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${
              s === step ? 'bg-blue-500 text-white' : 
              s < step ? 'bg-green-500 text-white' : 'bg-gray-200'
            }\`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={\`flex-1 h-1 mx-2 \${
                s < step ? 'bg-green-500' : 'bg-gray-200'
              }\`} />
            )}
          </div>
        ))}
      </div>
      
      {/* 表单内容 */}
      <div className="mb-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">基本信息</h3>
            <input
              placeholder="姓名"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full border p-3 rounded"
            />
            <input
              placeholder="邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">详细信息</h3>
            <input
              placeholder="地址"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full border p-3 rounded"
            />
            <input
              placeholder="电话"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full border p-3 rounded"
            />
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">确认信息</h3>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p><strong>姓名:</strong> {formData.name}</p>
              <p><strong>邮箱:</strong> {formData.email}</p>
              <p><strong>地址:</strong> {formData.address}</p>
              <p><strong>电话:</strong> {formData.phone}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 导航按钮 */}
      <div className="flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            上一步
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto"
          >
            下一步
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto"
          >
            提交
          </button>
        )}
      </div>
    </div>
  );
}`,
  },

  // 第7章 学会调用API - 工具宝箱
  {
    id: 'challenge-7-1',
    chapterId: 7,
    title: '用户列表',
    description: '从 API 获取用户数据并显示',
    difficulty: 'medium',
    xp: 45,
    starterCode: `function UserListAPI() {
  // 使用 fetch 从 https://jsonplaceholder.typicode.com/users 获取用户数据
  // 显示加载状态
  // 显示用户列表
  
  return (
    <div className="p-4">
      {/* 加载状态 */}
      {/* 用户列表 */}
    </div>
  );
}`,
    solution: `function UserListAPI() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  React.useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p>加载中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>加载失败: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">用户列表</h2>
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="bg-gray-50 p-4 rounded-lg flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {user.name[0]}
            </div>
            <div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-7-2',
    chapterId: 7,
    title: '搜索用户',
    description: '实现用户搜索功能，支持实时搜索',
    difficulty: 'medium',
    xp: 50,
    starterCode: `function SearchUsers() {
  // 从 API 获取用户
  // 实现搜索功能
  // 支持加载更多
  
  return (
    <div className="p-4">
      {/* 搜索框 */}
      {/* 用户列表 */}
    </div>
  );
}`,
    solution: `function SearchUsers() {
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">搜索用户</h2>
      
      <input
        type="text"
        placeholder="搜索用户..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg mb-6"
      />
      
      {loading ? (
        <p className="text-center">加载中...</p>
      ) : (
        <>
          <p className="text-gray-500 mb-4">找到 {filteredUsers.length} 个用户</p>
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-400 text-sm">{user.company.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}`,
  },
  {
    id: 'challenge-7-3',
    chapterId: 7,
    title: '帖子列表和详情',
    description: '显示帖子列表，点击查看详情和评论',
    difficulty: 'hard',
    xp: 60,
    starterCode: `function PostsWithDetails() {
  // 获取帖子列表
  // 点击帖子显示详情
  // 显示帖子的评论
  
  return (
    <div className="p-4">
      {/* 帖子列表或详情 */}
    </div>
  );
}`,
    solution: `function PostsWithDetails() {
  const [posts, setPosts] = React.useState([]);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);
  
  const showPostDetails = (post) => {
    setSelectedPost(post);
    fetch(\`https://jsonplaceholder.typicode.com/posts/\${post.id}/comments\`)
      .then(res => res.json())
      .then(data => setComments(data));
  };
  
  if (loading) return <p className="p-4">加载中...</p>;
  
  if (selectedPost) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button 
          onClick={() => setSelectedPost(null)}
          className="text-blue-500 mb-4"
        >
          ← 返回列表
        </button>
        
        <article className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
          <p className="text-gray-700">{selectedPost.body}</p>
        </article>
        
        <h3 className="font-bold mb-4">评论 ({comments.length})</h3>
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white border p-4 rounded">
              <p className="font-bold text-sm">{comment.name}</p>
              <p className="text-gray-500 text-sm">{comment.email}</p>
              <p className="mt-2">{comment.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">帖子列表</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => showPostDetails(post)}
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <h3 className="font-bold mb-2">{post.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{post.body}</p>
            <p className="text-blue-500 text-sm mt-2">查看详情 →</p>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: 'challenge-7-4',
    chapterId: 7,
    title: '随机图片展示',
    description: '从随机图片 API 获取并展示图片',
    difficulty: 'easy',
    xp: 35,
    starterCode: `function RandomDog() {
  // 从 https://dog.ceo/api/breeds/image/random 获取随机狗狗图片
  // 显示图片
  // 提供刷新按钮
  
  return (
    <div className="p-4">
      {/* 图片展示 */}
      {/* 刷新按钮 */}
    </div>
  );
}`,
    solution: `function RandomDog() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  
  const fetchDog = () => {
    setLoading(true);
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(data => {
        setImageUrl(data.message);
        setLoading(false);
      });
  };
  
  React.useEffect(() => {
    fetchDog();
  }, []);
  
  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-6">🐕 随机狗狗</h2>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p>加载中...</p>
        </div>
      ) : (
        <img 
          src={imageUrl} 
          alt="Random dog"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}
      
      <button
        onClick={fetchDog}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '加载中...' : '换一张'}
      </button>
    </div>
  );
}`,
  },
  {
    id: 'challenge-7-5',
    chapterId: 7,
    title: '天气查询',
    description: '创建天气查询应用（模拟数据）',
    difficulty: 'hard',
    xp: 65,
    starterCode: `function WeatherApp() {
  // 创建天气查询应用
  // 输入城市名称
  // 显示模拟的天气数据
  // 包含温度、天气状况、湿度等
  
  return (
    <div className="p-4">
      {/* 搜索框 */}
      {/* 天气信息展示 */}
    </div>
  );
}`,
    solution: `function WeatherApp() {
  const [city, setCity] = React.useState('');
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  
  const mockWeatherData = {
    '北京': { temp: 22, condition: '晴天', humidity: 45, wind: '3级' },
    '上海': { temp: 25, condition: '多云', humidity: 60, wind: '2级' },
    '广州': { temp: 30, condition: '雨天', humidity: 80, wind: '4级' },
    '深圳': { temp: 29, condition: '阴天', humidity: 75, wind: '3级' },
  };
  
  const searchWeather = () => {
    if (!city) return;
    setLoading(true);
    
    // 模拟 API 延迟
    setTimeout(() => {
      const data = mockWeatherData[city] || {
        temp: Math.floor(Math.random() * 20 + 15),
        condition: ['晴天', '多云', '阴天'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 40 + 40),
        wind: Math.floor(Math.random() * 5 + 1) + '级'
      };
      setWeather(data);
      setLoading(false);
    }, 500);
  };
  
  const getWeatherIcon = (condition) => {
    const icons = {
      '晴天': '☀️',
      '多云': '⛅',
      '阴天': '☁️',
      '雨天': '🌧️'
    };
    return icons[condition] || '🌤️';
  };
  
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🌤️ 天气查询</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="输入城市名称（如：北京）"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
          className="flex-1 border p-3 rounded-lg"
        />
        <button
          onClick={searchWeather}
          disabled={loading}
          className="bg-blue-500 text-white px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '...' : '查询'}
        </button>
      </div>
      
      {weather && (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">{getWeatherIcon(weather.condition)}</div>
            <h3 className="text-3xl font-bold mb-2">{city}</h3>
            <p className="text-5xl font-bold mb-4">{weather.temp}°C</p>
            <p className="text-xl mb-4">{weather.condition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/30">
            <div className="text-center">
              <p className="text-white/70">湿度</p>
              <p className="text-xl font-bold">{weather.humidity}%</p>
            </div>
            <div className="text-center">
              <p className="text-white/70">风力</p>
              <p className="text-xl font-bold">{weather.wind}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
  },

  // 第8章 后端世界 - Node.js与Express
  {
    id: 'challenge-8-1',
    chapterId: 8,
    type: 'backend',
    title: 'Express Hello World',
    description: '创建第一个 Express 服务器',
    difficulty: 'easy',
    xp: 30,
    starterCode: `// server.js
// 创建一个 Express 服务器
// 监听端口 3000
// 访问根路径时返回 "Hello World"

const express = require('express');

// 你的代码`,
    solution: `// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});`,
  },
  {
    id: 'challenge-8-2',
    chapterId: 8,
    type: 'backend',
    title: 'REST API 基础',
    description: '创建一个完整的 REST API',
    difficulty: 'medium',
    xp: 50,
    starterCode: `// 创建一个用户管理 API
// GET /api/users - 获取所有用户
// GET /api/users/:id - 获取单个用户
// POST /api/users - 创建用户
// PUT /api/users/:id - 更新用户
// DELETE /api/users/:id - 删除用户

const express = require('express');
const app = express();

app.use(express.json());

// 模拟数据
let users = [
  { id: 1, name: '张三', email: 'zhang@example.com' },
  { id: 2, name: '李四', email: 'li@example.com' },
];

// 你的代码`,
    solution: `const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let users = [
  { id: 1, name: '张三', email: 'zhang@example.com' },
  { id: 2, name: '李四', email: 'li@example.com' },
];

// 获取所有用户
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json(user);
});

// 创建用户
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 更新用户
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  res.json(user);
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});`,
  },
  {
    id: 'challenge-8-3',
    chapterId: 8,
    type: 'backend',
    title: '中间件使用',
    description: '创建和使用 Express 中间件',
    difficulty: 'medium',
    xp: 45,
    starterCode: `// 创建以下中间件：
// 1. 日志中间件 - 记录每个请求的方法和路径
// 2. 认证中间件 - 检查请求头中的 token
// 3. 错误处理中间件

const express = require('express');
const app = express();

// 你的代码`,
    solution: `const express = require('express');
const app = express();
const PORT = 3000;

// 日志中间件
const logger = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.path}\`);
  next();
};

// 认证中间件
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  if (token !== 'Bearer secret-token') {
    return res.status(403).json({ error: '无效的令牌' });
  }
  next();
};

// 使用中间件
app.use(express.json());
app.use(logger);

// 公开路由
app.get('/', (req, res) => {
  res.json({ message: '公开接口' });
});

// 受保护路由
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: '受保护的数据' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});`,
  },
  {
    id: 'challenge-8-4',
    chapterId: 8,
    type: 'backend',
    title: '文件上传',
    description: '实现文件上传功能',
    difficulty: 'hard',
    xp: 60,
    starterCode: `// 使用 multer 实现文件上传
// 支持图片上传
// 限制文件大小
// 返回文件访问 URL

const express = require('express');
const multer = require('multer');
const app = express();

// 你的代码`,
    solution: `const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// 单文件上传
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }
  
  res.json({
    message: '上传成功',
    filename: req.file.filename,
    url: \`/uploads/\${req.file.filename}\`
  });
});

// 多文件上传
app.post('/api/upload-multiple', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: '没有上传文件' });
  }
  
  const files = req.files.map(file => ({
    filename: file.filename,
    url: \`/uploads/\${file.filename}\`
  }));
  
  res.json({
    message: '上传成功',
    files: files
  });
});

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 错误处理
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制' });
    }
  }
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});`,
  },
  {
    id: 'challenge-8-5',
    chapterId: 8,
    type: 'backend',
    title: 'JWT 认证',
    description: '实现基于 JWT 的用户认证',
    difficulty: 'hard',
    xp: 70,
    starterCode: `// 实现 JWT 认证
// 1. 用户登录，返回 JWT token
// 2. 受保护的路由需要验证 token
// 3. 刷新 token 机制

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = 'your-secret-key';

// 你的代码`,
    solution: `const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

const SECRET_KEY = 'your-secret-key';
const REFRESH_SECRET = 'your-refresh-secret';

app.use(express.json());

// 模拟用户数据库
const users = [
  { id: 1, username: 'admin', password: '123456' },
  { id: 2, username: 'user', password: '123456' }
];

// 刷新令牌存储（实际应该使用 Redis）
let refreshTokens = [];

// 生成访问令牌
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '15m' }
  );
};

// 生成刷新令牌
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供访问令牌' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    req.user = user;
    next();
  });
};

// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  refreshTokens.push(refreshToken);
  
  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username }
  });
});

// 刷新令牌
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: '无效的刷新令牌' });
  }
  
  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '刷新令牌已过期' });
    }
    
    const accessToken = generateAccessToken({ id: user.id });
    res.json({ accessToken });
  });
});

// 登出
app.post('/api/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.json({ message: '登出成功' });
});

// 受保护路由
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    message: '受保护的数据',
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});`,
  },

  // 第9章 部署上线 - 让世界看到你的作品
  {
    id: 'challenge-9-1',
    chapterId: 9,
    type: 'backend',
    title: '环境变量配置',
    description: '学习使用环境变量管理配置',
    difficulty: 'easy',
    xp: 25,
    starterCode: `// 创建一个使用环境变量的应用
// 读取 PORT、NODE_ENV、API_URL 等环境变量
// 提供默认值

require('dotenv').config();

const express = require('express');
const app = express();

// 你的代码`,
    solution: `require('dotenv').config();

const express = require('express');
const app = express();

// 从环境变量读取配置，提供默认值
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_URL = process.env.API_URL || 'http://localhost:3000';
const DB_HOST = process.env.DB_HOST || 'localhost';

app.get('/', (req, res) => {
  res.json({
    message: '服务器运行中',
    environment: NODE_ENV,
    apiUrl: API_URL,
    dbHost: DB_HOST,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: NODE_ENV
  });
});

app.listen(PORT, () => {
  console.log(\`服务器运行在 \${NODE_ENV} 模式\`);
  console.log(\`监听端口: \${PORT}\`);
  console.log(\`API地址: \${API_URL}\`);
});`,
  },
  {
    id: 'challenge-9-2',
    chapterId: 9,
    type: 'docker',
    title: 'Docker 容器化',
    description: '为应用创建 Dockerfile',
    difficulty: 'medium',
    xp: 50,
    starterCode: `# 创建一个 Dockerfile
# 使用 Node.js 官方镜像
# 设置工作目录
# 复制 package.json 并安装依赖
# 复制应用代码
# 暴露端口并启动应用

# 你的 Dockerfile`,
    solution: `# Dockerfile
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# 启动应用
CMD ["node", "server.js"]`,
  },
  {
    id: 'challenge-9-3',
    chapterId: 9,
    type: 'docker',
    title: 'GitHub Actions',
    description: '创建 CI/CD 工作流',
    difficulty: 'hard',
    xp: 60,
    starterCode: `# 创建 GitHub Actions 工作流
# 触发条件：推送到 main 分支
# 任务：
# 1. 检出代码
# 2. 设置 Node.js
# 3. 安装依赖
# 4. 运行测试
# 5. 构建应用
# 6. 部署到服务器

# .github/workflows/deploy.yml`,
    solution: `# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'`,
  },
  {
    id: 'challenge-9-4',
    chapterId: 9,
    type: 'docker',
    title: 'Nginx 配置',
    description: '配置 Nginx 作为反向代理',
    difficulty: 'hard',
    xp: 55,
    starterCode: `# 创建 Nginx 配置文件
# 实现以下功能：
# 1. 反向代理到 Node.js 应用
# 2. 静态文件服务
# 3. Gzip 压缩
# 4. 安全头设置

# nginx.conf`,
    solution: `# nginx.conf
server {
    listen 80;
    server_name example.com;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 静态文件
    location /static/ {
        alias /var/www/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 反向代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 错误页面
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/errors;
    }
}`,
  },
  {
    id: 'challenge-9-5',
    chapterId: 9,
    type: 'backend',
    title: '监控和日志',
    description: '实现应用监控和日志记录',
    difficulty: 'hard',
    xp: 65,
    starterCode: `// 创建一个带有监控和日志的应用
// 1. 使用 winston 记录日志
// 2. 实现请求日志中间件
// 3. 添加性能监控
// 4. 健康检查端点

const express = require('express');
const winston = require('winston');

// 你的代码`,
    solution: `const express = require('express');
const winston = require('winston');
const app = express();
const PORT = process.env.PORT || 3000;

// 配置 winston 日志
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// 请求日志中间件
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: \`\${duration}ms\`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
};

app.use(requestLogger);
app.use(express.json());

// 性能监控中间件
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = diff[0] * 1000 + diff[1] / 1e6;
    
    if (duration > 1000) {
      logger.warn(\`慢请求: \${req.method} \${req.path} 耗时 \${duration.toFixed(2)}ms\`);
    }
  });
  
  next();
};

app.use(performanceMonitor);

// 健康检查
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  
  res.json(health);
});

// 指标端点
app.get('/metrics', (req, res) => {
  res.json({
    requests_total: 1000,
    request_duration_seconds: 0.1,
    active_connections: 5
  });
});

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

// 错误处理
app.use((err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  logger.info(\`服务器启动，监听端口 \${PORT}\`);
});`,
  },
];

export default LearningContext;
