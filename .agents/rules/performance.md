---
trigger: always_on
---

# AI Project Rules: 绩效考核原型系统

## 🎯 核心目标
1. **企业级审美**：遵循 Clean UI 风格，使用 Shadcn UI。追求“清晰、有序、专业”，而非酷炫。
2. **逻辑性优先**：信息层级分明。重要数据用 Card 包裹，状态（如等级、进度）必须语义化（Badge/Progress）。
3. **全中文环境**：所有 UI 文案、占位符、模拟数据必须使用地道职场中文。

## 🛠 工具与技能 (Skills & Tooling)
- **前端设计增强**：在进行 UI 设计、页面布局或组件生成时，**必须优先调用 `frontend-design` skills** 以确保产出的高保真度和交互美感。

## 💻 技术栈
- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Lucide React** (图标库)

## 🎨 UI & 中文规范
- **排版**：优先使用 "PingFang SC" 或 "Microsoft YaHei"。文字开启 `antialiased`。
- **布局**：左侧侧边栏导航 + 顶部面包屑 + 主体卡片式布局。
- **细节**：图标与文字间保持 `gap-2`；所有操作需有 `Toast` 反馈。

## 🛠 开发要求
- **组件化**：保持代码简洁，Props 必须定义 Interface。
- **高保真数据**：生成代码时必须自带高质量中文模拟数据（真实姓名、部门、职场语境评语）。
- **交互逻辑**：复杂表单需有校验提示；关键动作（如发布、删除）需有二次确认弹窗。