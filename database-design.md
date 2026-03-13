# 云知通数据库设计基线

## 1. 文档目的

本文用于定义阶段 A 的最小数据实体、关键字段和实体关系，保证后续 schema、迁移和接口设计使用一致命名。

## 2. 设计边界

### 2.1 仅覆盖阶段 A 基础功能

- 用户与角色
- 内容专题、产品卡片、场景、案例
- 内容发布状态
- 学习进度与最近浏览
- 固定题集测验与错题
- 用户行为日志与后台审计日志

### 2.2 暂不进入的数据范围

- 知识源导入
- 文档切片与向量数据
- AI 问答记录
- 推荐特征与画像标签
- 复杂统计宽表

## 3. 实体总览

| 实体名 | 中文名 | 用途 |
| --- | --- | --- |
| `user` | 用户 | 系统账号主体 |
| `role` | 角色 | RBAC 角色定义 |
| `user_role` | 用户角色关系 | 一个用户可拥有多个角色 |
| `topic` | 专题 | 七大件、百炼、基础概念、区域专题等内容 |
| `product_card` | 产品卡片 | 产品图谱中的产品内容卡片 |
| `scenario` | 场景 | 按客户问题组织的场景内容 |
| `case_item` | 案例 | 区域案例模板内容 |
| `content_release` | 内容发布记录 | 草稿、已发布、已下线及发布人信息 |
| `quiz_set` | 题集 | 关联专题或场景的固定题集 |
| `quiz_question` | 题目 | 单选题、多选题题目 |
| `quiz_option` | 选项 | 题目选项与正确答案标记 |
| `quiz_attempt` | 作答记录 | 一次完整答题提交 |
| `quiz_answer` | 作答明细 | 某次作答下每道题的答案 |
| `learning_progress` | 学习进度 | 浏览、完成、最近学习信息 |
| `audit_log` | 后台审计日志 | 创建、编辑、发布、下线、角色变更 |
| `activity_log` | 用户行为日志 | 登录、浏览、答题、完成学习 |

## 4. 核心实体设计

### 4.1 账号与权限域

#### `user`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `username` | varchar(64) | 登录名，唯一 |
| `display_name` | varchar(64) | 展示名称 |
| `email` | varchar(128) nullable | 邮箱 |
| `phone` | varchar(32) nullable | 手机号 |
| `status` | varchar(16) | `active` `disabled` |
| `auth_source` | varchar(32) | `local` `wechat_work` `dingtalk` |
| `last_login_at` | timestamptz nullable | 最近登录时间 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `role`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `code` | varchar(32) | 唯一编码，如 `admin` `operator` `sales` |
| `name` | varchar(32) | 角色名称 |
| `scope` | varchar(32) | `frontend` `backend` `shared` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `user_role`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `user_id` | uuid | 关联 `user.id` |
| `role_id` | uuid | 关联 `role.id` |
| `assigned_by` | uuid nullable | 关联 `user.id`，记录分配人 |
| `assigned_at` | timestamptz | 分配时间 |

### 4.2 内容域

