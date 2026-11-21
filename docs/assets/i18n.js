// English / Simplified Chinese for the home and gallery pages.
// English stays in the HTML; elements with data-i18n="key" get the Chinese text from ZH.
// Template pages are generated in both languages at build time (t/<id>.html, t/<id>.zh.html).
(() => {
  const ZH = {
    "nav.templates": "模板",
    "nav.spec": "动效规范",
    "hero.title": '让 AI 照着做动效，<br><span class="hl">而不是瞎猜。</span>',
    "hero.lede": "覆盖 11 个动画库的实时模板。每个都附带提示词、源码，以及改编它所需的规则。",
    "hero.browse": "浏览模板",
    "hero.meta": "<span><b>29</b> 个模板</span><span><b>11</b> 个动画库</span><span><b>1</b> 份动效规范</span>",
    "stacks.title": "选一个技术栈",
    "stacks.lede": "每张卡片都在实时运行，点开查看对应的模板。",
    "stacks.all": "全部模板 →",
    "card.spec": "动效规范",
    "card.gif": "导出",
    "card.scroll": "CSS 滚动驱动",
    "closing.title": "每一帧都检查过的动效。",
    "closing.lede": "每个模板上线前都在真实浏览器里测试过。如果它帮你省了时间，点个 Star 能让更多人看到它。",
    "closing.star": "在 GitHub 上点 Star",
    "foot.note": "MIT 许可 · 适用于 Claude Code、Codex、Cursor 以及任何读取 SKILL.md 的 Agent",
    "foot.templates": "模板",
    "foot.spec": "动效规范",
    "foot.docs": "文档",
    "foot.credits": "致谢",
    "foot.home": "首页",
    "foot.checked": "MIT 许可 · 每个模板都在真实浏览器里检查过",
    "gallery.title": "模板",
    "gallery.lede": "精选模板，实时运行。点开查看提示词、源码和改编方法。",
    "gallery.everything": "全部模板",
  };
  const root = document.documentElement;
  const store = { get() { try { return localStorage.getItem("lang"); } catch { return null; } }, set(v) { try { localStorage.setItem("lang", v); } catch {} } };
  window.LANG = () => (root.lang === "zh-CN" ? "zh" : "en");

  function apply() {
    const zh = LANG() === "zh";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const v = ZH[el.dataset.i18n];
      el.innerHTML = zh && v ? v : el.dataset.en;
    });
    document.querySelectorAll(".lang-toggle .label").forEach((l) => (l.textContent = zh ? "EN" : "中"));
    document.querySelectorAll(".lang-toggle").forEach((b) => b.setAttribute("aria-label", zh ? "Switch to English" : "切换到简体中文"));
  }
  window.setLang = (l) => {
    store.set(l);
    // Template pages exist as two files: go to the other one
    const alt = document.querySelector(`link[rel="alternate"][hreflang="${l === "zh" ? "zh-CN" : "en"}"]`);
    if (alt && document.body.dataset.static === "true") { location.href = alt.getAttribute("href"); return; }
    root.lang = l === "zh" ? "zh-CN" : "en";
    apply();
    dispatchEvent(new CustomEvent("langchange", { detail: l }));
  };
  document.addEventListener("click", (e) => { if (e.target.closest(".lang-toggle")) setLang(LANG() === "zh" ? "en" : "zh"); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
})();
