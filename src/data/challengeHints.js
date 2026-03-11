// 挑战与知识点的映射关系
// 每个挑战只关联最相关的 1-3 个知识点

export const challengeHintsMap = {
  // 第1章 新手村
  'challenge-1-1': {
    title: 'Hello World',
    concepts: ['jsx-basics', 'function-component'],
    quickTip: '创建一个返回 JSX 的函数组件，使用 h1 标签显示 "Hello World"'
  },
  'challenge-1-2': {
    title: '个人信息卡片',
    concepts: ['jsx-basics', 'tailwind-classes'],
    quickTip: '使用 {} 在 JSX 中嵌入变量，用 Tailwind 的 rounded、shadow 等类美化卡片'
  },
  'challenge-1-3': {
    title: '简单的按钮组件',
    concepts: ['event-handling', 'tailwind-classes'],
    quickTip: '使用 onClick 绑定点击事件，注意传递函数引用而非调用函数'
  },
  'challenge-1-4': {
    title: '多元素布局',
    concepts: ['tailwind-classes'],
    quickTip: '使用 flex 和 flex-col 创建垂直布局，flex-1 让内容区占据剩余空间'
  },
  'challenge-1-5': {
    title: '图片展示组件',
    concepts: ['jsx-basics', 'tailwind-classes'],
    quickTip: 'img 标签需要 src 和 alt 属性，使用 object-cover 保持图片比例'
  },

  // 第2章 工具大师
  'challenge-2-1': {
    title: '待办事项列表',
    concepts: ['useState', 'array-methods', 'spread-operator'],
    quickTip: '用 useState 管理输入框和列表，用展开运算符添加新项，map 渲染列表'
  },
  'challenge-2-2': {
    title: '计算器',
    concepts: ['useState', 'event-handling'],
    quickTip: '用多个 useState 管理状态，事件处理函数中更新计算结果'
  },
  'challenge-2-3': {
    title: '颜色选择器',
    concepts: ['useState', 'event-handling', 'array-methods'],
    quickTip: '用 useState 保存当前颜色，map 渲染颜色按钮数组'
  },
  'challenge-2-4': {
    title: '时钟组件',
    concepts: ['useState', 'useEffect-basics'],
    quickTip: 'useState 保存时间，useEffect 设置定时器，记得清理定时器'
  },
  'challenge-2-5': {
    title: '评分组件',
    concepts: ['useState', 'event-handling', 'array-methods'],
    quickTip: '两个 state：rating（当前评分）和 hover（悬停评分），map 生成5个星星'
  },
  'challenge-2-6': {
    title: '标签页组件',
    concepts: ['useState', 'array-methods', 'conditional-rendering'],
    quickTip: 'useState 保存 activeTab，点击时切换，条件渲染显示对应内容'
  },

  // 第3章 页面魔法师
  'challenge-3-1': {
    title: '卡片布局',
    concepts: ['flexbox', 'responsive-design'],
    quickTip: 'flex-col 移动端垂直排列，md:flex-row 平板以上水平排列'
  },
  'challenge-3-2': {
    title: '导航栏',
    concepts: ['flexbox', 'responsive-design', 'useState'],
    quickTip: 'hidden md:block 控制显示/隐藏，useState 控制移动端菜单开关'
  },
  'challenge-3-3': {
    title: '网格画廊',
    concepts: ['css-grid', 'responsive-design'],
    quickTip: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 实现响应式网格'
  },
  'challenge-3-4': {
    title: '登录表单',
    concepts: ['tailwind-classes', 'jsx-basics'],
    quickTip: '使用 max-w-md 限制宽度，mx-auto 居中，space-y-4 设置垂直间距'
  },
  'challenge-3-5': {
    title: '价格卡片',
    concepts: ['flexbox', 'responsive-design', 'conditional-rendering'],
    quickTip: 'flex-col md:flex-row 响应式排列，条件渲染突出推荐方案'
  },

  // 第4章 React入门
  'challenge-4-1': {
    title: '商品卡片',
    concepts: ['props-basics', 'list-rendering'],
    quickTip: '子组件接收 props 显示数据，父组件用 map 渲染多个商品卡片'
  },
  'challenge-4-2': {
    title: '计数器进阶',
    concepts: ['useState', 'array-methods'],
    quickTip: 'useState 管理 count、step、history，展开运算符添加历史记录'
  },
  'challenge-4-3': {
    title: '列表渲染与过滤',
    concepts: ['useState', 'array-methods', 'conditional-rendering'],
    quickTip: 'filter 实现搜索过滤，逻辑与运算符 && 控制显示'
  },
  'challenge-4-4': {
    title: '模态框组件',
    concepts: ['props-basics', 'conditional-rendering'],
    quickTip: 'props 传递 isOpen 和 onClose，条件渲染控制显示，children 渲染内容'
  },
  'challenge-4-5': {
    title: '购物车组件',
    concepts: ['useState', 'array-methods'],
    quickTip: 'map 更新数量，filter 删除商品，reduce 计算总价'
  },

  // 第5章 路由导航
  'challenge-5-1': {
    title: '多页面导航',
    concepts: ['router-setup'],
    quickTip: 'BrowserRouter 包裹应用，Routes 内配置 Route，Link 实现导航'
  },
  'challenge-5-2': {
    title: '动态路由',
    concepts: ['dynamic-routes'],
    quickTip: 'path="/user/:id" 定义动态路由，useParams 获取参数'
  },
  'challenge-5-3': {
    title: '嵌套路由',
    concepts: ['nested-routes'],
    quickTip: '父路由 element 包含布局，Outlet 渲染子路由内容'
  },
  'challenge-5-4': {
    title: '404页面',
    concepts: ['router-setup'],
    quickTip: 'path="*" 匹配所有未定义路由，显示 404 页面'
  },
  'challenge-5-5': {
    title: '面包屑导航',
    concepts: ['dynamic-routes'],
    quickTip: 'useLocation 获取当前路径，split 解析路径层级'
  },

  // 第6章 表单与交互
  'challenge-6-1': {
    title: '注册表单',
    concepts: ['controlled-components', 'form-validation'],
    quickTip: '受控组件绑定 value 和 onChange，提交时验证数据'
  },
  'challenge-6-2': {
    title: '动态表单字段',
    concepts: ['useState', 'array-methods'],
    quickTip: '展开运算符添加字段，filter 删除字段，map 更新字段'
  },
  'challenge-6-3': {
    title: '搜索过滤',
    concepts: ['useState', 'array-methods'],
    quickTip: '多个 filter 链式调用，同时处理搜索和分类过滤'
  },
  'challenge-6-4': {
    title: '文件上传预览',
    concepts: ['useState', 'controlled-components'],
    quickTip: 'FileReader 读取文件，URL.createObjectURL 生成预览链接'
  },
  'challenge-6-5': {
    title: '分步表单',
    concepts: ['useState', 'conditional-rendering'],
    quickTip: 'useState 记录当前步骤，条件渲染显示对应表单'
  },

  // 第7章 学会调用API
  'challenge-7-1': {
    title: '用户列表',
    concepts: ['useEffect-basics', 'fetch-api'],
    quickTip: 'useEffect 调用 API，useState 管理 loading、error、data 三个状态'
  },
  'challenge-7-2': {
    title: '搜索用户',
    concepts: ['useState', 'array-methods', 'fetch-api'],
    quickTip: '输入时 filter 本地数据，或发送请求到服务端搜索'
  },
  'challenge-7-3': {
    title: '帖子列表和详情',
    concepts: ['useEffect-basics', 'fetch-api', 'conditional-rendering'],
    quickTip: '点击时 fetch 详情数据，条件渲染列表或详情视图'
  },
  'challenge-7-4': {
    title: '随机图片展示',
    concepts: ['useEffect-basics', 'fetch-api'],
    quickTip: 'useEffect 加载时获取，点击按钮重新 fetch'
  },
  'challenge-7-5': {
    title: '天气查询',
    concepts: ['useState', 'fetch-api', 'controlled-components'],
    quickTip: '输入城市，点击查询，fetch 获取数据，条件渲染结果'
  },

  // 第8章 后端世界
  'challenge-8-1': {
    title: 'Express Hello World',
    concepts: ['express-basics'],
    quickTip: 'express() 创建应用，app.get 定义路由，app.listen 启动服务'
  },
  'challenge-8-2': {
    title: 'REST API 基础',
    concepts: ['express-basics'],
    quickTip: 'app.get/post/put/delete 定义 CRUD 接口，req.params 获取参数'
  },
  'challenge-8-3': {
    title: '中间件使用',
    concepts: ['middleware'],
    quickTip: 'app.use 注册中间件，next() 继续执行，或返回响应结束请求'
  },
  'challenge-8-4': {
    title: '文件上传',
    concepts: ['middleware'],
    quickTip: 'multer 中间件处理 multipart/form-data，diskStorage 配置存储'
  },
  'challenge-8-5': {
    title: 'JWT 认证',
    concepts: ['middleware'],
    quickTip: '中间件验证 token，jwt.sign 签发，jwt.verify 验证'
  },

  // 第9章 部署上线
  'challenge-9-1': {
    title: '环境变量配置',
    concepts: ['environment-variables'],
    quickTip: 'process.env 读取变量，提供默认值，敏感信息不要提交到 Git'
  },
  'challenge-9-2': {
    title: 'Docker 容器化',
    concepts: ['docker-basics'],
    quickTip: 'FROM 指定基础镜像，COPY 复制文件，CMD 启动命令'
  },
  'challenge-9-3': {
    title: 'GitHub Actions',
    concepts: ['docker-basics'],
    quickTip: '.github/workflows 定义 CI/CD，on 配置触发条件'
  },
  'challenge-9-4': {
    title: 'Nginx 配置',
    concepts: ['docker-basics'],
    quickTip: 'server 块配置虚拟主机，location 配置路由规则'
  },
  'challenge-9-5': {
    title: '监控和日志',
    concepts: ['environment-variables'],
    quickTip: 'winston 记录日志，中间件记录请求，/health 端点检查健康'
  },
};

// 获取特定挑战的提示
export const getChallengeHints = (challengeId) => {
  return challengeHintsMap[challengeId] || null;
};

// 获取快速提示
export const getQuickTip = (challengeId) => {
  return challengeHintsMap[challengeId]?.quickTip || '';
};

export default challengeHintsMap;