#### `topic`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `slug` | varchar(128) | 前台路由标识，唯一 |
| `title` | varchar(200) | 标题 |
| `summary` | varchar(500) | 摘要 |
| `body_markdown` | text | 正文 |
| `topic_type` | varchar(32) | `general` `seven-pack` `bailian` `regional` |
| `role_scope` | jsonb | 适用角色列表 |
| `tags` | jsonb | 标签列表 |
| `status` | varchar(16) | 内容状态，和 `content_release` 保持一致 |
| `published_at` | timestamptz nullable | 发布时间 |
| `created_by` | uuid | 关联 `user.id` |
| `updated_by` | uuid | 关联 `user.id` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `product_card`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `slug` | varchar(128) | 前台路由标识，唯一 |
| `name` | varchar(128) | 产品名称 |
| `summary` | varchar(500) | 摘要 |
| `body_markdown` | text | 正文 |
| `category` | varchar(32) | `compute` `storage` `network` `security` `database` `ai` |
| `problem_statement` | text | 解决什么问题 |
| `sales_pitch` | text | 销售怎么讲 |
| `technical_notes` | text | 技术要点 |
| `related_products` | jsonb | 关联产品列表 |
| `regional_customer_types` | jsonb | 东北客户类型列表 |
| `role_scope` | jsonb | 适用角色列表 |
| `tags` | jsonb | 标签列表 |
| `status` | varchar(16) | 内容状态 |
| `published_at` | timestamptz nullable | 发布时间 |
| `created_by` | uuid | 关联 `user.id` |
| `updated_by` | uuid | 关联 `user.id` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `scenario`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `slug` | varchar(128) | 前台路由标识，唯一 |
| `title` | varchar(200) | 标题 |
| `summary` | varchar(500) | 摘要 |
| `customer_pain_points` | text | 客户痛点 |
| `recommended_combo` | text | 推荐产品组合 |
| `combination_reason` | text | 搭配原因 |
| `value_message` | text | 价值表达 |
| `risk_boundary` | text | 风险与边界 |
| `regional_challenges` | text | 东北落地难点 |
| `industry_tags` | jsonb | 行业标签 |
| `customer_type_tags` | jsonb | 客户类型标签 |
| `role_scope` | jsonb | 适用角色列表 |
| `status` | varchar(16) | 内容状态 |
| `published_at` | timestamptz nullable | 发布时间 |
| `created_by` | uuid | 关联 `user.id` |
| `updated_by` | uuid | 关联 `user.id` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `case_item`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `slug` | varchar(128) | 前台路由标识，唯一 |
| `title` | varchar(200) | 标题 |
| `summary` | varchar(500) | 摘要 |
| `customer_type` | varchar(64) | 客户类型 |
| `region` | varchar(64) | 所属区域 |
| `original_pain_points` | text | 原始痛点 |
| `recommended_combo` | text | 推荐组合 |
| `includes_ai` | boolean | 是否涉及 AI |
| `implementation_challenges` | text | 实施难点 |
| `business_value` | text | 业务价值 |
| `reusable_pitch` | text | 可复用话术 |
| `desensitization_note` | text | 脱敏说明 |
| `industry_tags` | jsonb | 行业标签 |
| `role_scope` | jsonb | 适用角色列表 |
| `status` | varchar(16) | 内容状态 |
| `published_at` | timestamptz nullable | 发布时间 |
| `created_by` | uuid | 关联 `user.id` |
| `updated_by` | uuid | 关联 `user.id` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `content_release`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `content_type` | varchar(32) | `topic` `product_card` `scenario` `case_item` |
| `content_id` | uuid | 对应内容主键 |
| `status` | varchar(16) | `draft` `published` `unpublished` |
| `submitted_by` | uuid nullable | 提交发布人 |
| `published_by` | uuid nullable | 发布人 |
| `published_at` | timestamptz nullable | 发布时间 |
| `unpublished_by` | uuid nullable | 下线人 |
| `unpublished_at` | timestamptz nullable | 下线时间 |
| `note` | varchar(500) nullable | 备注 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### 4.3 测验与学习域

#### `quiz_set`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `title` | varchar(200) | 题集名称 |
| `summary` | varchar(500) | 题集说明 |
| `target_type` | varchar(32) | `topic` `scenario` |
| `target_id` | uuid | 关联专题或场景 |
| `role_scope` | jsonb | 适用角色列表 |
| `question_count` | integer | 题目数缓存 |
| `status` | varchar(16) | `draft` `published` `unpublished` |
| `created_by` | uuid | 关联 `user.id` |
| `updated_by` | uuid | 关联 `user.id` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `quiz_question`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `quiz_set_id` | uuid | 关联 `quiz_set.id` |
| `question_type` | varchar(16) | `single` `multiple` |
| `stem` | text | 题干 |
| `analysis` | text | 题目解析 |
| `display_order` | integer | 显示顺序 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `quiz_option`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `question_id` | uuid | 关联 `quiz_question.id` |
| `label` | varchar(8) | 选项标识，如 `A` `B` |
| `content` | text | 选项内容 |
| `is_correct` | boolean | 是否正确答案 |
| `display_order` | integer | 显示顺序 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `quiz_attempt`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `quiz_set_id` | uuid | 关联 `quiz_set.id` |
| `user_id` | uuid | 关联 `user.id` |
| `score` | numeric(5,2) | 得分 |
| `correct_count` | integer | 答对题数 |
| `wrong_count` | integer | 答错题数 |
| `submitted_at` | timestamptz | 提交时间 |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `quiz_answer`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `attempt_id` | uuid | 关联 `quiz_attempt.id` |
| `question_id` | uuid | 关联 `quiz_question.id` |
| `selected_option_ids` | jsonb | 用户选择的选项 ID 列表 |
| `is_correct` | boolean | 本题是否答对 |
| `mastery_status` | varchar(16) | `unmastered` `mastered` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

