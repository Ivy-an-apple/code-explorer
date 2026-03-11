# Code Explorer - 游戏化学习网站

一个专为编程初学者设计的游戏化学习平台，通过互动式课程、编程挑战和成就系统，帮助您从零开始学习前端开发。

## 🎮 功能特色

- **游戏化学习**：XP系统、等级提升、成就解锁
- **8个学习章节**：从环境搭建到部署上线的完整路径
- **互动式课程**：概念讲解 + 实践操作 + 编程挑战
- **进度追踪**：实时查看学习进度和统计数据
- **响应式设计**：支持桌面和移动设备

## 📚 学习路径

1. **新手村** - 开发环境搭建
2. **工具大师** - 必备软件详解
3. **页面魔法师** - HTML/CSS 基础
4. **React 入门** - 组件化思维
5. **路由导航** - 单页应用原理
6. **表单与交互** - 用户输入处理
7. **后端世界** - Node.js 与 Express
8. **部署上线** - 让世界看到你的作品

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- 现代浏览器（Chrome、Firefox、Edge 等）

### 安装步骤

1. **解压项目文件**
   ```
   将 code-explorer.zip 解压到任意目录
   ```

2. **进入项目目录**
   ```
   cd code-explorer
   ```

3. **运行启动脚本**
   ```
   双击运行 start.bat
   ```

   或手动执行：
   ```bash
   npm install
   npm run dev
   ```

4. **访问网站**
   ```
   在浏览器中打开 http://localhost:5173
   ```

## 📁 项目结构

```
code-explorer/
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   │   ├── GameUI/     # 游戏化UI组件
│   │   └── Header.jsx  # 导航栏
│   ├── context/        # 状态管理
│   │   └── LearningContext.jsx
│   ├── pages/          # 页面
│   │   ├── LearnPage.jsx      # 首页/仪表盘
│   │   ├── ChapterPage.jsx    # 章节详情
│   │   ├── ChallengePage.jsx  # 编程挑战
│   │   └── ProfilePage.jsx    # 个人中心
│   ├── App.jsx         # 应用入口
│   ├── main.jsx        # 渲染入口
│   ├── App.css         # 应用样式
│   └── index.css       # 全局样式
├── index.html          # HTML模板
├── package.json        # 项目配置
├── vite.config.js      # Vite配置
├── tailwind.config.js  # Tailwind配置
├── postcss.config.js   # PostCSS配置
├── start.bat          # Windows启动脚本
└── README.md          # 项目说明
```

## 🛠️ 技术栈

- **前端框架**：React 18
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **动画库**：Framer Motion
- **图标库**：Lucide React
- **路由**：React Router

## 📝 使用指南

### 开始学习

1. 打开网站后，您会看到学习仪表盘
2. 点击"继续学习"或选择任意章节开始学习
3. 完成课程后点击"开始学习"按钮标记完成并获得 XP

### 游戏化元素

- **XP（经验值）**：完成课程、挑战获得
- **等级**：累积 XP 自动升级
- **成就**：完成特定目标解锁徽章
- **连续学习**：每天学习保持学习 streak

### 编程挑战

1. 进入"每日挑战"页面
2. 在代码编辑器中编写代码
3. 点击"运行代码"查看结果
4. 完成挑战获得额外 XP

## 🎯 学习目标

完成本课程后，您将能够：

- ✅ 独立搭建前端开发环境
- ✅ 使用 React 构建交互式网页
- ✅ 理解前后端分离架构
- ✅ 掌握 Git 版本控制
- ✅ 部署网站到服务器

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 📱 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 💡 提示

- 建议每天学习 30-60 分钟
- 完成课程后做测验巩固知识
- 遇到问题可以使用 AI 助手（即将上线）
- 保持连续学习可以获得 streak 奖励

---

**祝您学习愉快！** 🚀
