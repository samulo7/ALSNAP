# 云知通系统架构基线

## 1. 文档目的

本文用于定义 `A-02 建立实施基线文档` 的系统边界、模块拆分和阶段 A 落地方式，作为后续工程初始化、数据建模和接口设计的统一基线。

## 2. 阶段 A 范围边界

### 2.1 纳入阶段 A 的基础能力

- 内部登录与角色访问控制
- 角色化学习首页
- 内容浏览：专题、产品卡片、场景、案例
- 七大件专区与百炼专区
- 学习进度记录与最近浏览
- 固定题集测验、答题记录、错题复习
- 后台用户与角色管理
- 后台内容维护、发布、下线
- 后台题库维护
- 用户行为日志与后台审计日志

### 2.2 明确排除的后续能力

- AI 问答助手
- 向量检索与知识库切片
- 销售版/技术版双答案生成
- 复杂推荐算法
- 高级统计看板
- 内容批量导入导出

## 3. 系统总体形态

阶段 A 采用轻量单体架构，保持“一个前端应用 + 一个后端应用 + 一个主数据库”的实现边界。

### 3.1 组成部分

- 前端：`Next.js App Router`，同时承载学习端与后台管理端
- 后端：`NestJS`，提供鉴权、内容、测验、学习进度和日志接口
- 数据库：`PostgreSQL`
- 缓存：`Redis`，阶段 A 只预留会话和热点缓存能力
- 对象存储：`OSS`，阶段 A 只预留附件与素材能力

### 3.2 逻辑分层

1. 表现层：学习端页面、后台管理页面
2. 接口层：鉴权接口、内容接口、测验接口、学习进度接口、管理接口、日志接口
3. 领域层：角色权限、内容发布、学习记录、答题流程、审计留痕
4. 数据层：用户、角色、内容、题库、学习进度、作答记录、日志

## 4. 角色与主路径

### 4.1 学习端角色

- 销售：进入销售首页，浏览七大件、场景、区域专题并完成测验
- 技术：进入技术首页，浏览产品关系、百炼专区、案例并完成测验
- 新人：进入新人首页，按入门路径学习基础概念、产品地图和基础测验
- 访客/演示账号：只读访问受控演示内容，不进入后台

### 4.2 后台角色

- 内容运营：维护专题、产品卡片、场景、案例和题库，不能直接最终发布
- 管理员：管理用户角色、执行发布/下线、查看审计日志

## 5. 模块拆分

阶段 A 的模块名称、接口域和数据实体必须统一使用以下命名。

| 模块名称 | 主要职责 | 主要页面/入口 | 主要接口域 | 核心实体 |
| --- | --- | --- | --- | --- |
| 鉴权与角色 | 登录、会话、权限校验、角色路由 | 登录页、受限页面守卫 | `auth` `roles` | `user` `role` `user_role` |
| 学习首页 | 角色入口、推荐内容、待完成测验、最近浏览 | 销售首页、技术首页、新人首页 | `home` | `learning_progress` `quiz_set` |
| 内容中心 | 后台统一维护专题、产品卡片、场景、案例 | 后台内容列表、编辑页 | `topics` `product-cards` `scenarios` `case-items` `content-release` | `topic` `product_card` `scenario` `case_item` `content_release` |
| 产品图谱 | 前台按分类浏览产品卡片 | 产品分类页、产品详情页 | `product-cards` | `product_card` |
| 七大件专区 | 展示公司主推产品专题 | 七大件列表、详情页 | `topics` | `topic` |
| 百炼专区 | 展示百炼基础内容与政务/国企 AI 场景子专题 | 百炼首页、子专题详情页 | `topics` | `topic` |
| 场景中心 | 按客户问题浏览场景内容 | 场景列表、场景详情页 | `scenarios` | `scenario` |
| 案例库 | 浏览区域案例模板与筛选 | 案例列表、案例详情页 | `case-items` | `case_item` |
| 测验中心 | 固定题集、作答、得分与解析 | 题集页、答题页、结果页 | `quiz-sets` `quiz-attempts` | `quiz_set` `quiz_question` `quiz_option` `quiz_attempt` `quiz_answer` |
| 学习进度 | 浏览记录、完成状态、专题通关 | 内容详情页、个人中心进度区 | `learning-progress` | `learning_progress` |
| 个人中心 | 最近浏览、错题、学习记录 | 个人中心、错题页 | `learning-progress` `quiz-attempts` | `learning_progress` `quiz_attempt` `quiz_answer` |
| 后台与审计 | 用户管理、角色分配、发布下线、日志查询 | 用户管理页、发布管理页、日志页 | `users` `roles` `audit-logs` `activity-logs` | `user` `user_role` `audit_log` `activity_log` |

## 6. 页面边界

### 6.1 学习端页面

