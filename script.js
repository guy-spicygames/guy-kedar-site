// ============================================================
//  Guy Kedar — interactions
// ============================================================
(function () {
  "use strict";

  /* Video tutorial (6 parts) tab switching */
  var tut = document.getElementById("mondayTut");
  if (tut) {
    var tutVideo = document.getElementById("tutVideo");
    var tutCaption = document.getElementById("tutCaption");
    var tabs = tut.querySelectorAll(".tut-tab");

    /* On mobile: when entering fullscreen, lock orientation to landscape */
    function tryLockLandscape() {
      var so = window.screen && window.screen.orientation;
      if (so && so.lock) {
        so.lock("landscape").catch(function () {});
      }
    }
    function onFsChange() {
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl === tutVideo) {
        tryLockLandscape();
      } else {
        var so = window.screen && window.screen.orientation;
        if (so && so.unlock) { try { so.unlock(); } catch (e) {} }
      }
    }
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    // iOS Safari uses a video-level fullscreen event
    tutVideo.addEventListener("webkitbeginfullscreen", tryLockLandscape);

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        if (tab.disabled) return;
        var src = tab.getAttribute("data-src");
        if (!src) return;
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        tutVideo.pause();
        tutVideo.setAttribute("src", src);
        tutVideo.load();
        if (tutCaption) {
          tutCaption.textContent = "חלק " + (i + 1) + " מתוך 6 · " +
            tab.textContent.replace(/^\d+\s*·\s*/, "").trim();
        }
      });
    });
  }

  /* Sticky header state */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal via IntersectionObserver */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el, i) {
      // slight stagger for grouped items
      el.style.transitionDelay = (i % 4) * 0.07 + "s";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Subtle parallax on hero portrait */
  var portrait = document.querySelector(".hero-portrait img");
  if (portrait && window.matchMedia("(min-width: 981px)").matches) {
    window.addEventListener(
      "mousemove",
      function (e) {
        var x = (e.clientX / window.innerWidth - 0.5) * 14;
        var y = (e.clientY / window.innerHeight - 0.5) * 14;
        portrait.style.transform = "translate(" + x + "px," + y + "px)";
      },
      { passive: true }
    );
  }

  /* Contact form (front-end only) */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.style.color = "var(--accent)";
        status.textContent = "אנא מלאו שם, אימייל תקין והודעה.";
        return;
      }
      status.style.color = "var(--text-dim)";
      status.textContent = "תודה " + name + "! ההודעה נשלחה — אחזור אליך בהקדם.";
      form.reset();
    });
  }

  /* Count-up animation for the metric jump */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        el.textContent = "0" + (el.getAttribute("data-suffix") || "");
        cio.observe(el);
      });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
