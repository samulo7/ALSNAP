# 云知通模块清单基线

## 1. 文档目的

本文把 MVP 范围映射为可实现的模块、页面、接口和数据实体，用于约束阶段 A 的工作范围，避免在工程初始化前发生范围膨胀。

## 2. 阶段 A 模块总览

| 模块名称 | 用户角色 | 页面范围 | 接口范围 | 核心实体 | 是否属于阶段 A |
| --- | --- | --- | --- | --- | --- |
| 鉴权与角色 | 全角色 | 登录页、鉴权守卫 | `auth` `roles` | `user` `role` `user_role` | 是 |
| 学习首页 | 销售、技术、新人、访客 | 销售首页、技术首页、新人首页 | `home` | `learning_progress` `quiz_set` | 是 |
| 内容中心 | 内容运营、管理员 | 内容列表、编辑页、发布管理页 | `topics` `product-cards` `scenarios` `case-items` `content-release` | `topic` `product_card` `scenario` `case_item` `content_release` | 是 |
| 产品图谱 | 销售、技术、新人、访客 | 产品列表页、产品详情页 | `product-cards` | `product_card` | 是 |
| 七大件专区 | 销售、技术、新人、访客 | 专区列表页、详情页 | `topics` | `topic` | 是 |
| 百炼专区 | 销售、技术、新人、访客 | 专区首页、子专题页 | `topics` | `topic` | 是 |
| 场景中心 | 销售、技术、访客 | 场景列表页、详情页 | `scenarios` | `scenario` | 是 |
| 案例库 | 销售、技术、访客 | 案例列表页、详情页 | `case-items` | `case_item` | 是 |
| 测验中心 | 销售、技术、新人 | 题集页、答题页、结果页 | `quiz-sets` `quiz-attempts` | `quiz_set` `quiz_question` `quiz_option` `quiz_attempt` `quiz_answer` | 是 |
| 学习进度 | 销售、技术、新人 | 内容完成入口、个人中心进度区 | `learning-progress` | `learning_progress` | 是 |
| 个人中心 | 销售、技术、新人 | 个人中心、错题页 | `learning-progress` `quiz-attempts` | `learning_progress` `quiz_attempt` `quiz_answer` | 是 |
| 后台与审计 | 管理员、内容运营 | 用户页、角色分配页、日志页 | `users` `roles` `audit-logs` `activity-logs` | `user` `user_role` `audit_log` `activity_log` | 是 |

## 3. 模块详细说明

### 3.1 鉴权与角色

- 目标：提供登录、会话保持、角色识别和页面访问控制
- 页面：
  - 登录页
  - 页面级鉴权守卫
- 基础接口：
  - `POST /auth/login`
  - `GET /auth/me`
- 基础规则：
  - 未登录用户不能访问业务页
  - 访客/演示账号不能进入后台编辑与发布页面

### 3.2 学习首页

- 目标：按角色显示推荐内容、学习进度、待完成测验、最近浏览
- 页面：
  - 销售首页
  - 技术首页
  - 新人首页
- 基础接口：
  - `GET /home`
- 依赖实体：
  - `learning_progress`
  - `quiz_set`

### 3.3 内容中心

- 目标：后台统一维护四类内容，不拆成多套系统
- 页面：
  - 内容列表页
  - 内容编辑页
  - 发布管理页
- 基础接口：
  - `POST /topics`
  - `PATCH /topics/:id`
  - `POST /product-cards`
  - `POST /scenarios`
  - `POST /case-items`
  - `PATCH /content-release/:id/publish`
  - `PATCH /content-release/:id/unpublish`
- 依赖实体：
  - `topic`
  - `product_card`
  - `scenario`
  - `case_item`
  - `content_release`

### 3.4 产品图谱

- 目标：按分类浏览产品卡片，帮助用户建立阿里云产品地图
- 页面：
  - 产品列表页
  - 产品详情页
- 基础接口：
  - `GET /product-cards`
  - `GET /product-cards/:id`
- 依赖实体：
  - `product_card`

### 3.5 七大件专区

- 目标：围绕公司确认后的主推产品展示统一专题内容
- 页面：
  - 七大件列表页
  - 七大件详情页
- 基础接口：
  - `GET /topics?topicType=seven-pack`
  - `GET /topics/:id`
- 依赖实体：
  - `topic`

### 3.6 百炼专区

