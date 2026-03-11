// 详细知识点提示数据
// 每个知识点包含：语法说明、代码示例、使用场景、常见错误

export const detailedHintsData = {
  // 第1章：新手村 - 开发环境搭建
  1: {
    title: 'React 基础语法',
    concepts: [
      {
        id: 'jsx-basics',
        title: 'JSX 基础语法',
        icon: '📝',
        syntax: `// JSX 允许在 JavaScript 中编写 HTML 样式的代码
function Component() {
  return (
    <div className="container">
      <h1>标题</h1>
      <p>段落内容</p>
    </div>
  );
}`,
        explanation: `JSX 是 JavaScript 的语法扩展，让你可以在 JS 中写类似 HTML 的代码。

关键规则：
1. 必须有一个根元素包裹所有内容
2. 使用 className 代替 class
3. 使用 camelCase 命名属性（如 onClick 而非 onclick）
4. 使用 {} 嵌入 JavaScript 表达式`,
        examples: [
          {
            title: '嵌入变量',
            code: `const name = 'React';
return <h1>Hello, {name}!</h1>; // 输出: Hello, React!`,
          },
          {
            title: '嵌入表达式',
            code: `return <p>1 + 1 = {1 + 1}</p>; // 输出: 1 + 1 = 2`,
          },
          {
            title: '条件渲染',
            code: `const isLoggedIn = true;
return <p>{isLoggedIn ? '欢迎回来' : '请登录'}</p>;`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记闭合标签',
            wrong: '<div><span>内容</div>',
            correct: '<div><span>内容</span></div>',
          },
          {
            mistake: '使用 class 而不是 className',
            wrong: '<div class="container">',
            correct: '<div className="container">',
          },
          {
            mistake: '多个根元素',
            wrong: '<div>A</div><div>B</div>',
            correct: '<><div>A</div><div>B</div></>',
          },
        ],
      },
      {
        id: 'function-component',
        title: '函数组件',
        icon: '⚡',
        syntax: `// 定义函数组件
function ComponentName() {
  // 组件逻辑
  
  return (
    // JSX 内容
  );
}

// 箭头函数写法
const ComponentName = () => {
  return (
    // JSX 内容
  );
};`,
        explanation: `函数组件是 React 中最基本的组件形式，就是一个返回 JSX 的 JavaScript 函数。

组件命名规范：
1. 必须以大写字母开头（区分于 HTML 标签）
2. 使用 PascalCase 命名法
3. 文件名与组件名保持一致`,
        examples: [
          {
            title: '简单组件',
            code: `function Welcome() {
  return <h1>欢迎使用 React!</h1>;
}`,
          },
          {
            title: '带逻辑的组件',
            code: `function Greeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早上好' : '下午好';
  return <p>{greeting}</p>;
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '组件名小写',
            wrong: 'function myComponent() {}',
            correct: 'function MyComponent() {}',
          },
          {
            mistake: '忘记 return',
            wrong: `function App() {
  <div>内容</div>
}`,
            correct: `function App() {
  return <div>内容</div>;
}`,
          },
        ],
      },
      {
        id: 'event-handling',
        title: '事件处理',
        icon: '🖱️',
        syntax: `// 事件处理函数
function handleClick() {
  alert('按钮被点击了！');
}

// JSX 中绑定事件
<button onClick={handleClick}>
  点击我
</button>

// 内联箭头函数
<button onClick={() => alert('点击了！')}>
  点击我
</button>`,
        explanation: `React 事件使用 camelCase 命名，需要传入函数而非字符串。

重要区别：
1. onClick={handleClick} - 传递函数引用（推荐）
2. onClick={handleClick()} - 立即执行函数（错误！）
3. onClick={() => handleClick()} - 箭头函数包裹（需要传参时用）`,
        examples: [
          {
            title: '传递参数',
            code: `function handleDelete(id) {
  console.log('删除:', id);
}

<button onClick={() => handleDelete(1)}>
  删除
</button>`,
          },
          {
            title: '获取事件对象',
            code: `function handleClick(event) {
  console.log('点击位置:', event.clientX, event.clientY);
}

<button onClick={handleClick}>点击</button>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '调用函数而非传递引用',
            wrong: '<button onClick={handleClick()}>',
            correct: '<button onClick={handleClick}>',
          },
          {
            mistake: '事件名小写',
            wrong: '<button onclick={handleClick}>',
            correct: '<button onClick={handleClick}>',
          },
        ],
      },
      {
        id: 'tailwind-classes',
        title: 'Tailwind CSS 常用类',
        icon: '🎨',
        syntax: `// 布局类
flex          // display: flex
grid          // display: grid
block         // display: block
hidden        // display: none

// 间距类
p-4           // padding: 1rem
m-4           // margin: 1rem
space-x-4     // 子元素水平间距

// 尺寸类
w-full        // width: 100%
h-screen      // height: 100vh
max-w-md      // max-width: 28rem

// 颜色类
bg-blue-500   // background-color
text-white    // color
border-red-500 // border-color`,
        explanation: `Tailwind 是实用优先的 CSS 框架，通过组合类名快速构建界面。

常用前缀：
- p-: padding
- m-: margin
- w-: width
- h-: height
- bg-: background
- text-: color
- border-: border
- rounded-: border-radius`,
        examples: [
          {
            title: '卡片样式',
            code: `<div className="bg-white p-6 rounded-xl shadow-lg">
  <h2 className="text-xl font-bold text-gray-800">标题</h2>
  <p className="text-gray-600 mt-2">内容</p>
</div>`,
          },
          {
            title: 'Flex 布局',
            code: `<div className="flex items-center justify-between p-4">
  <span>左侧</span>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    按钮
  </button>
</div>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '使用 kebab-case',
            wrong: 'className="bg-blue-500 text-center"',
            correct: 'className="bg-blue-500 text-center"',
            note: '实际上这个例子是正确的，但记住 Tailwind 类名中不含大写字母',
          },
          {
            mistake: '忘记单位',
            wrong: 'className="w-100px"',
            correct: 'className="w-[100px]" 或 className="w-24"',
          },
        ],
      },
    ],
  },

  // 第2章：工具大师 - 必备软件详解
  2: {
    title: 'React Hooks 基础',
    concepts: [
      {
        id: 'useState',
        title: 'useState - 状态管理',
        icon: '🔄',
        syntax: `import { useState } from 'react';

function Counter() {
  // 声明状态变量
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}`,
        explanation: `useState 是 React 最常用的 Hook，用于在函数组件中添加状态。

语法解析：
- const [state, setState] = useState(initialValue)
- state: 当前状态值
- setState: 更新状态的函数
- initialValue: 初始值

重要特性：
1. 状态更新会触发组件重新渲染
2. 状态更新是异步的
3. 不要直接修改 state，必须使用 setState`,
        examples: [
          {
            title: '字符串状态',
            code: `const [name, setName] = useState('');

<input 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>`,
          },
          {
            title: '布尔状态',
            code: `const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? '关闭' : '打开'}
</button>`,
          },
          {
            title: '数组状态',
            code: `const [items, setItems] = useState(['A', 'B']);

// 添加元素
setItems([...items, 'C']);

// 删除元素
setItems(items.filter(item => item !== 'B'));`,
          },
          {
            title: '对象状态',
            code: `const [user, setUser] = useState({ name: '', age: 0 });

// 更新对象（保持其他属性）
setUser({ ...user, name: '张三' });`,
          },
        ],
        commonMistakes: [
          {
            mistake: '直接修改状态',
            wrong: `items.push('C');
setItems(items);`,
            correct: `setItems([...items, 'C']);`,
          },
          {
            mistake: '基于旧状态更新时没有使用函数形式',
            wrong: 'setCount(count + 1); // 在异步操作中可能出错',
            correct: 'setCount(prev => prev + 1); // 使用函数形式更安全',
          },
          {
            mistake: '忘记导入 useState',
            wrong: '直接使用 useState',
            correct: "import { useState } from 'react';",
          },
        ],
      },
      {
        id: 'array-methods',
        title: '数组方法',
        icon: '📊',
        syntax: `// 常用数组方法
const arr = [1, 2, 3, 4, 5];

// map - 映射（返回新数组）
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - 过滤
const evens = arr.filter(x => x % 2 === 0); // [2, 4]

// find - 查找单个元素
const found = arr.find(x => x > 3); // 4

// some/every - 判断
const hasEven = arr.some(x => x % 2 === 0); // true
const allPositive = arr.every(x => x > 0); // true

// reduce - 归约
const sum = arr.reduce((acc, x) => acc + x, 0); // 15`,
        explanation: `数组方法是 React 开发中处理列表数据的核心工具。

方法对比：
- map: 转换每个元素，返回等长数组
- filter: 筛选符合条件的元素
- find: 返回第一个符合条件的元素
- some: 是否有任意元素符合条件
- every: 是否所有元素都符合条件
- reduce: 将数组归约为单个值`,
        examples: [
          {
            title: '渲染列表',
            code: `const items = ['苹果', '香蕉', '橙子'];

<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>`,
          },
          {
            title: '删除列表项',
            code: `const [todos, setTodos] = useState([...]);

const deleteTodo = (id) => {
  setTodos(todos.filter(todo => todo.id !== id));
};`,
          },
          {
            title: '切换完成状态',
            code: `const toggleTodo = (id) => {
  setTodos(todos.map(todo =>
    todo.id === id 
      ? { ...todo, completed: !todo.completed }
      : todo
  ));
};`,
          },
        ],
        commonMistakes: [
          {
            mistake: '在 map 中忘记 return',
            wrong: `items.map(item => {
  <li>{item}</li>
})`,
            correct: `items.map(item => {
  return <li>{item}</li>;
})
// 或使用简写
items.map(item => <li>{item}</li>)`,
          },
          {
            mistake: '忘记添加 key',
            wrong: 'items.map(item => <li>{item}</li>)',
            correct: 'items.map((item, index) => <li key={index}>{item}</li>)',
          },
        ],
      },
      {
        id: 'destructuring',
        title: '解构赋值',
        icon: '📦',
        syntax: `// 数组解构
const [a, b] = [1, 2];           // a=1, b=2
const [first, ...rest] = [1,2,3]; // first=1, rest=[2,3]

// 对象解构
const { name, age } = { name: '张三', age: 25 };
const { name: userName } = { name: '李四' }; // 重命名

// 函数参数解构
function UserCard({ name, age }) {
  return <div>{name} - {age}</div>;
}

// 嵌套解构
const { user: { name } } = { user: { name: '王五' } };`,
        explanation: `解构赋值让你可以从数组或对象中提取值，赋给变量。

在 React 中的应用：
1. useState 返回值的解构
2. Props 的解构
3. 从 API 响应中提取数据
4. 函数参数的解构`,
        examples: [
          {
            title: 'Props 解构',
            code: `// 方式1：函数参数解构
function Card({ title, content, image }) {
  return (...);
}

// 方式2：函数体内解构
function Card(props) {
  const { title, content } = props;
  return (...);
}`,
          },
          {
            title: '设置默认值',
            code: `function Button({ text = '点击', size = 'medium' }) {
  return <button className={size}>{text}</button>;
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '解构不存在的属性',
            wrong: `const { name } = undefined; // 报错`,
            correct: `const { name } = user || {}; // 提供默认值`,
          },
        ],
      },
      {
        id: 'spread-operator',
        title: '展开运算符',
        icon: '💫',
        syntax: `// 数组展开
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// 复制数组/对象
const copy = [...original];
const objCopy = { ...original };

// 合并对象（后面的覆盖前面的）
const merged = { ...obj1, ...obj2 };`,
        explanation: `展开运算符(...) 是 React 中更新状态的核心工具。

主要用途：
1. 添加元素到数组
2. 更新对象的某个属性
3. 复制数组或对象（浅拷贝）
4. 合并多个对象`,
        examples: [
          {
            title: '添加列表项',
            code: `const addItem = (newItem) => {
  setItems([...items, newItem]);
};`,
          },
          {
            title: '更新对象属性',
            code: `const updateUser = (field, value) => {
  setUser({ ...user, [field]: value });
};`,
          },
          {
            title: '合并 Props',
            code: `const defaultProps = { size: 'medium', color: 'blue' };
const props = { ...defaultProps, ...customProps };`,
          },
        ],
        commonMistakes: [
          {
            mistake: '展开运算符位置错误',
            wrong: `setItems([newItem, ...items]); // 添加到开头`,
            correct: `setItems([...items, newItem]); // 添加到末尾`,
          },
          {
            mistake: '忘记展开旧状态',
            wrong: `setUser({ name: '张三' }); // 丢失其他属性`,
            correct: `setUser({ ...user, name: '张三' });`,
          },
        ],
      },
    ],
  },

  // 第3章：页面魔法师 - HTML/CSS基础
  3: {
    title: 'CSS 与布局',
    concepts: [
      {
        id: 'flexbox',
        title: 'Flexbox 布局',
        icon: '📐',
        syntax: `// Flex 容器
<div className="flex flex-row flex-wrap gap-4">
  <div className="flex-1">项目1</div>
  <div className="flex-1">项目2</div>
</div>

// 常用 Flex 类
flex              // display: flex
flex-row          // flex-direction: row
flex-col          // flex-direction: column
items-center      // align-items: center
justify-center    // justify-content: center
justify-between   // justify-content: space-between
flex-1            // flex: 1 1 0%
gap-4             // gap: 1rem`,
        explanation: `Flexbox 是一维布局系统，适合处理行或列的排列。

核心概念：
- 主轴（main axis）：flex-direction 定义的方向
- 交叉轴（cross axis）：垂直于主轴的方向
- justify-content：主轴对齐
- align-items：交叉轴对齐`,
        examples: [
          {
            title: '水平居中',
            code: `<div className="flex justify-center items-center h-screen">
  <div>居中内容</div>
</div>`,
          },
          {
            title: '两端对齐',
            code: `<div className="flex justify-between items-center">
  <div>Logo</div>
  <div>导航链接</div>
</div>`,
          },
          {
            title: '垂直堆叠',
            code: `<div className="flex flex-col gap-4">
  <div>第一项</div>
  <div>第二项</div>
  <div>第三项</div>
</div>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记加 flex 类',
            wrong: '<div className="justify-center">',
            correct: '<div className="flex justify-center">',
          },
        ],
      },
      {
        id: 'css-grid',
        title: 'CSS Grid 布局',
        icon: '▦',
        syntax: `// Grid 容器
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// 响应式网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 移动端1列，平板2列，桌面3列 */}
</div>

// 常用 Grid 类
grid-cols-3       // 3列网格
col-span-2        // 跨2列
row-span-2        // 跨2行
gap-4             // 间距`,
        explanation: `CSS Grid 是二维布局系统，可以同时处理行和列。

响应式断点：
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px`,
        examples: [
          {
            title: '卡片网格',
            code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cards.map(card => (
    <div key={card.id} className="bg-white rounded-lg shadow">
      <img src={card.image} />
      <h3>{card.title}</h3>
    </div>
  ))}
</div>`,
          },
          {
            title: '不规则布局',
            code: `<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2">大图</div>
  <div>小图1</div>
  <div>小图2</div>
  <div className="col-span-2">宽图</div>
</div>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '网格项超出范围',
            wrong: 'grid-cols-3 中的元素使用 col-span-4',
            correct: 'col-span 不能超过 grid-cols 的数量',
          },
        ],
      },
      {
        id: 'responsive-design',
        title: '响应式设计',
        icon: '📱',
        syntax: `// 响应式类名前缀
sm:    // 640px 及以上
md:    // 768px 及以上
lg:    // 1024px 及以上
xl:    // 1280px 及以上

// 示例
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* 移动端全宽，平板半宽，桌面1/3宽 */}
</div>

// 隐藏/显示
<div className="hidden md:block">
  {/* 只在平板及以上显示 */}
</div>`,
        explanation: `移动优先的设计思路：先写移动端样式，再用断点添加大屏样式。

常见模式：
1. 单列 → 多列
2. 全宽 → 固定宽度
3. 垂直堆叠 → 水平排列
4. 隐藏 → 显示`,
        examples: [
          {
            title: '响应式导航',
            code: `<nav className="flex flex-col md:flex-row">
  {/* 移动端垂直，桌面水平 */}
</nav>`,
          },
          {
            title: '响应式字体',
            code: `<h1 className="text-2xl md:text-3xl lg:text-4xl">
  标题
</h1>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '断点使用顺序错误',
            wrong: 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1',
            correct: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          },
        ],
      },
    ],
  },

  // 第4章：React入门 - 组件化思维
  4: {
    title: '组件与 Props',
    concepts: [
      {
        id: 'props-basics',
        title: 'Props 基础',
        icon: '📤',
        syntax: `// 父组件传递 props
<ChildComponent 
  title="标题" 
  count={5} 
  isActive={true}
  onClick={handleClick}
/>

// 子组件接收 props
function ChildComponent({ title, count, isActive, onClick }) {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
      <p>数量: {count}</p>
      {isActive && <span>激活</span>}
    </div>
  );
}`,
        explanation: `Props（属性）是组件之间传递数据的方式。

特点：
1. 单向数据流：父 → 子
2. Props 是只读的，不能修改
3. 可以传递任何类型的数据
4. 可以传递函数作为回调`,
        examples: [
          {
            title: '传递对象',
            code: `const user = { name: '张三', age: 25 };
<UserCard user={user} />

// 子组件
function UserCard({ user }) {
  return <p>{user.name} - {user.age}岁</p>;
}`,
          },
          {
            title: '展开传递',
            code: `const props = { title: '标题', content: '内容' };
<Card {...props} /> // 等价于 title="标题" content="内容"`,
          },
          {
            title: 'children',
            code: `<Card>
  <p>这是卡片内容</p>
</Card>

// 子组件
function Card({ children }) {
  return <div className="card">{children}</div>;
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '尝试修改 props',
            wrong: `function Card({ title }) {
  title = '新标题'; // 错误！
  return <h1>{title}</h1>;
}`,
            correct: `function Card({ title }) {
  const displayTitle = title || '默认标题';
  return <h1>{displayTitle}</h1>;
}`,
          },
        ],
      },
      {
        id: 'conditional-rendering',
        title: '条件渲染',
        icon: '🔀',
        syntax: `// 方法1：三元运算符
{isLoggedIn ? <UserPanel /> : <LoginButton />}

// 方法2：逻辑与运算符
{hasMessages && <NotificationBadge />}

// 方法3：条件变量
let content;
if (isLoading) {
  content = <Spinner />;
} else if (error) {
  content = <ErrorMessage />;
} else {
  content = <DataDisplay />;
}

// 方法4：立即执行函数
{(() => {
  if (status === 'loading') return <Loading />;
  if (status === 'error') return <Error />;
  return <Content />;
})()}`,
        explanation: `条件渲染根据状态决定显示什么内容。

注意事项：
1. && 运算符：左侧为 falsy 值（0、''）时会显示该值
2. 三元运算符：适合二选一
3. 提前返回：函数组件中可以用 if 提前 return`,
        examples: [
          {
            title: '列表为空显示',
            code: `{items.length === 0 ? (
  <p>暂无数据</p>
) : (
  <ul>{items.map(...)}</ul>
)}`,
          },
          {
            title: '权限控制',
            code: `{user.role === 'admin' && (
  <button>删除</button>
)}`,
          },
          {
            title: '加载状态',
            code: `{isLoading && <div className="spinner" />}
{!isLoading && <Content />}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '&& 运算符的 0 问题',
            wrong: '{count && <p>有 {count} 条消息</p>}',
            correct: '{count > 0 && <p>有 {count} 条消息</p>}',
            note: '当 count 为 0 时，会显示 "0" 而不是什么都不显示',
          },
        ],
      },
      {
        id: 'list-rendering',
        title: '列表渲染',
        icon: '📋',
        syntax: `// 基础列表渲染
const items = ['苹果', '香蕉', '橙子'];

<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

// 对象列表
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];

<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>`,
        explanation: `使用 map 方法将数组转换为 JSX 元素列表。

关键规则：
1. 每个列表项必须有唯一的 key 属性
2. key 应该使用数据的唯一标识（id）
3. 避免使用数组索引作为 key（除非列表不会变）
4. key 只在兄弟元素间需要唯一`,
        examples: [
          {
            title: '带索引的列表',
            code: `{items.map((item, index) => (
  <li key={item.id}>
    <span>{index + 1}.</span>
    {item.name}
  </li>
))}`,
          },
          {
            title: '嵌套列表',
            code: `{categories.map(category => (
  <div key={category.id}>
    <h3>{category.name}</h3>
    <ul>
      {category.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  </div>
))}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记 key',
            wrong: 'items.map(item => <li>{item}</li>)',
            correct: 'items.map(item => <li key={item.id}>{item}</li>)',
          },
          {
            mistake: '使用索引作为 key（在列表会变化时）',
            wrong: 'items.map((item, index) => <li key={index}>...</li>)',
            correct: 'items.map(item => <li key={item.id}>...</li>)',
            note: '如果列表会增删改，使用索引会导致渲染问题',
          },
        ],
      },
      {
        id: 'useEffect-basics',
        title: 'useEffect 基础',
        icon: '⚡',
        syntax: `import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  // 每次渲染后执行
  useEffect(() => {
    document.title = \`点击了 \${count} 次\`;
  });
  
  // 只在挂载时执行
  useEffect(() => {
    console.log('组件挂载');
  }, []);
  
  // 依赖特定状态
  useEffect(() => {
    console.log('count 变化:', count);
  }, [count]);
  
  // 带清理函数
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick');
    }, 1000);
    
    return () => {
      clearInterval(timer);
      console.log('清理定时器');
    };
  }, []);
  
  return ...;
}`,
        explanation: `useEffect 用于处理副作用（数据获取、订阅、手动修改 DOM 等）。

执行时机：
1. 不传依赖数组：每次渲染后都执行
2. 空数组 []：只在组件挂载时执行
3. 有依赖 [a, b]：依赖变化时执行
4. 返回的清理函数：组件卸载时执行`,
        examples: [
          {
            title: '数据获取',
            code: `useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data));
}, []);`,
          },
          {
            title: '事件监听',
            code: `useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记添加依赖',
            wrong: `useEffect(() => {
  console.log(count);
}, []); // count 变化时不会重新执行`,
            correct: `useEffect(() => {
  console.log(count);
}, [count]);`,
          },
          {
            mistake: '无限循环',
            wrong: `useEffect(() => {
  setCount(count + 1);
}, [count]);`,
            correct: `useEffect(() => {
  setCount(c => c + 1);
}, []); // 或使用函数式更新`,
          },
        ],
      },
    ],
  },

  // 第5章：路由导航 - 单页应用原理
  5: {
    title: 'React Router',
    concepts: [
      {
        id: 'router-setup',
        title: '路由基础配置',
        icon: '🛣️',
        syntax: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* 导航链接 */}
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>
      
      {/* 路由配置 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`,
        explanation: `React Router 是 React 的标准路由库。

核心组件：
- BrowserRouter: 使用 HTML5 history API
- Routes: 包裹所有 Route
- Route: 定义路径和对应组件
- Link: 导航链接（不刷新页面）
- NavLink: 带激活状态的链接`,
        examples: [
          {
            title: 'NavLink 激活样式',
            code: `<NavLink 
  to="/"
  className={({ isActive }) => 
    isActive ? 'text-blue-500' : 'text-gray-500'
  }
>
  首页
</NavLink>`,
          },
          {
            title: '编程式导航',
            code: `import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // 登录逻辑
    navigate('/dashboard');
    // 或返回上一页
    navigate(-1);
  };
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '使用 a 标签代替 Link',
            wrong: '<a href="/about">关于</a>',
            correct: '<Link to="/about">关于</Link>',
            note: 'a 标签会导致页面刷新，Link 是客户端路由',
          },
        ],
      },
      {
        id: 'dynamic-routes',
        title: '动态路由',
        icon: '🔢',
        syntax: `// 定义动态路由
<Route path="/user/:id" element={<UserProfile />} />
<Route path="/post/:category/:slug" element={<Post />} />

// 获取参数
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  
  return <div>用户ID: {id}</div>;
}

// 查询参数
import { useSearchParams } from 'react-router-dom';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  
  return <div>搜索: {query}</div>;
}`,
        explanation: `动态路由允许 URL 中包含可变参数。

参数类型：
1. URL 参数：/user/:id → useParams()
2. 查询参数：?q=react&page=1 → useSearchParams()
3. 所有参数都会是字符串类型`,
        examples: [
          {
            title: '根据参数获取数据',
            code: `function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(\`/api/users/\${id}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]);
  
  return ...;
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记转换参数类型',
            wrong: 'if (id === 1) // 永远为 false，因为 id 是字符串',
            correct: 'if (id === "1") 或 if (Number(id) === 1)',
          },
        ],
      },
      {
        id: 'nested-routes',
        title: '嵌套路由',
        icon: '📁',
        syntax: `import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="flex">
      <aside className="w-64">
        <nav>
          <Link to="/dashboard">概览</Link>
          <Link to="/dashboard/settings">设置</Link>
        </nav>
      </aside>
      <main>
        <Outlet /> {/* 子路由渲染位置 */}
      </main>
    </div>
  );
}

// 路由配置
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<Profile />} />
  </Route>
</Routes>`,
        explanation: `嵌套路由用于创建布局，父路由提供共享 UI，子路由填充变化内容。

Outlet 组件：
- 标记子路由的渲染位置
- 类似于 Vue 的 <router-view>
- 父路由必须包含 Outlet 才能显示子路由`,
        examples: [
          {
            title: '带布局的页面',
            code: `function App() {
  return (
    <div>
      <Header /> {/* 始终显示 */}
      <Outlet /> {/* 页面内容变化 */}
      <Footer /> {/* 始终显示 */}
    </div>
  );
}`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记 Outlet',
            wrong: '嵌套路由不显示子组件',
            correct: '父组件必须包含 <Outlet />',
          },
        ],
      },
    ],
  },

  // 第6章：表单与交互 - 用户输入处理
  6: {
    title: '表单处理',
    concepts: [
      {
        id: 'controlled-components',
        title: '受控组件',
        icon: '🎮',
        syntax: `function Form() {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('提交:', value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        value={value}
        onChange={handleChange}
      />
      <button type="submit">提交</button>
    </form>
  );
}`,
        explanation: `受控组件：React 状态是表单数据的唯一来源。

工作流程：
1. 用户输入 → onChange 事件
2. 更新 state → setValue
3. state 更新 → 重新渲染
4. input value 显示新的 state

优点：
- 可以验证输入
- 可以强制格式
- 可以控制提交`,
        examples: [
          {
            title: '多字段表单',
            code: `const [form, setForm] = useState({ name: '', email: '' });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};

<input name="name" value={form.name} onChange={handleChange} />
<input name="email" value={form.email} onChange={handleChange} />`,
          },
          {
            title: '选择框',
            code: `const [selected, setSelected] = useState('option1');

<select value={selected} onChange={(e) => setSelected(e.target.value)}>
  <option value="option1">选项1</option>
  <option value="option2">选项2</option>
</select>`,
          },
          {
            title: '复选框',
            code: `const [isChecked, setIsChecked] = useState(false);

<input 
  type="checkbox"
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
/>`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记绑定 onChange',
            wrong: '<input value={value} />',
            correct: '<input value={value} onChange={handleChange} />',
            note: '没有 onChange 的受控组件是只读的',
          },
        ],
      },
      {
        id: 'form-validation',
        title: '表单验证',
        icon: '✅',
        syntax: `function Form() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const validate = () => {
    if (!email) {
      setError('邮箱不能为空');
      return false;
    }
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
      setError('邮箱格式不正确');
      return false;
    }
    setError('');
    return true;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // 提交表单
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">提交</button>
    </form>
  );
}`,
        explanation: `表单验证可以在提交时进行，也可以实时验证。

验证策略：
1. 提交时验证：完整检查所有字段
2. 实时验证：用户输入时检查
3. 失焦验证：离开字段时检查
4. 混合策略：实时检查格式，提交时检查必填`,
        examples: [
          {
            title: '实时验证',
            code: `const handleChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  
  if (value && !/^\\S+@\\S+\\.\\S+$/.test(value)) {
    setError('邮箱格式不正确');
  } else {
    setError('');
  }
};`,
          },
          {
            title: '多字段验证',
            code: `const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!form.name) newErrors.name = '姓名必填';
  if (!form.email) newErrors.email = '邮箱必填';
  if (form.password.length < 6) {
    newErrors.password = '密码至少6位';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};`,
          },
        ],
        commonMistakes: [
          {
            mistake: '验证时阻止输入',
            wrong: `if (!/^[0-9]*$/.test(value)) return; // 阻止非数字`,
            correct: '允许输入，但显示错误提示',
          },
        ],
      },
    ],
  },

  // 第7章：学会调用API - 工具宝箱
  7: {
    title: '数据获取',
    concepts: [
      {
        id: 'fetch-api',
        title: 'Fetch API',
        icon: '🌐',
        syntax: `// GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('请求失败');
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST 请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: '张三', age: 25 }),
})
  .then(res => res.json())
  .then(data => console.log(data));`,
        explanation: `Fetch API 是现代浏览器内置的 HTTP 请求接口。

重要注意：
1. fetch 只会在网络错误时 reject
2. 需要手动检查 response.ok
3. 需要调用 .json() 解析响应
4. 默认不带 cookie，需要设置 credentials`,
        examples: [
          {
            title: 'async/await 写法',
            code: `async function getData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('请求失败');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('错误:', error);
  }
}`,
          },
          {
            title: '带认证头',
            code: `fetch('/api/protected', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
});`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记检查 response.ok',
            wrong: `fetch('/api/data')
  .then(res => res.json()) // 404 也会执行`,
            correct: `fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  })`,
          },
        ],
      },
      {
        id: 'data-fetching-pattern',
        title: '数据获取模式',
        icon: '🔄',
        syntax: `function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('获取失败');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}`,
        explanation: `标准的数据获取模式包含三个状态：
- loading: 是否正在加载
- data: 获取到的数据
- error: 错误信息

这种模式可以处理所有情况：
1. 首次加载显示 loading
2. 出错显示错误信息
3. 成功显示数据`,
        examples: [
          {
            title: '刷新按钮',
            code: `const [refreshKey, setRefreshKey] = useState(0);

useEffect(() => {
  fetchData();
}, [refreshKey]);

<button onClick={() => setRefreshKey(k => k + 1)}>
  刷新
</button>`,
          },
          {
            title: '轮询',
            code: `useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);`,
          },
        ],
        commonMistakes: [
          {
            mistake: '没有处理 loading 状态',
            wrong: '直接渲染 data，初始时为 null 会报错',
            correct: '添加 loading 判断，或提供默认空数组',
          },
        ],
      },
    ],
  },

  // 第8章：后端世界 - Node.js与Express
  8: {
    title: 'Express 后端',
    concepts: [
      {
        id: 'express-basics',
        title: 'Express 基础',
        icon: '🚀',
        syntax: `const express = require('express');
const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 路由
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: '张三' }]);
});

app.post('/api/users', (req, res) => {
  const { name } = req.body;
  // 创建用户逻辑
  res.status(201).json({ id: 2, name });
});

// 启动服务器
app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});`,
        explanation: `Express 是 Node.js 最流行的 Web 框架。

核心概念：
- app: Express 应用实例
- req (request): 请求对象，包含请求信息
- res (response): 响应对象，用于发送响应
- 中间件: 处理请求的函数

常用方法：
- res.send(): 发送文本
- res.json(): 发送 JSON
- res.status(): 设置状态码`,
        examples: [
          {
            title: '路由参数',
            code: `app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const user = findUser(userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json(user);
});`,
          },
          {
            title: '查询参数',
            code: `app.get('/api/search', (req, res) => {
  const { q, page = 1 } = req.query;
  // q 是搜索关键词，page 默认值为 1
  const results = search(q, page);
  res.json(results);
});`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记使用 express.json()',
            wrong: 'req.body 是 undefined',
            correct: "app.use(express.json()); // 必须在路由之前",
          },
          {
            mistake: '发送多个响应',
            wrong: `res.json(user);
res.send('OK'); // 错误！`,
            correct: '每个请求只能有一个响应',
          },
        ],
      },
      {
        id: 'middleware',
        title: '中间件',
        icon: '🔧',
        syntax: `// 自定义中间件
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next(); // 必须调用 next 继续执行
};

// 应用级中间件
app.use(logger);
app.use(express.json());

// 路由级中间件
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }
  req.user = decodeToken(token);
  next();
};

app.get('/api/protected', auth, (req, res) => {
  res.json({ message: '受保护的数据', user: req.user });
});`,
        explanation: `中间件是 Express 的核心概念，用于处理请求的函数。

中间件可以：
1. 执行代码
2. 修改请求/响应对象
3. 结束请求-响应周期
4. 调用下一个中间件

执行顺序：按照代码中的顺序执行`,
        examples: [
          {
            title: '错误处理中间件',
            code: `app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});`,
          },
          {
            title: 'CORS 中间件',
            code: `const cors = require('cors');

// 允许所有来源
app.use(cors());

// 或配置特定来源
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));`,
          },
        ],
        commonMistakes: [
          {
            mistake: '忘记调用 next()',
            wrong: '中间件执行后请求卡住',
            correct: '中间件必须调用 next() 或发送响应',
          },
        ],
      },
    ],
  },

  // 第9章：部署上线 - 让世界看到你的作品
  9: {
    title: '部署与运维',
    concepts: [
      {
        id: 'environment-variables',
        title: '环境变量',
        icon: '🔐',
        syntax: `// 安装 dotenv
// npm install dotenv

// server.js
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// .env 文件（不要提交到 Git！）
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key

// 检查环境变量
if (!process.env.JWT_SECRET) {
  console.error('错误: JWT_SECRET 未设置');
  process.exit(1);
}`,
        explanation: `环境变量用于存储配置，避免硬编码敏感信息。

最佳实践：
1. 使用 .env 文件存储本地配置
2. 将 .env 添加到 .gitignore
3. 为生产环境设置不同的值
4. 提供默认值防止 undefined

注意：
- 浏览器无法访问 process.env（除了构建时注入的）
- 敏感信息不要发送到客户端`,
        examples: [
          {
            title: 'React 环境变量',
            code: `// 必须以 REACT_APP_ 开头
const API_URL = process.env.REACT_APP_API_URL;

// .env
REACT_APP_API_URL=http://localhost:3001`,
          },
          {
            title: '不同环境配置',
            code: `// config.js
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];`,
          },
        ],
        commonMistakes: [
          {
            mistake: '提交 .env 文件',
            wrong: '将包含密钥的 .env 提交到 Git',
            correct: 'echo ".env" >> .gitignore',
          },
          {
            mistake: 'React 环境变量命名错误',
            wrong: 'const url = process.env.API_URL;',
            correct: 'const url = process.env.REACT_APP_API_URL;',
          },
        ],
      },
      {
        id: 'docker-basics',
        title: 'Docker 基础',
        icon: '🐳',
        syntax: `# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

# 构建镜像
# docker build -t myapp .

# 运行容器
# docker run -p 3000:3000 -e PORT=3000 myapp`,
        explanation: `Docker 将应用及其依赖打包成容器，确保环境一致性。

关键概念：
- Dockerfile: 定义镜像构建步骤
- Image: 应用的快照
- Container: 运行的镜像实例

优化技巧：
1. 先复制 package.json 再安装依赖（利用缓存）
2. 使用 .dockerignore 排除不需要的文件
3. 使用多阶段构建减小镜像体积`,
        examples: [
          {
            title: '.dockerignore',
            code: `node_modules
npm-debug.log
.env
.git
README.md`,
          },
          {
            title: '多阶段构建',
            code: `# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html`,
          },
        ],
        commonMistakes: [
          {
            mistake: '复制 node_modules',
            wrong: 'COPY . . 会复制本地 node_modules',
            correct: '使用 .dockerignore 排除 node_modules',
          },
        ],
      },
    ],
  },
};

// 根据章节ID获取知识点
export const getHintsByChapter = (chapterId) => {
  return detailedHintsData[chapterId] || null;
};

// 根据章节ID和挑战标题获取相关知识点
export const getRelevantHints = (chapterId, challengeTitle) => {
  const chapterHints = detailedHintsData[chapterId];
  if (!chapterHints) return [];

  // 根据挑战标题关键词匹配相关知识点
  const keywords = challengeTitle.toLowerCase();
  
  return chapterHints.concepts.filter(concept => {
    // 检查标题、ID 是否匹配
    const conceptText = (concept.title + ' ' + concept.id).toLowerCase();
    return keywords.split(' ').some(keyword => 
      conceptText.includes(keyword) || 
      keywords.includes(concept.id.toLowerCase())
    );
  });
};

export default detailedHintsData;
