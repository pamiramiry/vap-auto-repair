/* VAP Auto Repairs. Small, dependency-free behaviour for the one-page site. */
(function () {
  "use strict";

  var PHONE = "(647) 710-0734";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- the work order: tap a concern and the order fills in ---------- */
  var order = document.querySelector("[data-order]");
  if (order) {
    var out = order.querySelector("[data-concern-out]");
    var issue = document.getElementById("q-issue");
    order.addEventListener("change", function (e) {
      if (e.target.name !== "concern") return;
      var label = e.target.nextElementSibling.textContent;
      out.textContent = label;
      out.classList.remove("is-filled");
      void out.offsetWidth; // restart the ink animation
      out.classList.add("is-filled");
      if (issue && (!issue.value || issue.dataset.fromOrder === "true")) {
        issue.value = label + ". ";
        issue.dataset.fromOrder = "true";
      }
    });
    if (issue) issue.addEventListener("input", function () { issue.dataset.fromOrder = "false"; });
  }

  /* ---------- section entrances: parts arrive in reading order, once ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-pic, .reveal-slip, .reveal-note");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var group = el.closest(".reveal-group, .slips");
        if (group) {
          var siblings = Array.prototype.filter.call(group.querySelectorAll(".reveal, .reveal-note"), function (n) {
            return n.closest(".reveal-group, .slips") === group;
          });
          el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 80 + "ms";
        }
        el.classList.add("is-in");
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    var picObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        proxies.get(entry.target).classList.add("is-in");
        picObs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    // A picture clipped shut has no visible area, so watch its frame instead and open it from there.
    var proxies = new Map();
    revealEls.forEach(function (el) {
      if (!el.classList.contains("reveal-pic")) { obs.observe(el); return; }
      var probe = document.createElement("span");
      probe.className = "pic__probe";
      probe.setAttribute("aria-hidden", "true");
      el.parentNode.insertBefore(probe, el);
      proxies.set(probe, el);
      picObs.observe(probe);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- fit the giant word exactly to its column ---------- */
  var giant = document.querySelector(".giant span");
  if (giant) {
    var fit = function () {
      giant.style.fontSize = "";
      var col = giant.parentElement.clientWidth;
      var w = giant.scrollWidth;
      if (col && w) giant.style.fontSize = (parseFloat(getComputedStyle(giant).fontSize) * col / w) + "px";
    };
    giant.style.display = "inline-block";
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); else fit();
    window.addEventListener("resize", fit);
  }

  /* ---------- pictures: keep the shop drawing when a photo file is missing ---------- */
  document.querySelectorAll(".pic img").forEach(function (img) {
    var pic = img.closest(".pic");
    var miss = function () { pic.classList.add("is-missing"); };
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
      return { open: true, text: "Open now, until " + fmt(today[1]) };
    }
    if (today && now.mins < today[0] * 60) {
      return { open: false, text: "Closed, opens " + fmt(today[0]) + " today" };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (HOURS[d]) return { open: false, text: "Closed, opens " + (i === 1 ? "tomorrow" : DAYS[d]) + " at " + fmt(HOURS[d][0]) };
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
      document.querySelectorAll(".hours tr[data-days]").forEach(function (row) {
        var r = row.getAttribute("data-days").split("-").map(Number);
        var hit = r.length === 2 ? now.day >= r[0] && now.day <= r[1] : now.day === r[0];
        row.classList.toggle("is-today", hit);
      });
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
    var status = form.querySelector(".reply-card__status");
    var button = form.querySelector('button[type="submit"]');
    var say = function (kind, msg) { status.className = "reply-card__status is-" + kind; status.textContent = msg; };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.checkValidity();
        field.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !firstBad) firstBad = field;
      });
      if (firstBad) {
        say("error", "Please fill in the highlighted fields so we can call you back.");
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
          say("success", "Thanks, we've got it. We'll call you during shop hours. Need it sooner? Call " + PHONE + ".");
          form.reset();
          form.querySelectorAll("[aria-invalid]").forEach(function (f) { f.removeAttribute("aria-invalid"); });
        })
        .catch(function () { say("error", "That didn't go through. Please call " + PHONE + " instead."); })
        .then(function () { button.disabled = false; });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
