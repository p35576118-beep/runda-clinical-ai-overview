(function createClinicalAiOverview() {
  "use strict";

  const printButton = document.querySelector("[data-print]");
  const revealTargets = [...document.querySelectorAll("[data-reveal]")];
  const sections = [...document.querySelectorAll("[data-section]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  if (printButton) printButton.addEventListener("click", () => window.print());

  function alignCurrentHash() {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    const headerHeight = document.querySelector("[data-header]")?.getBoundingClientRect().height || 68;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo(0, Math.max(0, targetY));
  }

  function settleCurrentHash() {
    alignCurrentHash();
    window.requestAnimationFrame(alignCurrentHash);
    window.setTimeout(alignCurrentHash, 180);
    window.setTimeout(alignCurrentHash, 720);
    if (document.fonts?.ready) document.fonts.ready.then(alignCurrentHash);
  }

  if (window.location.hash) {
    window.addEventListener("load", settleCurrentHash, { once: true });
  }
  window.addEventListener("hashchange", settleCurrentHash);

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  if ("IntersectionObserver" in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5] });
    sections.forEach((section) => navObserver.observe(section));
  }
})();
