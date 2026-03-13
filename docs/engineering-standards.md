# 工程规范

## 1. 适用范围

本规范用于约束阶段 A 的前后端骨架、数据库访问层和仓库级脚本，目标是统一命名、错误处理和日志结构，避免后续实现各自发散。

## 2. 命名规范

### 2.1 TypeScript 与 React / NestJS

- 变量、函数、普通对象字段统一使用 `camelCase`
- 组件、类、接口、类型、枚举统一使用 `PascalCase`
- 常量和环境变量统一使用 `UPPER_SNAKE_CASE`
- 文件名优先使用 `kebab-case`；只有类文件紧贴框架约定时，允许保留框架常见形式

### 2.2 API 与模块命名

- 路由路径使用小写英文和 `kebab-case`
- 模块、控制器、服务、DTO、实体命名必须复用 `system-architecture.md`、`database-design.md`、`module-list.md` 中已经确定的术语
- 不允许为同一业务对象再造第二套叫法，例如“专题 / 文章 / 课程”混用

### 2.3 数据库命名

- Prisma 模型名使用 `PascalCase`
- 代码字段名使用 `camelCase`
- 数据库表名、列名使用 `snake_case`
- 通过 Prisma 的 `@@map` / `@map` 保持“代码 camelCase、数据库 snake_case”的统一映射

## 3. HTTP 返回约定

### 3.1 成功返回

后端接口统一返回以下包结构：

```json
{
  "success": true,
  "timestamp": "2026-03-14T00:00:00.000Z",
  "traceId": "req-123",
  "data": {}
}
```

### 3.2 错误返回

后端接口统一返回以下包结构：

```json
{
  "success": false,
  "timestamp": "2026-03-14T00:00:00.000Z",
  "traceId": "req-123",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Unexpected error"
  }
}
```

约束如下：

- `traceId` 必须贯穿请求处理和错误返回
- `error.code` 使用稳定、可检索的全大写枚举值
- `message` 面向调用方可读，但不得泄露密钥、连接串或内部堆栈
- `details` 仅在需要时返回可公开的补充信息

## 4. 日志字段规范

所有结构化日志至少包含以下字段：

- `timestamp`
- `level`
- `service`
- `action`
- `traceId`
- `actorId`
- `targetType`
- `targetId`
- `message`

可选字段：

- `context`

字段说明：

- `service`：服务名，例如 `alisnap-api`
- `action`：稳定动作标识，例如 `app.bootstrap`、`http.request.failed`
- `actorId`：操作者标识；匿名请求统一写 `anonymous`
- `targetType`：目标对象类型，例如 `http.request`、`user`、`content-topic`
- `targetId`：目标对象 ID；如果没有实体 ID，可写路径或语义主键
- `context`：补充上下文，只放可观测信息，不放敏感数据

## 5. 错误处理约定

- 控制器不直接拼接临时错误结构，统一走公共错误返回工具
- 未识别异常默认归一化为 `500 / INTERNAL_SERVER_ERROR`
- 框架异常和业务异常都必须落到统一错误包结构
- 错误日志优先记录 `traceId`、动作、对象和状态码，而不是直接输出松散文本

## 6. 本地检查约定

提交前最少执行：

```bash
npm run verify
```

如果某一步失败：

- 先修复当前步骤问题
- 重新执行失败命令
- 在当前步骤验证通过前，不进入下一实施步骤