- 目标：展示百炼基础认知与政务/国企 AI 场景子专题
- 页面：
  - 百炼首页
  - 子专题详情页
- 基础接口：
  - `GET /topics?topicType=bailian`
  - `GET /topics/:id`
- 依赖实体：
  - `topic`

### 3.7 场景中心

- 目标：按客户问题组织场景内容，支持按行业和客户类型筛选
- 页面：
  - 场景列表页
  - 场景详情页
- 基础接口：
  - `GET /scenarios`
  - `GET /scenarios/:id`
- 依赖实体：
  - `scenario`

### 3.8 案例库

- 目标：沉淀东北区域案例模板，支持筛选和脱敏说明展示
- 页面：
  - 案例列表页
  - 案例详情页
- 基础接口：
  - `GET /case-items`
  - `GET /case-items/:id`
- 依赖实体：
  - `case_item`

### 3.9 测验中心

- 目标：提供固定题集答题、得分、解析和错题沉淀
- 页面：
  - 题集页
  - 答题页
  - 结果页
- 基础接口：
  - `GET /quiz-sets/:id`
  - `POST /quiz-attempts`
  - `GET /quiz-attempts/:id`
- 依赖实体：
  - `quiz_set`
  - `quiz_question`
  - `quiz_option`
  - `quiz_attempt`
  - `quiz_answer`

### 3.10 学习进度

- 目标：记录浏览、完成和通关状态
- 页面：
  - 内容详情页中的“标记完成”入口
  - 首页进度区
  - 个人中心进度区
- 基础接口：
  - `POST /learning-progress/view`
  - `POST /learning-progress/complete`
- 依赖实体：
  - `learning_progress`

### 3.11 个人中心

- 目标：汇总最近浏览、学习进度、错题和复习入口
- 页面：
  - 个人中心
  - 错题页
- 基础接口：
  - `GET /me/wrong-answers`
  - `GET /quiz-attempts/:id`
- 依赖实体：
  - `learning_progress`
  - `quiz_attempt`
  - `quiz_answer`

### 3.12 后台与审计

- 目标：管理员完成用户管理、角色分配、发布与日志查询
- 页面：
  - 用户列表页
  - 用户详情页
  - 角色分配页
  - 审计日志页
  - 用户行为日志页
- 基础接口：
  - `GET /users`
  - `PATCH /users/:id/status`
  - `PUT /users/:id/roles`
  - `GET /audit-logs`
  - `GET /activity-logs`
- 依赖实体：
  - `user`
  - `user_role`
  - `audit_log`
  - `activity_log`

## 4. 基础需求追踪

| 基础需求 | 所属模块 | 关键页面 | 关键接口 | 关键实体 |
| --- | --- | --- | --- | --- |
| 销售登录并看到角色化首页 | 鉴权与角色、学习首页 | 登录页、销售首页 | `POST /auth/login` `GET /home` | `user` `user_role` `learning_progress` |
| 浏览产品图谱中的产品卡片 | 产品图谱 | 产品列表页、详情页 | `GET /product-cards` | `product_card` |
| 浏览七大件和百炼专区 | 七大件专区、百炼专区 | 专区列表页、详情页 | `GET /topics` | `topic` |
| 浏览场景与案例 | 场景中心、案例库 | 场景页、案例页 | `GET /scenarios` `GET /case-items` | `scenario` `case_item` |
| 完成一次固定题集测验 | 测验中心 | 答题页、结果页 | `GET /quiz-sets/:id` `POST /quiz-attempts` | `quiz_set` `quiz_attempt` `quiz_answer` |
| 标记内容完成并更新进度 | 学习进度 | 内容详情页、个人中心 | `POST /learning-progress/complete` | `learning_progress` |
| 运营创建内容并提交发布 | 内容中心、后台与审计 | 内容编辑页、发布管理页 | `POST /topics` `PATCH /content-release/:id/publish` | `topic` `content_release` `audit_log` |
| 管理员分配角色并查看日志 | 后台与审计 | 用户详情页、日志页 | `PUT /users/:id/roles` `GET /audit-logs` | `user_role` `audit_log` |

## 5. 明确不进入阶段 A 的模块

以下模块仅保留为后续规划，不在当前页面、接口和数据设计中展开：

- AI 问答助手
- 知识源管理
- 向量检索与召回
- 热门问题推荐
- 高级运营工具
- 高级统计分析
