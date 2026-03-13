# A-03 工程骨架验证记录

## 1. 验证目标

对应 `memory-bank/implementation-plan.md` 中 `A-03 初始化前后端工程骨架` 的四项测试：

- 前端项目可以启动到默认首页
- 后端项目可以启动并暴露健康检查接口
- 数据库访问层可以完成一次连通性检查
- 新成员只看目录结构就能区分前端、后端、数据库和文档位置

## 2. 沙箱问题与解决方式

在 Windows 沙箱环境下，`Next.js build` 和 `tsx` 会因为子进程创建被限制而报 `spawn EPERM`。这属于执行环境限制，不是当前工程骨架的代码错误。

验证 `A-03` 时采用以下方式：

- 前端构建与启动：在非沙箱环境执行
- 后端健康检查：使用编译后的 `dist/main.js` 在独立端口启动并探活
- 数据库检查：启动临时本地 PostgreSQL 容器后，设置 `DATABASE_URL` 执行 `db:check`

## 3. 实际验证结果

### 3.1 前端默认首页

- 构建命令：`npm run build:web`
- 结果：通过
- 说明：`Next.js` 生产构建成功，默认首页路由 `/` 已生成

### 3.2 后端健康检查

- 构建命令：`npm run build:api`
- 探活方式：启动 `apps/api/dist/main.js`，访问 `http://127.0.0.1:4010/health`
- 结果：通过
- 返回结果：`{"service":"alisnap-api","status":"ok","timestamp":"..."}`

### 3.3 数据库连通性检查

- 数据库：临时本地 `PostgreSQL 16` 容器
- 检查命令：`npm run db:check`
- 结果：通过
- 检查内容：执行 `SELECT 1 AS result`

### 3.4 目录结构可辨识性

以下目录职责已经明确：

- `apps/web`：前端应用
- `apps/api`：后端应用
- `packages/database`：数据库访问层
- `docs/`：工程文档与验收记录
- `memory-bank/`：长期上下文与过程记录

## 4. 结论

`A-03` 的四项测试已闭合，可以进入 `A-04 建立统一编码与提交规范`。
