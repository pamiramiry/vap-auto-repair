/* VAP Auto Repairs. Small, dependency-free behaviour for the one-page site. */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHONE = "(647) 710-0734";

  /* ---------- header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav && header) {
    var setOpen = function (open) {
      if (open) doc.style.setProperty("--nav-top", header.getBoundingClientRect().bottom + "px");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    doc.classList.add("js-reveal");
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- image slots: show the designed fallback until real photos are in images/ ---------- */
  document.querySelectorAll(".frame img").forEach(function (img) {
    var frame = img.closest(".frame");
    var miss = function () { frame.classList.add("is-missing"); };
    if (img.complete && img.naturalWidth === 0) miss();
    img.addEventListener("error", miss);
  });

  /* ---------- live open / closed status (shop time, not visitor time) ---------- */
  // Hours in 24h shop time. Index = day of week, 0 = Sunday.
  var HOURS = [null, [9, 19], [9, 19], [9, 19], [9, 19], [9, 19], [9, 17]];
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var fmt = function (h) { return (h > 12 ? h - 12 : h) + (h >= 12 ? " PM" : " AM"); };
  var shopNow = function () {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
    }).formatToParts(new Date());
    var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ""; };
    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday").slice(0, 3)),
      mins: (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10)
    };
  };
  var describe = function (now) {
    var today = HOURS[now.day];
    if (today && now.mins >= today[0] * 60 && now.mins < today[1] * 60) {
      return { open: true, text: "Open now · until " + fmt(today[1]) + " today" };
    }
    if (today && now.mins < today[0] * 60) {
      return { open: false, text: "Closed now · opens " + fmt(today[0]) + " today" };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) {
        return { open: false, text: "Closed now · opens " + (i === 1 ? "tomorrow" : DAYS[d]) + " at " + fmt(HOURS[d][0]) };
      }
    }
    return { open: false, text: "" };
  };
  var paintStatus = function () {
    try {
      var now = shopNow();
      if (now.day < 0) return;
      var s = describe(now);
      document.querySelectorAll("[data-status]").forEach(function (el) {
        el.classList.toggle("is-open", s.open);
        el.classList.toggle("is-closed", !s.open);
        var t = el.querySelector(".status__text");
        if (t) t.textContent = s.text;
      });
      var sub = document.querySelector(".float-card--status .float-card__sub");
      if (sub) {
        sub.textContent = s.open
          ? "Call now and we'll tell you when to bring it in."
          : "Send a quote request and we'll call you first thing.";
      }
      var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
      if (row && !row.classList.contains("is-today")) {
        row.classList.add("is-today");
        row.querySelector("th").insertAdjacentHTML("beforeend", ' <span class="visually-hidden">(today)</span>');
      }
    } catch (err) { /* the static hours still read fine */ }
  };
  paintStatus();
  window.setInterval(paintStatus, 60000);

  /* ---------- load the map only when it's near the viewport ---------- */
  var mapFrame = document.querySelector(".map__frame[data-src]");
  if (mapFrame) {
    var loadMap = function () {
      mapFrame.setAttribute("src", mapFrame.getAttribute("data-src"));
      mapFrame.removeAttribute("data-src");
    };
    if ("IntersectionObserver" in window) {
      var mapObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadMap(); mapObs.disconnect(); }
      }, { rootMargin: "300px 0px" });
      mapObs.observe(mapFrame.parentElement);
    } else {
      loadMap();
    }
  }

  /* ---------- quote form ---------- */
  var form = document.getElementById("quote");
  if (form) {
    var status = form.querySelector(".quote-form__status");
    var button = form.querySelector('button[type="submit"]');
    var say = function (kind, msg) { status.className = "quote-form__status is-" + kind; status.textContent = msg; };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.checkValidity();
        field.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstBad) firstBad = field;
      });
      if (firstBad) {
        say("error", "Please fill in the highlighted fields so we can get back to you.");
        firstBad.focus();
        return;
      }

      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        // No form service connected yet: be honest rather than pretend it was sent.
        say("info", "Online quotes are being set up. For now, please call " + PHONE + " and we'll help you straight away.");
        return;
      }

      button.disabled = true;
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("bad status");
          say("success", "Thanks, we've got it. We'll be in touch during shop hours. Need it sooner? Call " + PHONE + ".");
          form.reset();
          form.querySelectorAll("[aria-invalid]").forEach(function (f) { f.removeAttribute("aria-invalid"); });
        })
        .catch(function () {
          say("error", "That didn't go through. Please call " + PHONE + " instead.");
        })
        .then(function () { button.disabled = false; });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