- 登录页
- 角色化首页：销售、技术、新人
- 产品图谱列表页、产品卡片详情页
- 七大件专区列表页、详情页
- 百炼专区首页、子专题详情页
- 场景中心列表页、详情页
- 案例库列表页、详情页
- 测验答题页、结果页
- 个人中心、错题页

### 6.2 后台页面

- 用户列表页、用户详情页
- 内容列表页、内容编辑页、发布管理页
- 题库列表页、题目编辑页
- 审计日志页、用户行为日志页

## 7. 接口边界

阶段 A 只规划基础 REST 接口，不规划 AI 调用接口。

### 7.1 学习端接口

- `POST /auth/login`
- `GET /auth/me`
- `GET /home`
- `GET /topics`
- `GET /topics/:id`
- `GET /product-cards`
- `GET /product-cards/:id`
- `GET /scenarios`
- `GET /scenarios/:id`
- `GET /case-items`
- `GET /case-items/:id`
- `POST /learning-progress/view`
- `POST /learning-progress/complete`
- `GET /quiz-sets/:id`
- `POST /quiz-attempts`
- `GET /quiz-attempts/:id`
- `GET /me/wrong-answers`

### 7.2 后台接口

- `GET /users`
- `PATCH /users/:id/status`
- `PUT /users/:id/roles`
- `POST /topics`
- `PATCH /topics/:id`
- `POST /product-cards`
- `POST /scenarios`
- `POST /case-items`
- `POST /quiz-sets`
- `PATCH /content-release/:id/publish`
- `PATCH /content-release/:id/unpublish`
- `GET /audit-logs`
- `GET /activity-logs`

## 8. 数据边界

阶段 A 的核心数据实体固定为：

- `user`
- `role`
- `user_role`
- `topic`
- `product_card`
- `scenario`
- `case_item`
- `quiz_set`
- `quiz_question`
- `quiz_option`
- `quiz_attempt`
- `quiz_answer`
- `learning_progress`
- `content_release`
- `audit_log`
- `activity_log`

这些实体是后续 `database-design.md` 的约束来源，工程初始化和 schema 设计不得随意更名。

## 9. 典型需求映射

### 9.1 “销售登录后学习七大件并完成测验”

- 页面：登录页 -> 销售首页 -> 七大件详情页 -> 测验页 -> 结果页
- 模块：鉴权与角色、学习首页、七大件专区、测验中心、学习进度
- 接口：`/auth/login` `/home` `/topics/:id` `/quiz-sets/:id` `/quiz-attempts`
- 实体：`user` `user_role` `topic` `quiz_set` `quiz_attempt` `quiz_answer` `learning_progress`

### 9.2 “运营创建场景内容，管理员发布”

- 页面：后台内容列表页 -> 场景编辑页 -> 发布管理页
- 模块：内容中心、后台与审计
- 接口：`/scenarios` `/content-release/:id/publish`
- 实体：`scenario` `content_release` `audit_log`

### 9.3 基础需求映射总表

| 基础需求 | 页面 | 模块 | 接口 | 实体 |
| --- | --- | --- | --- | --- |
| 销售登录并看到角色化首页 | 登录页、销售首页 | 鉴权与角色、学习首页 | `POST /auth/login` `GET /home` | `user` `user_role` `learning_progress` |
| 浏览产品图谱中的产品卡片 | 产品分类页、产品详情页 | 产品图谱 | `GET /product-cards` `GET /product-cards/:id` | `product_card` |
| 浏览七大件和百炼专区 | 专区列表页、详情页 | 七大件专区、百炼专区 | `GET /topics` `GET /topics/:id` | `topic` |
| 浏览场景与案例 | 场景列表页、案例列表页 | 场景中心、案例库 | `GET /scenarios` `GET /case-items` | `scenario` `case_item` |
| 完成一次固定题集测验 | 答题页、结果页 | 测验中心 | `GET /quiz-sets/:id` `POST /quiz-attempts` | `quiz_set` `quiz_attempt` `quiz_answer` |
| 标记内容完成并更新进度 | 内容详情页、个人中心 | 学习进度、个人中心 | `POST /learning-progress/complete` | `learning_progress` |
| 运营创建内容并提交发布 | 内容编辑页、发布管理页 | 内容中心、后台与审计 | `POST /topics` `PATCH /content-release/:id/publish` | `topic` `content_release` `audit_log` |
| 管理员分配角色并查看日志 | 用户详情页、日志页 | 后台与审计 | `PUT /users/:id/roles` `GET /audit-logs` | `user_role` `audit_log` |

## 10. 后续扩展占位

以下能力只在阶段 B 进入设计，不在阶段 A 的页面、接口或数据表中提前落地：

- AI 问答页面与问答日志
- 知识源管理、切片、向量召回
- 热门问题推荐
- 高级统计看板
- 内容批量导入导出
