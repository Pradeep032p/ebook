/* Shared behaviour for both pages. Reads window.SITE_CONFIG (js/config.js). */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var page = document.body.getAttribute("data-page");

  /* ---------- helpers ---------- */
  function isUrl(v) {
    if (!v || typeof v !== "string") return false;
    v = v.trim();
    if (!v || /^REPLACE_WITH/i.test(v) || /[\[\]]/.test(v)) return false;
    return /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(v) || /^[\w\-./%]+\.[a-z0-9]{2,5}([?#].*)?$/i.test(v);
  }
  function isEmail(v) {
    return typeof v === "string" && /^[^\s@\[\]]+@[^\s@\[\]]+\.[^\s@\[\]]+$/.test(v.trim());
  }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 6500);
  }

  var missing = [];

  /* ---------- text fields ---------- */
  all("[data-price]").forEach(function (el) { el.textContent = cfg.PRICE || "[PRICE]"; });
  all("[data-owner]").forEach(function (el) { el.textContent = cfg.OWNER_NAME || "[YOUR NAME OR BUSINESS NAME]"; });
  all("[data-year]").forEach(function (el) { el.textContent = "2026"; });

  /* ---------- support e-mail ---------- */
  var emailOk = isEmail(cfg.SUPPORT_EMAIL);
  all("[data-support-email]").forEach(function (el) {
    var text = cfg.SUPPORT_EMAIL || "[SUPPORT_EMAIL]";
    el.textContent = text;
    if (emailOk) {
      el.setAttribute("href", "mailto:" + cfg.SUPPORT_EMAIL.trim());
    } else {
      el.removeAttribute("href");
      el.classList.add("is-placeholder");
      el.setAttribute("title", "Set SUPPORT_EMAIL in js/config.js");
    }
  });
  if (!emailOk) missing.push("SUPPORT_EMAIL");

  /* ---------- legal links ---------- */
  [["[data-legal='privacy']", cfg.PRIVACY_URL, "PRIVACY_URL"],
   ["[data-legal='terms']", cfg.TERMS_URL, "TERMS_URL"]].forEach(function (row) {
    var ok = isUrl(row[1]);
    all(row[0]).forEach(function (a) {
      if (ok) {
        a.setAttribute("href", row[1].trim());
      } else {
        a.setAttribute("href", "#");
        a.classList.add("is-placeholder");
        a.setAttribute("title", "Set " + row[2] + " in js/config.js");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          toast("This link is not set yet. Add " + row[2] + " in js/config.js.");
        });
      }
    });
    if (!ok) missing.push(row[2]);
  });

  /* ---------- sales page: every "Get This eBook" button ---------- */
  if (page === "sales") {
    var payOk = isUrl(cfg.PAYMENT_URL);
    all("[data-cta='buy']").forEach(function (a) {
      if (payOk) {
        a.setAttribute("href", cfg.PAYMENT_URL.trim());
        a.setAttribute("rel", "noopener");
      } else {
        a.setAttribute("href", "#config-needed");
        a.classList.add("is-unconfigured");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          toast("Setup needed: the checkout link is not set. Add PAYMENT_URL in js/config.js.");
        });
      }
    });
    if (!payOk) missing.unshift("PAYMENT_URL");
    if (!isUrl(cfg.PRICE) && /[\[\]]/.test(cfg.PRICE || "[PRICE]")) missing.push("PRICE");

    /* sticky buy bar (mobile): appears after the hero, hides near the offer and the final CTA */
    var bar = document.getElementById("sticky-bar");
    var hero = document.getElementById("hero");
    if (bar && hero && "IntersectionObserver" in window) {
      var heroOut = false, inView = {};
      function update() {
        var anyIn = Object.keys(inView).some(function (k) { return inView[k]; });
        bar.classList.toggle("is-visible", heroOut && !anyIn);
      }
      new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; update(); }, { threshold: 0 }).observe(hero);
      var io2 = new IntersectionObserver(function (en) {
        en.forEach(function (e) { inView[e.target.id] = e.isIntersecting; });
        update();
      }, { threshold: 0.15 });
      ["offer", "final"].forEach(function (id) { var n = document.getElementById(id); if (n) io2.observe(n); });
    }
  }

  /* ---------- thank-you page: download button ---------- */
  if (page === "thanks") {
    var btn = document.getElementById("download-btn");
    var ready = document.getElementById("download-ready");
    var notice = document.getElementById("download-missing");
    var noOrder = document.getElementById("no-order");
    var dlOk = isUrl(cfg.EBOOK_DOWNLOAD_URL);

    var param = (cfg.REQUIRE_PURCHASE_PARAM || "").trim();
    var hasParam = true;
    if (param) {
      try { hasParam = !!new URLSearchParams(window.location.search).get(param); }
      catch (e) { hasParam = false; }
    }

    if (!hasParam) {
      if (ready) ready.hidden = true;
      if (noOrder) noOrder.hidden = false;
    } else if (dlOk) {
      btn.setAttribute("href", cfg.EBOOK_DOWNLOAD_URL.trim());
      btn.setAttribute("download", "100-Non-Negotiable-Rules-for-Men.pdf");
      btn.setAttribute("rel", "noopener");
    } else {
      btn.setAttribute("href", "#config-needed");
      btn.classList.add("is-unconfigured");
      btn.setAttribute("aria-disabled", "true");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toast("Setup needed: the download link is not set. Add EBOOK_DOWNLOAD_URL in js/config.js.");
      });
      if (notice) notice.hidden = false;
      missing.unshift("EBOOK_DOWNLOAD_URL");
    }
  }

  /* ---------- visible setup banner (only while something is still missing) ---------- */
  var critical = page === "sales" ? "PAYMENT_URL" : "EBOOK_DOWNLOAD_URL";
  if (missing.length) {
    var b = document.createElement("div");
    b.className = "devbar";
    b.setAttribute("role", "note");
    b.innerHTML = "<strong>SETUP NEEDED</strong> (visitors will not see this once the values are set): " +
      "edit <code>js/config.js</code> &rarr; " + missing.join(", ");
    document.body.insertBefore(b, document.body.firstChild);
    if (missing.indexOf(critical) === -1) b.classList.add("devbar--minor");
  }
})();