#### `learning_progress`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `user_id` | uuid | 关联 `user.id` |
| `content_type` | varchar(32) | `topic` `product_card` `scenario` `case_item` |
| `content_id` | uuid | 对应内容主键 |
| `view_count` | integer | 浏览次数 |
| `last_viewed_at` | timestamptz nullable | 最近浏览时间 |
| `is_completed` | boolean | 是否标记完成 |
| `completed_at` | timestamptz nullable | 完成时间 |
| `pass_status` | varchar(16) | `not_started` `in_progress` `passed` |
| `created_at` | timestamptz | 创建时间 |
| `updated_at` | timestamptz | 更新时间 |

### 4.4 日志域

#### `audit_log`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `actor_user_id` | uuid | 操作者 |
| `action_type` | varchar(32) | `create` `update` `publish` `unpublish` `assign_role` `disable_user` |
| `target_type` | varchar(32) | 目标对象类型 |
| `target_id` | uuid | 目标对象主键 |
| `detail_json` | jsonb | 变更详情 |
| `created_at` | timestamptz | 创建时间 |

#### `activity_log`

| 字段 | 类型建议 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `actor_user_id` | uuid | 行为用户 |
| `action_type` | varchar(32) | `login` `view_content` `complete_content` `submit_quiz` |
| `target_type` | varchar(32) nullable | 内容或题集类型 |
| `target_id` | uuid nullable | 内容或题集主键 |
| `detail_json` | jsonb | 行为详情 |
| `created_at` | timestamptz | 创建时间 |

## 5. 核心关系

- `user` 与 `role` 通过 `user_role` 建立多对多关系
- `topic`、`product_card`、`scenario`、`case_item` 都通过 `content_release` 管理发布状态
- `quiz_set` 通过 `target_type + target_id` 关联到 `topic` 或 `scenario`
- `quiz_question` 从属于 `quiz_set`
- `quiz_option` 从属于 `quiz_question`
- `quiz_attempt` 从属于 `user` 和 `quiz_set`
- `quiz_answer` 从属于 `quiz_attempt` 和 `quiz_question`
- `learning_progress` 通过 `content_type + content_id` 指向四类内容
- `audit_log` 与 `activity_log` 均通过 `actor_user_id` 指向 `user`

## 6. 模块到实体映射

| 模块名称 | 依赖实体 |
| --- | --- |
| 鉴权与角色 | `user` `role` `user_role` |
| 学习首页 | `learning_progress` `quiz_set` |
| 内容中心 | `topic` `product_card` `scenario` `case_item` `content_release` |
| 产品图谱 | `product_card` |
| 七大件专区 | `topic` |
| 百炼专区 | `topic` |
| 场景中心 | `scenario` |
| 案例库 | `case_item` |
| 测验中心 | `quiz_set` `quiz_question` `quiz_option` `quiz_attempt` `quiz_answer` |
| 学习进度 | `learning_progress` |
| 个人中心 | `learning_progress` `quiz_attempt` `quiz_answer` |
| 后台与审计 | `user` `user_role` `audit_log` `activity_log` |

## 7. 基础需求映射

| 基础需求 | 涉及实体 |
| --- | --- |
| 销售登录并进入销售首页 | `user` `role` `user_role` `activity_log` |
| 浏览七大件专题 | `topic` `content_release` `learning_progress` `activity_log` |
| 浏览产品卡片 | `product_card` `content_release` `learning_progress` `activity_log` |
| 浏览场景与案例 | `scenario` `case_item` `content_release` `learning_progress` |
| 完成一次测验 | `quiz_set` `quiz_question` `quiz_option` `quiz_attempt` `quiz_answer` |
| 查看错题记录 | `quiz_attempt` `quiz_answer` |
| 运营创建内容并提交发布 | `topic` `product_card` `scenario` `case_item` `content_release` `audit_log` |
| 管理员分配角色并查看日志 | `user_role` `audit_log` |

## 8. 后续阶段预留原则

- 不在阶段 A 的表中提前加入向量字段、embedding 字段或知识源切片字段
- 如需未来扩展 AI 问答，新增独立实体，不污染 `quiz_*` 或 `learning_progress`
- `detail_json` 与 `tags` 只承载辅助扩展信息，不替代明确业务字段
