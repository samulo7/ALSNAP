# 云知通工程说明

## 1. 项目概览

云知通是一个面向内部销售、技术、新员工和内容运营角色的阿里云认知加速平台。

当前仓库处于阶段 `A-04 建立统一编码与提交规范` 完成态，已经具备：

- `Next.js App Router + TypeScript` 前端骨架
- `NestJS + TypeScript` 后端骨架
- `Prisma + PostgreSQL` 数据访问层骨架
- 根目录统一检查入口

当前尚未进入 `A-05 基础数据模型设计`，请在验证完本阶段检查项之前不要继续扩展数据模型范围。

## 2. 目录结构

```text
.
├─ apps/
│  ├─ api/          # NestJS API 骨架
│  └─ web/          # Next.js 学习端/后台前端骨架
├─ packages/
│  └─ database/     # Prisma schema 与数据库访问层
├─ docs/            # 工程化说明、规范与验收记录
├─ memory-bank/     # 长期上下文、计划与进度记录
├─ scripts/         # 根目录校验与仓库级脚本
├─ database-design.md
├─ module-list.md
└─ system-architecture.md
```

## 3. 环境准备

- Node.js `20+`
- npm `10+`
- PostgreSQL `16+`

首次安装依赖：

```bash
npm install
```

## 4. 本地启动

复制环境变量模板：

```bash
copy apps\api\.env.development.example apps\api\.env.development
copy apps\web\.env.development.example apps\web\.env.development
```

启动前端：

```bash
npm run dev:web
```

启动后端：

```bash
npm run dev:api
```

检查 Prisma Client 生成：

```bash
npm run db:generate
```

检查数据库连通性：

```bash
npm run db:check
```

## 5. 统一检查入口

格式检查：

```bash
npm run format:check
```

静态检查：

```bash
npm run lint
npm run typecheck
```

基础测试：

```bash
npm run test
```

提交前最少执行：

```bash
npm run verify
```

`verify` 会顺序执行格式检查、文档结构检查、静态检查、类型检查和基础测试。

## 6. 当前工程约束

- 只在当前实施步骤要求的范围内修改代码，不提前进入下一步
- 命名、错误返回和日志字段统一遵循 [docs/engineering-standards.md](/E:/git/Alisnap/docs/engineering-standards.md)
- 产品范围、学习流程、测验流程和角色路径以 [memory-bank/product-design.md](/E:/git/Alisnap/memory-bank/product-design.md) 为准
- 实施顺序和测试口径以 [memory-bank/implementation-plan.md](/E:/git/Alisnap/memory-bank/implementation-plan.md) 为准

## 7. 已知限制

- Windows 受限沙箱下，`Next.js build` 与 `tsx watch` 可能因为子进程权限出现 `spawn EPERM`
- 如果遇到上述问题，应优先在非沙箱环境复核启动和构建，不要直接将其判定为应用逻辑错误
