// Shared page behaviour: theme toggle, nav border on scroll, copy helpers.
// The theme itself is set before first paint by the inline snippet in each page's <head>.
(() => {
  const root = document.documentElement;
  const store = { get() { try { return localStorage.getItem("theme"); } catch { return null; } },
                  set(v) { try { localStorage.setItem("theme", v); } catch {} } };
  window.setTheme = (t) => {
    root.dataset.theme = t; store.set(t);
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest(".theme-toggle")) setTheme(root.dataset.theme === "light" ? "dark" : "light");
  });
  // Follow the OS while the visitor hasn't picked a theme
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => { if (!store.get()) { root.dataset.theme = e.matches ? "light" : "dark"; dispatchEvent(new CustomEvent("themechange")); } });

  const nav = document.querySelector(".nav");
  if (nav) { const f = () => nav.classList.toggle("scrolled", scrollY > 8); addEventListener("scroll", f, { passive: true }); f(); }

  let toast;
  window.say = (msg) => {
    toast ??= Object.assign(document.body.appendChild(document.createElement("div")), { className: "toast", role: "status" });
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove("show"), 1600);
  };
  window.copyText = async (text, label = "Copied") => {
    const zh = document.documentElement.lang === "zh-CN";
    try { await navigator.clipboard.writeText(text); say(zh ? `已复制${label}` : `${label} copied`); } catch { say(zh ? "浏览器阻止了复制" : "Copy blocked by the browser"); }
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy-text]");
    if (b) copyText(b.dataset.copyText, b.dataset.copyLabel || (document.documentElement.lang === "zh-CN" ? "安装命令" : "Install command"));
  });
})();
