(function () {
  var C = window.CONTENT;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; };

  function videoEmbed(id) {
    return '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id || C.videoId) +
      '" title="ADVCOM video presentation" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  }
  $("#hero-video").innerHTML = '<iframe src="' + esc(C.cv) + '" title="Curriculum vitae of ' + esc(C.student) + '"></iframe>';
  $("#hero-cv-link").href = C.cv;

  /* Accordion */
  $("#accordion").innerHTML = C.modules.map(function (m, i) {
    return '<article class="mod t' + i + '" style="top:' + (84 + i * 14) + 'px">' +
      '<div class="pillbar"><b>' + esc(m.label) + '</b><span class="big">0' + (i + 1) + '</span></div>' +
      '<h3>' + esc(m.title) + '</h3>' +
      '<div class="body"><div><h4>Key Concepts &amp; Skills</h4><ul>' +
      m.concepts.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + '</ul></div>' +
      '<div><h4>Real-World Business Application</h4><div class="callout">' + esc(m.application) + '</div></div></div></article>';
  }).join("");

  /* Cards + filters */
  var cards = $("#cards");
  cards.innerHTML = C.works.map(function (w) {
    return '<button class="card reveal" data-id="' + w.id + '" data-f="' + w.filter.join(" ") + '" aria-haspopup="dialog">' +
      '<span class="num">' + w.num + '</span><h3>' + esc(w.title) + '</h3>' +
      '<span><span class="tag">' + esc(w.module) + '</span><span class="tag">' + esc(w.type) + '</span></span>' +
      '<p>' + esc(w.summary) + '</p><span class="more">Open case study →</span></button>';
  }).join("");

  document.querySelectorAll(".chip").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.f;
      document.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      cards.querySelectorAll(".card").forEach(function (c) {
        c.hidden = !(f === "all" || c.dataset.f.split(" ").indexOf(f) > -1);
      });
    });
  });

  /* Modal */
  var modal = $("#modal"), box = $(".modal-box"), lastFocus = null;
  function preview(w) {
    if (w.video || w.videoId) return '<div class="video">' + videoEmbed(w.videoId) + "</div>";
    if (!w.original) return "";
    if (/\.pdf(#.*)?$/i.test(w.original)) return '<div class="preview"><iframe src="' + esc(w.original) + '" title="Original submission"></iframe><p><a href="' + esc(w.original) + '">View original</a></p></div>';
    return '<div class="preview"><img src="' + esc(w.original) + '" alt="Original submission for ' + esc(w.title) + '"><p><a href="' + esc(w.original) + '">View original</a></p></div>';
  }
  function openModal(id) {
    var w = C.works.filter(function (x) { return x.id === id; })[0];
    if (!w) return;
    lastFocus = document.activeElement;
    var r = w.reflection;
    $("#m-body").innerHTML =
      '<span class="badge">' + esc(w.module) + " · " + esc(w.type) + "</span>" +
      '<h2 id="m-title">' + esc(w.title) + "</h2><p>" + esc(w.summary) + "</p>" +
      '<p><strong>Lesson highlight:</strong> ' + esc(w.lesson) + "</p>" + preview(w) +
      '<div class="role"><strong>My role &amp; contribution.</strong> ' + esc(w.role) + "</div>" +
      '<div class="refl">' +
      '<div><h4>1 · Written &amp; oral skill growth</h4><p>' + esc(r.skill) + "</p></div>" +
      '<div><h4>2 · Feedback &amp; iteration</h4><p>' + esc(r.feedback) + "</p></div>" +
      '<div><h4>3 · Business &amp; entrepreneurship takeaway</h4><p>' + esc(r.business) + "</p></div></div>";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    box.focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    $("#m-body").innerHTML = ""; /* stops video playback */
    if (lastFocus) lastFocus.focus();
  }
  cards.addEventListener("click", function (e) {
    var c = e.target.closest(".card");
    if (c) openModal(c.dataset.id);
  });
  modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") return closeModal();
    if (e.key === "Tab") {
      var f = box.querySelectorAll('button,a[href],iframe,summary,[tabindex="0"]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === box)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Compare tabs */
  var tabs = $("#cmp-tabs"), cmp = $("#cmp");
  tabs.innerHTML = C.compare.map(function (c, i) {
    return '<button class="tab" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(c.tab) + "</button>";
  }).join("");
  function showCmp(i) {
    var c = C.compare[i];
    cmp.innerHTML =
      '<div class="pane before"><h3>' + esc(c.earlyTitle) + "</h3><p>" + esc(c.early) + "</p></div>" +
      '<div class="pane after"><h3>' + esc(c.finalTitle) + "</h3><p>" + esc(c.final) + "</p></div>" +
      '<div class="gains"><strong>Improved:</strong> ' + c.gains.map(function (g) { return '<span class="tag">' + esc(g) + "</span>"; }).join("") + "</div>";
  }
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest(".tab"); if (!b) return;
    tabs.querySelectorAll(".tab").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
    showCmp(+b.dataset.i);
  });
  showCmp(0);

  /* Mobile nav */
  var mb = $(".menu-btn"), nav = $("#nav-links");
  mb.addEventListener("click", function () { var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); mb.setAttribute("aria-expanded", false); } });

  /* Scroll reveal */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add("in"); });
})();

/* Scenic parallax + solid nav on scroll */
(function () {
  var layers = document.querySelectorAll(".px"), nav = document.querySelector(".nav"), hero = document.getElementById("intro");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, tick = false;
  function update() {
    var y = window.scrollY;
    nav.classList.toggle("solid", y > 40);
    if (!reduce && y < hero.offsetHeight) layers.forEach(function (l) { l.style.transform = "translateY(" + (y * l.dataset.s) + "px)"; });
    tick = false;
  }
  window.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

(function () {
  var y = document.querySelector("[data-year]");
  if (y && window.CONTENT) y.textContent = window.CONTENT.academicYear;
})();
