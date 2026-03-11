import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Trophy, ArrowRight, Code, Lightbulb, CheckCircle, FolderTree, Terminal } from 'lucide-react';

const lessonContent = {
  '1-1': {
    title: '什么是前后端分离？',
    sections: [
      {
        type: 'intro',
        content: '在现代网站开发中，前后端分离是一种主流架构模式。简单来说，前端负责"用户看到和操作的界面"，后端负责"数据处理和业务逻辑"。两者通过 API 进行通信，就像餐厅的前台和后厨分工合作一样。',
      },
      {
        type: 'visual',
        title: '前后端分离架构',
        diagram: 'frontend-backend',
      },
      {
        type: 'code',
        title: '前端 vs 后端代码示例',
        code: `// 前端代码（React）- 负责展示
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')  // 调用后端 API
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// 后端代码（Node.js）- 负责数据
app.get('/api/users', async (req, res) => {
  const users = await database.query('SELECT * FROM users');
  res.json(users);
});`,
        explanation: '前端关注"怎么展示"，后端关注"数据是什么"',
      },
      {
        type: 'keyPoints',
        title: '核心概念',
        points: [
          { icon: '🎨', text: '前端：HTML/CSS/JavaScript，负责用户界面' },
          { icon: '⚙️', text: '后端：Node.js/Python/Java，负责业务逻辑' },
          { icon: '🔌', text: 'API：前后端通信的桥梁' },
          { icon: '📦', text: '数据库：存储和管理数据' },
        ],
      },
    ],
  },
  '1-2': {
    title: '安装 Node.js 和 VS Code',
    sections: [
      {
        type: 'intro',
        content: 'Node.js 是 JavaScript 的运行环境，让我们可以在电脑上运行 JavaScript 代码。VS Code 是最受欢迎的代码编辑器，由微软开发，免费且功能强大。',
      },
      {
        type: 'steps',
        title: '安装步骤',
        steps: [
          {
            title: '下载 Node.js',
            description: '访问 nodejs.org，下载 LTS（长期支持）版本',
            icon: '📥',
          },
          {
            title: '安装 Node.js',
            description: '双击安装包，一路"下一步"即可完成安装',
            icon: '⚙️',
          },
          {
            title: '验证安装',
            description: '打开命令行，输入 node -v 查看版本号',
            icon: '✅',
          },
          {
            title: '安装 VS Code',
            description: '访问 code.visualstudio.com，下载并安装',
            icon: '💻',
          },
        ],
      },
      {
        type: 'code',
        title: '验证安装成功',
        code: `# 在命令行中运行以下命令
node -v
# 输出: v20.10.0 (版本号可能不同)

npm -v
# 输出: 10.2.3 (npm 是 Node.js 的包管理器)

# 创建第一个 JavaScript 文件
echo "console.log('Hello World!');" > hello.js
node hello.js
# 输出: Hello World!`,
        explanation: 'npm 是 Node.js 自带的包管理器，用于安装第三方库',
      },
      {
        type: 'keyPoints',
        title: '重要提示',
        points: [
          { icon: '📌', text: '选择 LTS 版本，更稳定可靠' },
          { icon: '🔄', text: '安装时会自动配置环境变量' },
          { icon: '📦', text: 'npm 随 Node.js 一起安装' },
          { icon: '💡', text: '建议安装 VS Code 的中文语言包' },
        ],
      },
    ],
  },
  '1-3': {
    title: '认识命令行工具',
    sections: [
      {
        type: 'intro',
        content: '命令行（终端）是开发者的重要工具。虽然现在有图形界面，但很多开发任务用命令行更高效。别担心，常用的命令就那么几个！',
      },
      {
        type: 'code',
        title: '常用命令速查',
        code: `# Windows PowerShell 常用命令

# 查看当前目录
pwd

# 列出当前目录的文件
ls
dir        # Windows 也可以用 dir

# 进入某个目录
cd Desktop
cd ..      # 返回上一级目录

# 创建新目录
mkdir my-project

# 创建空文件
New-Item index.html

# 删除文件
Remove-Item index.html

# 清屏
clear

# 查看文件内容
cat package.json`,
        explanation: '命令行操作比鼠标点击更快，熟练后效率大大提升',
      },
      {
        type: 'visual',
        title: '命令行界面介绍',
        diagram: 'terminal-intro',
      },
      {
        type: 'keyPoints',
        title: '快捷键',
        points: [
          { icon: '⬆️', text: '上箭头：显示上一条命令' },
          { icon: '⌨️', text: 'Tab：自动补全文件名' },
          { icon: '🛑', text: 'Ctrl+C：终止当前命令' },
          { icon: '📋', text: 'Ctrl+L：清屏' },
        ],
      },
    ],
  },
  '1-4': {
    title: '运行你的第一个项目',
    sections: [
      {
        type: 'intro',
        content: '现在让我们创建并运行第一个 Web 项目！我们将使用 Vite 这个现代构建工具，它比传统的 create-react-app 更快更简单。',
      },
      {
        type: 'code',
        title: '创建项目',
        code: `# 1. 创建项目目录并进入
mkdir my-first-app
cd my-first-app

# 2. 使用 Vite 创建 React 项目
npm create vite@latest . -- --template react

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev

# 浏览器会自动打开 http://localhost:5173
# 你会看到 Vite + React 的欢迎页面！`,
        explanation: 'Vite 会自动创建项目结构，并启动一个本地开发服务器',
      },
      {
        type: 'visual',
        title: '项目结构',
        diagram: 'project-structure',
      },
      {
        type: 'keyPoints',
        title: '项目文件说明',
        points: [
          { icon: '📄', text: 'index.html：入口 HTML 文件' },
          { icon: '⚛️', text: 'src/main.jsx：React 应用入口' },
          { icon: '🎨', text: 'src/App.jsx：主组件' },
          { icon: '📦', text: 'package.json：项目配置和依赖' },
        ],
      },
      {
        type: 'challenge',
        title: '动手试试',
        description: '修改 App.jsx 中的文字，看看页面会发生什么变化',
        requirements: [
          '打开 src/App.jsx 文件',
          '修改 h1 标签中的文字',
          '保存文件，观察浏览器自动刷新',
        ],
        hints: [
          'Vite 支持热更新，保存后自动刷新',
          '试试添加一些新的 HTML 元素',
        ],
      },
    ],
  },
  '2-1': {
    title: 'VS Code 深度使用指南',
    sections: [
      {
        type: 'intro',
        content: 'VS Code 是前端开发的神器！掌握它的快捷键和扩展，能让你的开发效率提升10倍。让我们来探索它的强大功能。',
      },
      {
        type: 'keyPoints',
        title: '必装扩展推荐',
        points: [
          { icon: '🎨', text: 'ES7+ React/Redux/React-Native snippets - React代码片段' },
          { icon: '🔍', text: 'ESLint - 代码规范检查' },
          { icon: '💅', text: 'Prettier - 代码格式化' },
          { icon: '📁', text: 'Auto Rename Tag - 自动重命名配对标签' },
        ],
      },
      {
        type: 'code',
        title: '常用快捷键',
        code: `# VS Code 必备快捷键

# 代码编辑
Ctrl + D          # 选中下一个相同的词
Ctrl + Shift + K  # 删除整行
Alt + ↑/↓         # 移动整行
Shift + Alt + ↑/↓ # 复制整行

# 文件操作
Ctrl + P          # 快速打开文件
Ctrl + Shift + P  # 命令面板
Ctrl + B          # 切换侧边栏

# 代码导航
Ctrl + Click      # 跳转到定义
F12               # 转到定义
Shift + F12       # 查找所有引用

# 多光标
Alt + Click       # 添加多个光标
Ctrl + Alt + ↑/↓  # 上下添加光标`,
        explanation: '熟练使用快捷键是高效开发的第一步',
      },
    ],
  },
  '2-2': {
    title: '浏览器开发者工具',
    sections: [
      {
        type: 'intro',
        content: '浏览器开发者工具（DevTools）是前端开发的必备工具。按 F12 或右键"检查"即可打开，它能帮你查看元素、调试代码、分析网络请求。',
      },
      {
        type: 'steps',
        title: 'DevTools 核心功能',
        steps: [
          { icon: '🔍', title: 'Elements（元素）', description: '查看和修改 HTML/CSS，实时预览效果' },
          { icon: '📱', title: 'Console（控制台）', description: '运行 JavaScript 代码，查看日志输出' },
          { icon: '🌐', title: 'Network（网络）', description: '查看所有网络请求，分析加载性能' },
          { icon: '⚡', title: 'Application（应用）', description: '管理本地存储、Cookie、缓存' },
        ],
      },
      {
        type: 'code',
        title: 'Console 常用技巧',
        code: `// 在控制台中运行这些命令

// 1. 选择页面元素
document.querySelector('h1')        // 选择第一个 h1
document.querySelectorAll('div')    // 选择所有 div

// 2. 输出调试信息
console.log('普通日志')
console.warn('警告信息')
console.error('错误信息')
console.table([{name: '张三', age: 25}])  // 表格形式显示

// 3. 计时
console.time('test')
// ... 一些操作
console.timeEnd('test')  // 输出耗时

// 4. 清屏
console.clear()`,
        explanation: 'Console 是调试代码的最佳工具',
      },
    ],
  },
  '2-3': {
    title: 'Git 版本控制入门',
    sections: [
      {
        type: 'intro',
        content: 'Git 是程序员的时间机器！它能帮你保存代码的每一个版本，随时可以回到过去。团队协作时更是必不可少。',
      },
      {
        type: 'visual',
        title: 'Git 工作流程',
        diagram: 'git-flow',
      },
      {
        type: 'code',
        title: 'Git 基本命令',
        code: `# 初始化仓库
git init

# 查看状态
git status

# 添加文件到暂存区
git add .              # 添加所有文件
git add index.html     # 添加单个文件

# 提交更改
git commit -m "提交说明"

# 查看历史
git log
git log --oneline      # 简洁模式

# 连接远程仓库
git remote add origin https://github.com/用户名/仓库名.git

# 推送到远程
git push -u origin main

# 从远程拉取
git pull origin main`,
        explanation: 'Git 的核心概念：工作区 → 暂存区 → 仓库',
      },
      {
        type: 'keyPoints',
        title: 'Git 核心概念',
        points: [
          { icon: '📝', text: '工作区：你正在编辑的文件' },
          { icon: '📦', text: '暂存区：准备提交的更改' },
          { icon: '🗄️', text: '仓库：保存的所有版本' },
          { icon: '🌐', text: '远程仓库：GitHub/GitLab 上的备份' },
        ],
      },
    ],
  },
  '2-4': {
    title: 'npm 包管理器详解',
    sections: [
      {
        type: 'intro',
        content: 'npm（Node Package Manager）是 JavaScript 的包管理器。它让你可以轻松安装、更新、删除第三方库，就像手机应用商店一样。',
      },
      {
        type: 'code',
        title: 'npm 常用命令',
        code: `# 初始化项目（创建 package.json）
npm init
npm init -y           # 使用默认配置

# 安装依赖
npm install           # 安装 package.json 中的所有依赖
npm install react     # 安装 react
npm install -D vite   # 安装为开发依赖
npm install -g nodemon # 全局安装

# 运行脚本
npm run dev           # 运行开发服务器
npm run build         # 构建生产版本

# 更新和删除
npm update            # 更新所有依赖
npm uninstall react   # 删除依赖

# 查看信息
npm list              # 查看已安装的包
npm outdated          # 查看过时的包`,
        explanation: 'package.json 记录了项目的所有依赖和配置',
      },
      {
        type: 'keyPoints',
        title: 'package.json 关键字段',
        points: [
          { icon: '📛', text: 'name：项目名称' },
          { icon: '🔢', text: 'version：版本号' },
          { icon: '📜', text: 'scripts：可执行的脚本命令' },
          { icon: '📦', text: 'dependencies：生产环境依赖' },
        ],
      },
    ],
  },
  '3-1': {
    title: 'HTML 标签语义化',
    sections: [
      {
        type: 'intro',
        content: 'HTML 是网页的骨架。语义化标签不仅让代码更易读，还能帮助搜索引擎理解页面结构，提升 SEO。',
      },
      {
        type: 'code',
        title: '语义化标签示例',
        code: `<!-- 页面结构 -->
<header>
  <nav>
    <a href="/">首页</a>
    <a href="/about">关于</a>
  </nav>
</header>

<main>
  <article>
    <h1>文章标题</h1>
    <time datetime="2024-01-15">2024年1月15日</time>
    <p>文章内容...</p>
    
    <section>
      <h2>章节标题</h2>
      <p>章节内容...</p>
    </section>
  </article>
  
  <aside>
    <h3>相关推荐</h3>
    <!-- 侧边栏内容 -->
  </aside>
</main>

<footer>
  <p>&copy; 2024 我的网站</p>
</footer>`,
        explanation: '使用正确的标签让页面结构清晰明了',
      },
      {
        type: 'keyPoints',
        title: '常用语义标签',
        points: [
          { icon: '🏠', text: 'header/footer：页头/页脚' },
          { icon: '🧭', text: 'nav：导航栏' },
          { icon: '📄', text: 'article：独立文章' },
          { icon: '📑', text: 'section：章节区块' },
        ],
      },
    ],
  },
  '3-2': {
    title: 'CSS 选择器与盒模型',
    sections: [
      {
        type: 'intro',
        content: 'CSS 让网页变得美观。选择器决定"给谁化妆"，盒模型决定"身材大小"。掌握这两点，你就能控制页面上的一切。',
      },
      {
        type: 'code',
        title: 'CSS 选择器大全',
        code: `/* 基础选择器 */
p { }                  /* 标签选择器 */
.title { }             /* 类选择器 */
#header { }            /* ID选择器 */

/* 组合选择器 */
div p { }              /* 后代选择器（所有后代） */
div > p { }            /* 子选择器（直接子元素） */
h1 + p { }             /* 相邻兄弟选择器 */

/* 属性选择器 */
[type="text"] { }      /* 精确匹配 */
[class^="btn"] { }     /* 开头匹配 */
[class$="active"] { }  /* 结尾匹配 */

/* 伪类选择器 */
a:hover { }            /* 鼠标悬停 */
li:first-child { }     /* 第一个子元素 */
li:nth-child(2n) { }   /* 偶数项 */

/* 伪元素 */
p::before { content: "→"; }
p::first-letter { font-size: 2em; }`,
        explanation: '选择器越具体，优先级越高',
      },
      {
        type: 'visual',
        title: 'CSS 盒模型',
        diagram: 'box-model',
      },
    ],
  },
  '3-3': {
    title: 'Flexbox 布局实战',
    sections: [
      {
        type: 'intro',
        content: 'Flexbox 是现代 CSS 布局的利器。它让元素在容器中灵活排列，轻松实现水平居中、等分布局等效果。',
      },
      {
        type: 'code',
        title: 'Flexbox 常用属性',
        code: `/* 容器属性 */
.container {
  display: flex;              /* 启用 flex 布局 */
  
  /* 主轴方向 */
  flex-direction: row;        /* 水平（默认） */
  flex-direction: column;     /* 垂直 */
  
  /* 主轴对齐 */
  justify-content: center;    /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 环绕分布 */
  
  /* 交叉轴对齐 */
  align-items: center;        /* 垂直居中 */
  align-items: stretch;       /* 拉伸填满 */
  
  /* 换行 */
  flex-wrap: wrap;            /* 允许换行 */
}

/* 子项属性 */
.item {
  flex: 1;                    /* 等分剩余空间 */
  flex: 0 0 200px;           /* 不放大不缩小，固定200px */
  align-self: flex-end;       /* 单独设置对齐 */
}`,
        explanation: '记住：主轴用 justify-content，交叉轴用 align-items',
      },
      {
        type: 'keyPoints',
        title: 'Flexbox 布局技巧',
        points: [
          { icon: '🎯', text: '水平垂直居中：flex + justify-center + align-center' },
          { icon: '📊', text: '等分布局：每个子项 flex: 1' },
          { icon: '📱', text: '响应式换行：flex-wrap: wrap' },
          { icon: '↔️', text: '一侧固定一侧自适应：固定侧设置宽度，自适应侧 flex: 1' },
        ],
      },
    ],
  },
  '3-4': {
    title: 'Tailwind CSS 快速上手',
    sections: [
      {
        type: 'intro',
        content: 'Tailwind CSS 是一个"原子化"CSS 框架。它提供大量预定义的类名，让你直接在 HTML 中写样式，无需写 CSS 文件！',
      },
      {
        type: 'code',
        title: 'Tailwind 常用类名',
        code: `<!-- 布局 -->
<div class="flex justify-center items-center">
  <!-- 水平垂直居中 -->
</div>

<!-- 间距 -->
<div class="p-4 m-2">        <!-- padding: 1rem, margin: 0.5rem -->
<div class="px-6 py-3">      <!-- 水平padding, 垂直padding -->
<div class="mt-8 mb-4">      <!-- 上边距, 下边距 -->

<!-- 文字 -->
<h1 class="text-2xl font-bold text-center">
  大标题
</h1>
<p class="text-gray-500 text-sm">
  灰色小字
</p>

<!-- 颜色 -->
<button class="bg-blue-500 hover:bg-blue-600 text-white">
  按钮
</button>

<!-- 响应式 -->
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 手机全宽，平板半宽，桌面1/3宽 -->
</div>`,
        explanation: 'Tailwind 的类名都是语义化的，一看就懂',
      },
      {
        type: 'keyPoints',
        title: 'Tailwind 核心概念',
        points: [
          { icon: '📱', text: '响应式前缀：sm/md/lg/xl/2xl' },
          { icon: '🎨', text: '颜色系统：颜色-深度（如 blue-500）' },
          { icon: '📏', text: '间距单位：4px 的倍数（p-4 = 16px）' },
          { icon: '✨', text: '状态变体：hover/focus/active' },
        ],
      },
    ],
  },
  '4-1': {
    title: '什么是 React？',
    sections: [
      {
        type: 'intro',
        content: 'React 是由 Facebook 开发的 JavaScript 库，用于构建用户界面。它的核心思想是"组件化"——把页面拆分成独立、可复用的小部件。',
      },
      {
        type: 'visual',
        title: 'React 组件化思维',
        diagram: 'react-components',
      },
      {
        type: 'code',
        title: 'React 组件示例',
        code: `// 一个简单的 React 组件
function WelcomeCard({ name }) {
  return (
    <div className="card">
      <h2>欢迎，{name}！</h2>
      <p>开始你的 React 学习之旅吧</p>
    </div>
  );
}

// 使用组件
function App() {
  return (
    <div>
      <WelcomeCard name="张三" />
      <WelcomeCard name="李四" />
    </div>
  );
}`,
        explanation: '组件就像乐高积木，可以组合成复杂的页面',
      },
      {
        type: 'keyPoints',
        title: 'React 核心特点',
        points: [
          { icon: '🧩', text: '组件化：UI 拆分成独立组件' },
          { icon: '🔄', text: '声明式：描述"要什么"，不是"怎么做"' },
          { icon: '⚡', text: '虚拟 DOM：高效更新页面' },
          { icon: '🔀', text: '单向数据流：数据向下流动' },
        ],
      },
    ],
  },
  '4-2': {
    title: 'JSX 语法详解',
    sections: [
      {
        type: 'intro',
        content: 'JSX 是 JavaScript 的语法扩展，让你可以在 JS 中写类似 HTML 的代码。它让组件的结构一目了然。',
      },
      {
        type: 'code',
        title: 'JSX 语法规则',
        code: `// 1. 基本语法
const element = <h1>Hello, world!</h1>;

// 2. 在 JSX 中使用 JavaScript
const name = "张三";
const element = <h1>Hello, {name}</h1>;

// 3. JSX 中使用表达式
const fontSize = 16;
const element = <p style={{ fontSize: fontSize + 'px' }}>文字</p>;

// 4. 条件渲染
const isLoggedIn = true;
const element = (
  <div>
    {isLoggedIn ? <h1>欢迎回来！</h1> : <h1>请登录</h1>}
  </div>
);

// 5. 列表渲染
const items = ['苹果', '香蕉', '橙子'];
const list = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// 6. className 而不是 class
<div className="container">内容</div>

// 7. 事件处理
<button onClick={() => alert('点击了！')}>
  点击我
</button>`,
        explanation: '记住：JSX 本质是 JavaScript，class 要写成 className',
      },
    ],
  },
  '4-3': {
    title: '组件与 Props',
    sections: [
      {
        type: 'intro',
        content: 'Props（属性）是组件的输入参数，让组件可以接收外部数据并显示不同的内容。就像函数的参数一样。',
      },
      {
        type: 'code',
        title: 'Props 使用示例',
        code: `// 定义接收 props 的组件
function UserCard({ name, age, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>年龄：{age}</p>
    </div>
  );
}

// 使用组件并传递 props
function App() {
  return (
    <div>
      <UserCard 
        name="张三"
        age={25}
        avatar="/avatars/zhangsan.jpg"
      />
      <UserCard 
        name="李四"
        age={30}
        avatar="/avatars/lisi.jpg"
      />
    </div>
  );
}

// 默认值
function Button({ text = "点击", onClick }) {
  return <button onClick={onClick}>{text}</button>;
}`,
        explanation: 'Props 是只读的，子组件不能修改收到的 props',
      },
      {
        type: 'keyPoints',
        title: 'Props 使用规则',
        points: [
          { icon: '📥', text: 'Props 从父组件传递给子组件' },
          { icon: '🔒', text: 'Props 是只读的，不能在子组件中修改' },
          { icon: '🎯', text: '可以传递任何类型：字符串、数字、对象、函数' },
          { icon: '⭐', text: '可以设置默认值' },
        ],
      },
    ],
  },
  '4-4': {
    title: 'State 状态管理',
    sections: [
      {
        type: 'intro',
        content: 'State（状态）是组件的"记忆"。当状态改变时，组件会自动重新渲染，更新界面。这是 React 响应式的核心。',
      },
      {
        type: 'code',
        title: 'useState 基础用法',
        code: `import { useState } from 'react';

function Counter() {
  // 声明状态变量 count，初始值为 0
  // setCount 是更新状态的函数
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);  // 更新状态
  };
  
  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
}

// 对象类型的状态
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: ''
  });
  
  const updateName = (e) => {
    setUser({
      ...user,  // 保留其他字段
      name: e.target.value
    });
  };
  
  return <input value={user.name} onChange={updateName} />;
}`,
        explanation: 'useState 返回一个数组：[当前值, 更新函数]',
      },
    ],
  },
  '4-5': {
    title: '动手：做一个计数器组件',
    sections: [
      {
        type: 'intro',
        content: '让我们把学到的知识综合起来，创建一个功能完整的计数器组件！',
      },
      {
        type: 'challenge',
        title: '挑战任务',
        description: '创建一个计数器，支持增加、减少、重置功能，并显示操作历史。',
        requirements: [
          '显示当前计数值',
          '有增加和减少按钮',
          '有重置按钮',
          '显示操作历史记录',
        ],
        hints: [
          '使用 useState 管理计数和历史记录',
          '历史记录可以是一个数组',
          '每次操作时更新两个状态',
        ],
      },
      {
        type: 'code',
        title: '参考实现',
        code: `function Counter() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  
  const addHistory = (action) => {
    setHistory([...history, \`\${action} → \${count}\`]);
  };
  
  const increment = () => {
    setCount(count + 1);
    addHistory('+1');
  };
  
  const decrement = () => {
    setCount(count - 1);
    addHistory('-1');
  };
  
  const reset = () => {
    setCount(0);
    addHistory('重置');
  };
  
  return (
    <div className="counter">
      <h2>计数器：{count}</h2>
      <div className="buttons">
        <button onClick={decrement}>-1</button>
        <button onClick={reset}>重置</button>
        <button onClick={increment}>+1</button>
      </div>
      <div className="history">
        <h3>操作历史</h3>
        <ul>
          {history.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}`,
        explanation: '这个例子展示了如何管理多个状态',
      },
    ],
  },
  '5-1': {
    title: '什么是 SPA？',
    sections: [
      {
        type: 'intro',
        content: 'SPA（Single Page Application，单页应用）是现代网站的主流形式。整个应用只有一个 HTML 页面，通过 JavaScript 动态更新内容，无需刷新页面。',
      },
      {
        type: 'visual',
        title: '传统网站 vs SPA',
        diagram: 'spa-vs-traditional',
      },
      {
        type: 'keyPoints',
        title: 'SPA 的优势',
        points: [
          { icon: '⚡', text: '用户体验流畅，无需页面刷新' },
          { icon: '📱', text: '更像原生应用的体验' },
          { icon: '🌐', text: '前后端分离，便于开发' },
          { icon: '📦', text: '只加载一次，后续按需加载' },
        ],
      },
    ],
  },
  '5-2': {
    title: 'React Router 使用',
    sections: [
      {
        type: 'intro',
        content: 'React Router 是 React 生态中最流行的路由库。它让你可以在单页应用中实现多页面的效果。',
      },
      {
        type: 'code',
        title: 'React Router 基本配置',
        code: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/contact">联系</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// 页面组件
function HomePage() {
  return <h1>欢迎来到首页</h1>;
}

function AboutPage() {
  return <h1>关于我们</h1>;
}`,
        explanation: 'Route 定义路径和对应组件的映射关系',
      },
    ],
  },
  '5-3': {
    title: '导航栏组件开发',
    sections: [
      {
        type: 'intro',
        content: '导航栏是网站的核心组件。一个好的导航栏应该清晰、美观、响应式。让我们来创建一个专业的导航栏。',
      },
      {
        type: 'code',
        title: '响应式导航栏',
        code: `import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const links = [
    { path: '/', label: '首页' },
    { path: '/services', label: '服务' },
    { path: '/about', label: '关于' },
    { path: '/contact', label: '联系' },
  ];
  
  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            我的网站
          </Link>
          
          {/* 桌面导航 */}
          <div className="hidden md:flex space-x-6">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={\`hover:text-blue-400 \${
                  location.pathname === link.path ? 'text-blue-400' : ''
                }\`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
        
        {/* 移动端导航 */}
        {isOpen && (
          <div className="md:hidden py-4">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}`,
        explanation: 'useLocation 可以获取当前路径，用于高亮当前页面',
      },
    ],
  },
  '5-4': {
    title: '实战：完善网站导航',
    sections: [
      {
        type: 'intro',
        content: '现在让我们把导航栏应用到实际项目中，创建一个完整的网站导航系统。',
      },
      {
        type: 'challenge',
        title: '挑战任务',
        description: '为你的学习网站添加完整的导航系统',
        requirements: [
          '创建导航栏组件',
          '添加至少4个页面链接',
          '实现当前页面高亮',
          '支持移动端响应式',
        ],
        hints: [
          '使用 useLocation 判断当前页面',
          '使用 Tailwind 的响应式类名',
          '可以参考 company 项目的导航实现',
        ],
      },
    ],
  },
  '6-1': {
    title: '表单元素详解',
    sections: [
      {
        type: 'intro',
        content: '表单是用户与网站交互的主要方式。登录、注册、搜索、评论...几乎所有用户输入都通过表单完成。',
      },
      {
        type: 'code',
        title: '常用表单元素',
        code: `function FormExample() {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // 处理表单提交
    }}>
      {/* 文本输入 */}
      <input 
        type="text" 
        placeholder="请输入用户名"
        name="username"
      />
      
      {/* 密码输入 */}
      <input 
        type="password" 
        placeholder="请输入密码"
        name="password"
      />
      
      {/* 邮箱 */}
      <input 
        type="email" 
        placeholder="your@email.com"
        name="email"
      />
      
      {/* 多行文本 */}
      <textarea 
        placeholder="请输入留言..."
        name="message"
        rows={4}
      />
      
      {/* 下拉选择 */}
      <select name="city">
        <option value="">请选择城市</option>
        <option value="beijing">北京</option>
        <option value="shanghai">上海</option>
      </select>
      
      {/* 复选框 */}
      <label>
        <input type="checkbox" name="agree" />
        同意用户协议
      </label>
      
      {/* 单选按钮 */}
      <label>
        <input type="radio" name="gender" value="male" />
        男
      </label>
      <label>
        <input type="radio" name="gender" value="female" />
        女
      </label>
      
      <button type="submit">提交</button>
    </form>
  );
}`,
        explanation: '每个表单元素都应该有 name 属性，用于识别数据',
      },
    ],
  },
  '6-2': {
    title: '受控组件与非受控组件',
    sections: [
      {
        type: 'intro',
        content: '在 React 中，表单元素有两种处理方式：受控组件（由 React 状态控制）和非受控组件（由 DOM 控制）。推荐使用受控组件。',
      },
      {
        type: 'code',
        title: '受控组件示例',
        code: `function ControlledForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  
  // 统一处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交数据：', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="用户名"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="邮箱"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="留言"
      />
      <button type="submit">提交</button>
    </form>
  );
}`,
        explanation: '受控组件：value 由 state 控制，onChange 更新 state',
      },
    ],
  },
  '6-3': {
    title: '表单验证逻辑',
    sections: [
      {
        type: 'intro',
        content: '表单验证是用户体验的重要环节。及时、友好的错误提示能帮助用户正确填写表单。',
      },
      {
        type: 'code',
        title: '表单验证实现',
        code: `function ValidatedForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // 验证规则
  const validate = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return '用户名不能为空';
        if (value.length < 3) return '用户名至少3个字符';
        return '';
      
      case 'email':
        if (!value) return '邮箱不能为空';
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
          return '请输入有效的邮箱地址';
        }
        return '';
      
      case 'password':
        if (!value) return '密码不能为空';
        if (value.length < 6) return '密码至少6个字符';
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 实时验证
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证所有字段
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validate(key, formData[key]);
    });
    
    setErrors(newErrors);
    
    // 检查是否有错误
    if (Object.values(newErrors).every(e => !e)) {
      console.log('提交成功：', formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="用户名"
        />
        {errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>
      {/* 其他字段类似 */}
    </form>
  );
}`,
        explanation: '实时验证 + 提交时验证，双重保障',
      },
    ],
  },
  '6-4': {
    title: '实战：联系表单开发',
    sections: [
      {
        type: 'intro',
        content: '让我们创建一个完整的联系表单，包含验证、提交状态和成功反馈。',
      },
      {
        type: 'challenge',
        title: '挑战任务',
        description: '创建一个联系表单，包含姓名、邮箱、电话、留言字段',
        requirements: [
          '所有字段必填',
          '邮箱格式验证',
          '手机号格式验证（11位数字）',
          '提交成功后显示感谢信息',
        ],
        hints: [
          '可以参考 company 项目的 Contact 组件',
          '使用 useState 管理表单状态和提交状态',
          '提交后清空表单',
        ],
      },
    ],
  },
  '7-1': {
    title: '什么是 API？',
    sections: [
      {
        type: 'intro',
        content: 'API（Application Programming Interface，应用程序编程接口）是软件系统之间通信的桥梁。想象一下餐厅点餐：你是"客户端"，服务员是"API"，厨房是"服务器"。你不需要知道厨房怎么做饭，只需要告诉服务员你要什么，服务员就会把结果带给你。',
      },
      {
        type: 'visual',
        title: 'API 工作原理',
        diagram: 'api-flow',
      },
      {
        type: 'code',
        title: '生活中的 API 例子',
        code: `// 天气应用获取天气数据
const weatherData = await fetch('https://api.weather.com/beijing');

// 地图应用获取位置信息
const location = await fetch('https://api.map.com/search?q=天安门');

// 支付应用查询余额
const balance = await fetch('https://api.bank.com/balance');`,
        explanation: '这些应用都在通过 API 与服务器通信，获取需要的数据。',
      },
      {
        type: 'keyPoints',
        title: '核心概念',
        points: [
          { icon: '🔗', text: 'API 是软件之间的"翻译官"' },
          { icon: '📡', text: '前端通过 API 向后端发送请求' },
          { icon: '📦', text: '后端通过 API 返回数据' },
          { icon: '🔒', text: 'API 可以控制谁能访问什么数据' },
        ],
      },
    ],
  },
  '7-2': {
    title: 'fetch 函数详解',
    sections: [
      {
        type: 'intro',
        content: 'fetch() 是浏览器内置的用于发起网络请求的函数。它返回一个 Promise，让我们可以用 async/await 或 .then() 来处理结果。',
      },
      {
        type: 'code',
        title: '基本语法',
        code: `// 最简单的 fetch 调用
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('出错:', error));

// 使用 async/await（推荐）
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('出错:', error);
  }
}`,
        explanation: 'async/await 语法更清晰，推荐使用。',
      },
      {
        type: 'visual',
        title: 'fetch 执行流程',
        diagram: 'fetch-flow',
      },
      {
        type: 'code',
        title: '带参数的请求',
        code: `// GET 请求带参数
fetch('https://api.example.com/users?page=1&limit=10')

// POST 请求发送数据
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '张三',
    email: 'zhangsan@example.com'
  })
});`,
        explanation: 'GET 用于获取数据，POST 用于提交数据。',
      },
      {
        type: 'keyPoints',
        title: '关键要点',
        points: [
          { icon: '⏳', text: 'fetch 返回 Promise，需要 await 或 .then()' },
          { icon: '🔄', text: 'response.json() 将响应转为 JavaScript 对象' },
          { icon: '📋', text: 'headers 用于设置请求头信息' },
          { icon: '📦', text: 'body 用于发送数据（POST/PUT）' },
        ],
      },
    ],
  },
  '7-3': {
    title: '处理 API 响应',
    sections: [
      {
        type: 'intro',
        content: 'API 返回的数据通常是 JSON 格式。我们需要正确解析这些数据，并在界面上展示出来。',
      },
      {
        type: 'code',
        title: '解析 JSON 响应',
        code: `async function fetchUser() {
  const response = await fetch('https://api.example.com/user/1');
  
  // 检查响应是否成功
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  // 解析 JSON
  const user = await response.json();
  
  console.log(user.name);     // "张三"
  console.log(user.email);    // "zhangsan@example.com"
  console.log(user.age);      // 25
}`,
        explanation: 'response.ok 检查请求是否成功（状态码 200-299）。',
      },
      {
        type: 'interactive',
        title: '试试看：解析 API 响应',
        demo: 'parse-response',
      },
      {
        type: 'code',
        title: '在 React 中使用',
        code: `function UserProfile() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('https://api.example.com/user');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('获取用户失败:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, []);

  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}`,
        explanation: '在 React 中，通常在 useEffect 中发起 API 请求。',
      },
      {
        type: 'keyPoints',
        title: '响应处理要点',
        points: [
          { icon: '✅', text: 'response.ok 检查请求是否成功' },
          { icon: '📊', text: 'response.status 获取状态码（200、404等）' },
          { icon: '🔄', text: 'response.json() 解析 JSON 数据' },
          { icon: '📝', text: '用 useState 存储数据，触发重新渲染' },
        ],
      },
    ],
  },
  '7-4': {
    title: '错误处理与 Loading 状态',
    sections: [
      {
        type: 'intro',
        content: '网络请求可能会失败，用户体验需要良好的错误处理和加载状态提示。',
      },
      {
        type: 'code',
        title: '完整的错误处理',
        code: `async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`);
      }
      
      return await response.json();
    } catch (error) {
      console.log(\`第 \${i + 1} 次尝试失败:\`, error.message);
      
      if (i === retries - 1) {
        throw new Error(\`请求失败，已重试 \${retries} 次\`);
      }
      
      // 等待一段时间再重试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}`,
        explanation: '重试机制可以提高请求成功率。',
      },
      {
        type: 'code',
        title: 'React 完整示例',
        code: `function DataFetcher({ url }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(\`请求失败: \${response.status}\`);
        }
        
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      cancelled = true; // 清理：防止组件卸载后更新状态
    };
  }, [url]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <DataDisplay data={data} />;
}`,
        explanation: '注意清理函数，防止组件卸载后更新状态导致错误。',
      },
      {
        type: 'keyPoints',
        title: '最佳实践',
        points: [
          { icon: '🔄', text: '始终处理 loading 状态' },
          { icon: '⚠️', text: '捕获并显示友好的错误信息' },
          { icon: '🧹', text: '组件卸载时取消未完成的请求' },
          { icon: '🔁', text: '考虑添加重试机制' },
        ],
      },
    ],
  },
  '7-5': {
    title: '实战：调用天气 API',
    sections: [
      {
        type: 'intro',
        content: '让我们把学到的知识综合起来，创建一个真实的天气查询应用！',
      },
      {
        type: 'challenge',
        title: '挑战任务',
        description: '创建一个天气查询组件，用户输入城市名，显示该城市的天气信息。',
        requirements: [
          '使用 fetch 调用天气 API',
          '显示加载状态',
          '处理错误情况',
          '展示天气图标、温度、天气描述',
        ],
        hints: [
          '可以使用 OpenWeatherMap 的免费 API',
          'API Key: demo（演示用）',
          'API 地址: https://api.openweathermap.org/data/2.5/weather',
        ],
      },
      {
        type: 'code',
        title: '参考实现',
        code: `function WeatherApp() {
  const [city, setCity] = React.useState('');
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = 'demo';
      const url = \`https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiKey}&units=metric\`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('城市未找到');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="输入城市名..."
      />
      <button onClick={fetchWeather}>查询</button>
      
      {loading && <p>加载中...</p>}
      {error && <p className="error">{error}</p>}
      
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>温度: {weather.main.temp}°C</p>
          <p>天气: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}`,
        explanation: '这是一个完整的天气应用示例。',
      },
    ],
  },
  '8-1': {
    title: '什么是服务器？',
    sections: [
      {
        type: 'intro',
        content: '服务器是一台24小时运行的计算机，负责接收和处理客户端请求。当你在浏览器输入网址时，服务器就会响应并返回网页内容。',
      },
      {
        type: 'visual',
        title: '客户端-服务器模型',
        diagram: 'frontend-backend',
      },
      {
        type: 'keyPoints',
        title: '服务器的作用',
        points: [
          { icon: '💾', text: '存储数据：数据库、文件、用户信息' },
          { icon: '⚙️', text: '处理业务逻辑：计算、验证、处理' },
          { icon: '🔒', text: '安全保障：身份验证、权限控制' },
          { icon: '🌐', text: '提供服务：API接口、静态资源' },
        ],
      },
    ],
  },
  '8-2': {
    title: 'Express 框架入门',
    sections: [
      {
        type: 'intro',
        content: 'Express 是 Node.js 平台上最流行的 Web 框架。它简洁、灵活，让你能快速搭建 Web 服务器和 API。',
      },
      {
        type: 'code',
        title: '创建第一个 Express 服务器',
        code: `// 1. 初始化项目
// npm init -y
// npm install express

// 2. 创建 server.js
const express = require('express');
const app = express();
const PORT = 3000;

// 中间件：解析 JSON 请求体
app.use(express.json());

// 路由：处理 GET 请求
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 路由：处理 API 请求
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: '张三' },
    { id: 2, name: '李四' }
  ]);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(\`服务器运行在 http://localhost:\${PORT}\`);
});

// 运行：node server.js`,
        explanation: 'Express 的核心概念：路由、中间件、请求/响应',
      },
      {
        type: 'keyPoints',
        title: 'Express 核心概念',
        points: [
          { icon: '🛣️', text: '路由：定义 URL 路径和处理函数的映射' },
          { icon: '🔗', text: '中间件：处理请求的函数链' },
          { icon: '📥', text: 'req：请求对象，包含客户端发送的数据' },
          { icon: '📤', text: 'res：响应对象，用于返回数据给客户端' },
        ],
      },
    ],
  },
  '8-3': {
    title: 'API 接口设计',
    sections: [
      {
        type: 'intro',
        content: 'RESTful API 是一种流行的 API 设计风格。它使用 HTTP 方法（GET、POST、PUT、DELETE）来表示对资源的操作。',
      },
      {
        type: 'code',
        title: 'RESTful API 示例',
        code: `// 用户管理 API

// 获取所有用户
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 获取单个用户
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json(user);
});

// 创建用户
app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// 更新用户
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
});

// 删除用户
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});`,
        explanation: 'RESTful 设计原则：URL 表示资源，HTTP 方法表示操作',
      },
      {
        type: 'keyPoints',
        title: 'HTTP 方法含义',
        points: [
          { icon: '📖', text: 'GET：获取资源（只读）' },
          { icon: '➕', text: 'POST：创建新资源' },
          { icon: '✏️', text: 'PUT：更新资源（整体）' },
          { icon: '🗑️', text: 'DELETE：删除资源' },
        ],
      },
    ],
  },
  '8-4': {
    title: '连接数据库',
    sections: [
      {
        type: 'intro',
        content: '数据库是存储和管理数据的核心。MongoDB 是一种流行的 NoSQL 数据库，非常适合 Node.js 应用。',
      },
      {
        type: 'code',
        title: 'MongoDB 连接与操作',
        code: `// 安装依赖
// npm install mongoose

// 连接数据库
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('连接失败:', err));

// 定义数据模型
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CRUD 操作
// 创建
const user = await User.create({ name: '张三', email: 'zhang@example.com' });

// 查询
const users = await User.find({ age: { $gte: 18 } });
const user = await User.findById('用户ID');

// 更新
await User.findByIdAndUpdate(id, { name: '新名字' });

// 删除
await User.findByIdAndDelete(id);`,
        explanation: 'Mongoose 提供了优雅的 API 来操作 MongoDB',
      },
    ],
  },
  '8-5': {
    title: '实战：构建后端 API',
    sections: [
      {
        type: 'intro',
        content: '让我们综合所学知识，构建一个完整的后端 API 服务！',
      },
      {
        type: 'challenge',
        title: '挑战任务',
        description: '创建一个完整的用户管理 API',
        requirements: [
          '实现用户的增删改查（CRUD）',
          '添加输入验证',
          '处理错误情况',
          '返回正确的 HTTP 状态码',
        ],
        hints: [
          '使用 express.json() 解析请求体',
          '使用 try-catch 捕获异步错误',
          '返回合适的 HTTP 状态码（200, 201, 400, 404, 500）',
        ],
      },
    ],
  },
  '9-1': {
    title: '部署前的准备',
    sections: [
      {
        type: 'intro',
        content: '部署是将你的应用发布到互联网上，让全世界都能访问。在部署前，需要做一些准备工作。',
      },
      {
        type: 'steps',
        title: '部署检查清单',
        steps: [
          { icon: '🔧', title: '环境变量', description: '将敏感信息（API Key、数据库密码）移到环境变量中' },
          { icon: '📦', title: '构建项目', description: '运行 npm run build 生成生产版本' },
          { icon: '📝', title: '更新文档', description: '写好 README，说明如何运行项目' },
          { icon: '🧪', title: '测试', description: '确保所有功能正常工作' },
        ],
      },
      {
        type: 'code',
        title: '环境变量配置',
        code: `# .env 文件（不要提交到 Git！）
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/myapp
API_KEY=your_api_key_here

# .env.example 文件（提交到 Git）
NODE_ENV=production
PORT=
MONGODB_URI=
API_KEY=

// 在代码中使用
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;`,
        explanation: '永远不要将敏感信息硬编码在代码中',
      },
    ],
  },
  '9-2': {
    title: 'Vercel 部署实战',
    sections: [
      {
        type: 'intro',
        content: 'Vercel 是最简单的前端部署平台，支持 React、Vue、Next.js 等框架。免费额度足够个人项目使用。',
      },
      {
        type: 'steps',
        title: 'Vercel 部署步骤',
        steps: [
          { icon: '1️⃣', title: '注册账号', description: '访问 vercel.com，用 GitHub 账号登录' },
          { icon: '2️⃣', title: '导入项目', description: '点击 "Import Project"，选择 GitHub 仓库' },
          { icon: '3️⃣', title: '配置项目', description: 'Vercel 会自动检测框架，通常无需额外配置' },
          { icon: '4️⃣', title: '部署', description: '点击 "Deploy"，等待几分钟即可完成' },
        ],
      },
      {
        type: 'code',
        title: 'vercel.json 配置（可选）',
        code: `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}`,
        explanation: 'vercel.json 用于自定义部署配置',
      },
    ],
  },
  '9-3': {
    title: '自定义域名配置',
    sections: [
      {
        type: 'intro',
        content: '拥有自己的域名让网站更专业。你可以在阿里云、腾讯云、GoDaddy 等平台购买域名。',
      },
      {
        type: 'steps',
        title: '域名配置步骤',
        steps: [
          { icon: '🛒', title: '购买域名', description: '选择一个简短好记的域名' },
          { icon: '➕', title: '添加域名', description: '在 Vercel 项目设置中添加自定义域名' },
          { icon: '⚙️', title: '配置 DNS', description: '在域名服务商添加 CNAME 记录指向 Vercel' },
          { icon: '⏳', title: '等待生效', description: 'DNS 解析通常需要几分钟到几小时' },
        ],
      },
      {
        type: 'keyPoints',
        title: 'DNS 配置要点',
        points: [
          { icon: '🔗', text: 'CNAME 记录：将子域名指向另一个域名' },
          { icon: '📍', text: 'A 记录：将域名指向 IP 地址' },
          { icon: '🔒', text: 'HTTPS：Vercel 自动提供免费 SSL 证书' },
          { icon: '🌐', text: 'www：记得同时配置 www 和非 www 域名' },
        ],
      },
    ],
  },
  '9-4': {
    title: '持续集成与部署',
    sections: [
      {
        type: 'intro',
        content: 'CI/CD（持续集成/持续部署）让你每次推送代码后自动构建和部署，大大提高开发效率。',
      },
      {
        type: 'visual',
        title: 'CI/CD 流程',
        diagram: 'cicd-flow',
      },
      {
        type: 'code',
        title: 'GitHub Actions 配置',
        code: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}`,
        explanation: 'GitHub Actions 可以在推送代码时自动运行测试和部署',
      },
    ],
  },
  '9-5': {
    title: '毕业项目：部署你的学习网站',
    sections: [
      {
        type: 'intro',
        content: '恭喜你完成了所有章节的学习！现在让我们把学习网站部署到互联网上，让全世界都能看到你的作品！',
      },
      {
        type: 'challenge',
        title: '终极挑战',
        description: '将你开发的学习网站部署到 Vercel',
        requirements: [
          '将代码推送到 GitHub',
          '在 Vercel 上导入并部署项目',
          '配置环境变量（如 API Key）',
          '测试部署后的网站功能',
        ],
        hints: [
          '确保 package.json 中的 build 脚本正确',
          '检查是否有硬编码的敏感信息',
          '部署后测试所有功能是否正常',
        ],
      },
      {
        type: 'keyPoints',
        title: '恭喜你完成了学习之旅！',
        points: [
          { icon: '🎉', text: '你已经掌握了前端开发的核心技能' },
          { icon: '🚀', text: '你可以独立开发企业级网站' },
          { icon: '💪', text: '继续学习，不断提升自己' },
          { icon: '🌟', text: '欢迎回来复习和挑战更多内容' },
        ],
      },
    ],
  },
};

function LessonContent({ lessonId, onComplete }) {
  const lesson = lessonContent[lessonId];

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-400">课程内容正在编写中...</p>
      </div>
    );
  }

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'intro':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-6 mb-6"
          >
            <p className="text-secondary-200 text-lg leading-relaxed">{section.content}</p>
          </motion.div>
        );

      case 'code':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Code className="w-5 h-5 mr-2 text-primary-400" />
              {section.title}
            </h3>
            <div className="bg-secondary-900 rounded-xl overflow-hidden">
              <pre className="p-4 overflow-x-auto text-sm">
                <code className="text-green-400 font-mono whitespace-pre">{section.code}</code>
              </pre>
            </div>
            {section.explanation && (
              <p className="mt-3 text-secondary-400 text-sm bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
                💡 {section.explanation}
              </p>
            )}
          </motion.div>
        );

      case 'keyPoints':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              {section.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.points.map((point, i) => (
                <div key={i} className="flex items-start space-x-3 bg-secondary-800/50 rounded-lg p-3">
                  <span className="text-xl">{point.icon}</span>
                  <span className="text-secondary-200">{point.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'visual':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-secondary-800/50 border border-secondary-700 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
            <div className="text-center py-8">
              {section.diagram === 'api-flow' && (
                <div className="flex items-center justify-center space-x-4 text-4xl">
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <span>📱</span>
                    <p className="text-xs text-blue-400 mt-1">客户端</p>
                  </div>
                  <span className="text-secondary-500">→</span>
                  <div className="bg-purple-500/20 p-4 rounded-xl">
                    <span>🔌</span>
                    <p className="text-xs text-purple-400 mt-1">API</p>
                  </div>
                  <span className="text-secondary-500">→</span>
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <span>🖥️</span>
                    <p className="text-xs text-green-400 mt-1">服务器</p>
                  </div>
                </div>
              )}
              {section.diagram === 'fetch-flow' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-green-400">fetch(url)</code>
                    <span className="text-secondary-500">→</span>
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-blue-400">Promise</code>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-blue-400">await</code>
                    <span className="text-secondary-500">→</span>
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-yellow-400">Response</code>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-yellow-400">.json()</code>
                    <span className="text-secondary-500">→</span>
                    <code className="bg-secondary-900 px-3 py-1 rounded text-sm text-green-400">Data</code>
                  </div>
                </div>
              )}
              {section.diagram === 'frontend-backend' && (
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <p className="text-blue-400 font-medium">前端</p>
                    <p className="text-secondary-500 text-xs mt-1">用户界面</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span className="text-purple-400 text-xs">API</span>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-green-500/20 rounded-2xl flex items-center justify-center mb-3 mx-auto">
                      <span className="text-4xl">⚙️</span>
                    </div>
                    <p className="text-green-400 font-medium">后端</p>
                    <p className="text-secondary-500 text-xs mt-1">业务逻辑</p>
                  </div>
                </div>
              )}
              {section.diagram === 'terminal-intro' && (
                <div className="bg-secondary-900 rounded-xl p-4 text-left font-mono text-sm max-w-md mx-auto">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-secondary-400">
                    <p><span className="text-green-400">PS C:\Users\You&gt;</span> pwd</p>
                    <p className="text-white ml-4">Path</p>
                    <p className="text-white ml-4">----</p>
                    <p className="text-white ml-4">C:\Users\You</p>
                    <p className="mt-2"><span className="text-green-400">PS C:\Users\You&gt;</span> <span className="animate-pulse">_</span></p>
                  </div>
                </div>
              )}
              {section.diagram === 'project-structure' && (
                <div className="text-left bg-secondary-900 rounded-xl p-4 max-w-md mx-auto font-mono text-sm">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <FolderTree className="w-4 h-4" />
                    <span>my-first-app/</span>
                  </div>
                  <div className="ml-4 space-y-1 text-secondary-300">
                    <p>├── 📄 index.html</p>
                    <p>├── 📦 package.json</p>
                    <p>├── 📁 node_modules/</p>
                    <p>└── 📁 src/</p>
                    <p className="ml-4">├── ⚛️ main.jsx</p>
                    <p className="ml-4">├── 🎨 App.jsx</p>
                    <p className="ml-4">└── 🎨 App.css</p>
                  </div>
                </div>
              )}
              {section.diagram === 'box-model' && (
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="bg-orange-200 p-4 rounded-lg">
                      <p className="text-orange-800 text-sm mb-2">Margin（外边距）</p>
                      <div className="bg-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800 text-sm mb-2">Border（边框）</p>
                        <div className="bg-green-200 p-4 rounded-lg">
                          <p className="text-green-800 text-sm mb-2">Padding（内边距）</p>
                          <div className="bg-blue-200 p-8 rounded-lg text-center">
                            <p className="text-blue-800 font-bold">Content（内容）</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {section.diagram === 'react-components' && (
                <div className="flex flex-col items-center space-y-4">
                  <motion.div 
                    className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-4 w-64 text-center"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl">📱</span>
                    <p className="text-blue-400 font-medium">App 组件</p>
                  </motion.div>
                  <div className="flex space-x-4">
                    <motion.div 
                      className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 w-32 text-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    >
                      <span className="text-2xl">🧩</span>
                      <p className="text-green-400 text-sm">Header</p>
                    </motion.div>
                    <motion.div 
                      className="bg-purple-500/20 border-2 border-purple-500 rounded-xl p-4 w-32 text-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    >
                      <span className="text-2xl">🧩</span>
                      <p className="text-purple-400 text-sm">Main</p>
                    </motion.div>
                    <motion.div 
                      className="bg-orange-500/20 border-2 border-orange-500 rounded-xl p-4 w-32 text-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    >
                      <span className="text-2xl">🧩</span>
                      <p className="text-orange-400 text-sm">Footer</p>
                    </motion.div>
                  </div>
                </div>
              )}
              {section.diagram === 'spa-vs-traditional' && (
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <h4 className="text-secondary-400 mb-4">传统网站</h4>
                    <div className="space-y-2">
                      <motion.div 
                        className="bg-red-500/20 p-3 rounded-lg"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <p className="text-red-400 text-sm">页面1.html</p>
                      </motion.div>
                      <p className="text-secondary-500">↓ 跳转 ↓</p>
                      <motion.div 
                        className="bg-red-500/20 p-3 rounded-lg"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <p className="text-red-400 text-sm">页面2.html</p>
                      </motion.div>
                    </div>
                    <p className="text-xs text-secondary-500 mt-2">每次跳转都刷新页面</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-secondary-400 mb-4">SPA 单页应用</h4>
                    <div className="bg-green-500/20 p-4 rounded-lg">
                      <p className="text-green-400 font-medium">index.html</p>
                      <div className="mt-2 space-y-1">
                        <motion.div 
                          className="bg-green-500/30 p-2 rounded"
                          animate={{ x: [-5, 5, -5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <p className="text-green-300 text-sm">页面1组件</p>
                        </motion.div>
                        <motion.div 
                          className="bg-green-500/30 p-2 rounded"
                          animate={{ x: [5, -5, 5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <p className="text-green-300 text-sm">页面2组件</p>
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-xs text-secondary-500 mt-2">组件切换，不刷新页面</p>
                  </div>
                </div>
              )}
              {section.diagram === 'cicd-flow' && (
                <div className="flex flex-col items-center space-y-4">
                  <motion.div 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-blue-500/20 p-4 rounded-xl text-center w-32">
                      <span className="text-2xl">💻</span>
                      <p className="text-blue-400 text-sm">推送代码</p>
                    </div>
                    <motion.div 
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                    <div className="bg-yellow-500/20 p-4 rounded-xl text-center w-32">
                      <span className="text-2xl">⚙️</span>
                      <p className="text-yellow-400 text-sm">构建</p>
                    </div>
                    <motion.div 
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      →
                    </motion.div>
                    <div className="bg-green-500/20 p-4 rounded-xl text-center w-32">
                      <span className="text-2xl">🧪</span>
                      <p className="text-green-400 text-sm">测试</p>
                    </div>
                    <motion.div 
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    >
                      →
                    </motion.div>
                    <div className="bg-purple-500/20 p-4 rounded-xl text-center w-32">
                      <span className="text-2xl">🚀</span>
                      <p className="text-purple-400 text-sm">部署</p>
                    </div>
                  </motion.div>
                </div>
              )}
              {section.diagram === 'git-flow' && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg w-32 text-center">
                      <p className="text-blue-400 text-sm">工作区</p>
                      <p className="text-xs text-secondary-500">Working Directory</p>
                    </div>
                    <motion.span 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      git add →
                    </motion.span>
                    <div className="bg-yellow-500/20 p-3 rounded-lg w-32 text-center">
                      <p className="text-yellow-400 text-sm">暂存区</p>
                      <p className="text-xs text-secondary-500">Staging Area</p>
                    </div>
                    <motion.span 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    >
                      git commit →
                    </motion.span>
                    <div className="bg-green-500/20 p-3 rounded-lg w-32 text-center">
                      <p className="text-green-400 text-sm">本地仓库</p>
                      <p className="text-xs text-secondary-500">Repository</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'steps':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-secondary-800/50 rounded-xl border border-secondary-700"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <p className="text-secondary-400 text-sm mt-1">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'challenge':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-orange-400" />
              {section.title}
            </h3>
            <p className="text-secondary-300 mb-4">{section.description}</p>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">要求：</h4>
              <ul className="list-disc list-inside text-secondary-400 text-sm space-y-1">
                {section.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <h4 className="text-sm font-medium text-white mt-4">提示：</h4>
              <ul className="list-disc list-inside text-secondary-400 text-sm space-y-1">
                {section.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lesson-content">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6"
      >
        {lesson.title}
      </motion.h2>

      {lesson.sections.map((section, index) => renderSection(section, index))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-secondary-700"
      >
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
        >
          <span>完成本课</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

export default LessonContent;
