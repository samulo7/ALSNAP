const roleCards = [
  {
    title: "学习端入口",
    items: ["销售首页", "技术首页", "新人首页", "访客演示入口"]
  },
  {
    title: "内容域",
    items: ["专题", "产品卡片", "场景", "案例"]
  },
  {
    title: "测验与进度",
    items: ["固定题集", "学习进度", "最近浏览", "错题复习"]
  },
  {
    title: "后台管理",
    items: ["用户与角色", "内容中心", "发布管理", "日志审计"]
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <span className="hero__badge">A-03 前端工程骨架已初始化</span>
        <h1 className="hero__title">云知通</h1>
        <p className="hero__lead">
          当前页面用于验证 `Next.js App Router + TypeScript` 前端骨架已经可启动。后续角色化首页、
          内容中心、测验流程和后台导航都会在这个应用内继续落地。
        </p>
      </section>
      <section className="grid" aria-label="工程骨架模块概览">
        {roleCards.map((card) => (
          <article className="card" key={card.title}>
            <h2>{card.title}</h2>
            <ul>
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

