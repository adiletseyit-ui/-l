/* ===== Ойын деректері ===== */
const SAFE_OPTS = ["Қауіпсіз", "Қауіпті"]; // 0 — қауіпсіз, 1 — қауіпті
const GAMES = [
  { id: "g1", title: "Қауіпті тап!", tip: "Оңға — қауіпсіз, солға — қауіпті", tone: "bad", mode: "swipe", time: 6, items: [
    { q: "Айдос құпия сөзін ешкімге айтпайды және оны күрделі етіп қояды.", correct: 0, explain: "Күрделі құпия сөзді ешкімге айтпау аккаунтты қорғайды." },
    { q: "Әлия бейтаныс адам жіберген сілтемені басып, сұрақтарға жауап берді.", correct: 1, explain: "Бейтаныс сілтеме фишинг болуы мүмкін. Ашпай, ересекке айт." },
    { q: "Данияр желіде үй мекенжайын және мектебін жариялады.", correct: 1, explain: "Жеке ақпаратты жарияламау керек." },
    { q: "Ерлан чаттағы бейтаныс адамға өз фотосын жіберді.", correct: 1, explain: "Бейтаныс адамға фото жіберме, оны теріс пайдалануы мүмкін." },
    { q: "Мәдина ойынды тек ресми дүкеннен жүктеді.", correct: 0, explain: "Ресми дүкен қауіпсіздеу. Белгісіз сайттан жүктеме." }
  ] },
  { id: "g2", title: "Сен не істер едің?", tip: "Хабарламаға дұрыс жауап таңда", tone: "acc", mode: "chat", time: 0, items: [
    { q: "Сен ұттың! Сыйлық алу үшін ата-анаңның картасының нөмірін жаз.", o: ["Картаның нөмірін жазу.", "Елемей, ата-анама айту.", "Сыйлықтың қандай екенін сұрау."], correct: 1, explain: "Бұл алаяқтық. Карта деректерін ешкімге жазба." },
    { q: "Сәлем! Кездесейік, мектебің мен мекенжайыңды жаз.", o: ["Кездесуге бару.", "Мекенжайымды жіберу.", "Жазбай, ата-анама айту."], correct: 2, explain: "Бейтаныс адаммен кездеспе, мекенжайыңды айтпа." },
    { q: "(Сен біреуді қорлайтын хабарламаларды көрдің)", o: ["Дәл солай жауап беру.", "Скриншот алып, мұғалімге айту.", "Ешкімге айтпау."], correct: 1, explain: "Бұл кибербуллинг. Скриншот сақтап, ересекке айт. Қауіп болса — 102." }
  ] },
  { id: "g3", title: "Қауіпсіздік пазлы", tip: "Қауіпті дұрыс қалқанға апар", tone: "ok", mode: "drag", pairs: [
    ["Құпия сөзді бөлісу", "Құпия сөзді тек өзің сақта"],
    ["Бейтаныс сілтемені басу", "Сілтемені ашпай, ересекке айту"],
    ["Жеке ақпаратты жариялау", "Мекенжай мен нөмірді жасыру"],
    ["Белгісіз сайттан ойын жүктеу", "Қосымшаны ресми дүкеннен жүктеу"],
    ["Чаттағы бейтанышпен сөйлесу", "Сөйлесуді тоқтатып, ата-анаға айту"]
  ] },
  { id: "g4", title: "Блиц-викторина", tip: "Тез жауап бер, серия жина!", tone: "warn", mode: "quiz", time: 10, items: [
    { q: "Құпия сөз қандай болуы керек?", o: ["Оңай және қысқа.", "Күрделі және жеке.", "Атыңмен бірдей."], correct: 1, explain: "Күрделі құпия сөз аккаунтты қорғайды." },
    { q: "Бейтаныс адам сілтеме жіберсе, не істейсің?", o: ["Дереу басамын.", "Досыма жіберемін.", "Ашпай, ересекке айтамын."], correct: 2, explain: "Бейтаныс сілтеме қауіпті болуы мүмкін." },
    { q: "Нені жарияламау керек?", o: ["Сүйікті спортты.", "Үй мекенжайын.", "Сүйікті кітапты."], correct: 1, explain: "Үй мекенжайы — жеке ақпарат." },
    { q: "Қосымшаны қайдан жүктеген дұрыс?", o: ["Белгісіз сайттан.", "Ресми дүкеннен.", "Чаттағы сілтемеден."], correct: 1, explain: "Ресми дүкендегі қосымшалар тексеріледі." },
    { q: "Нақты қауіп төнгенде қай нөмірге қоңырау шаласың?", o: ["102", "12345", "555"], correct: 0, explain: "102 — полицияның шұғыл көмек нөмірі." }
  ] }
];
const END_TEXTS = ["Мазмұнын қайта оқып, қайта ойнап көр.", "Жақсы нәтиже! Тағы бір рет қайталап, біліміңді нығайт.", "Жақсы нәтиже! Тағы бір рет қайталап, біліміңді нығайт.", "Тамаша! Сен цифрлық қауіпсіздікті жақсы білесің!"];
const PRAISE = ["Керемет!", "Дәл тауып қойдың!", "Тамаша!", "Өте жақсы!"];
const COIN = 10, STREAK_BONUS = 5, LIVES = 3;

/* ===== Көмекшілер ===== */
const app = document.getElementById("app");
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const btn = (label, cls, fn) => { const b = el("button", cls, label); b.type = "button"; b.onclick = fn; return b; };
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const KEY = "qcw-game";
let save = { coins: 0, stars: {} };
try { save = Object.assign(save, JSON.parse(localStorage.getItem(KEY))); } catch {}
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch {} };
const starsText = n => { const s = el("div", "stars"); s.innerHTML = "★".repeat(n) + "<i>" + "★".repeat(3 - n) + "</i>"; return s; };

let soundOn = true, audio;
function beep(f, d) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!soundOn || !AC) return;
  audio = audio || new AC();
  const o = audio.createOscillator(), g = audio.createGain();
  g.gain.value = 0.07; o.frequency.value = f; o.connect(g); g.connect(audio.destination);
  o.start(); o.stop(audio.currentTime + d);
}
const sfx = { ok() { beep(660, .1); setTimeout(() => beep(880, .14), 90); }, bad() { beep(170, .28); navigator.vibrate && navigator.vibrate(120); } };
function confetti() {
  const box = el("div", "confetti");
  ["#1E5AA8", "#1F8A5B", "#E7B449", "#C6453B"].forEach((c, k) => { for (let i = 0; i < 8; i++) { const p = el("i"); p.style.cssText = `left:${Math.random() * 100}%;background:${c};animation-delay:${Math.random() * .6}s`; box.append(p); } });
  return box;
}
function toast(t) { const n = el("div", "toast", t); document.body.append(n); setTimeout(() => n.remove(), 2400); }
function screen(tone, build) { app.replaceChildren(); app.className = tone || ""; build(app); window.scrollTo(0, 0); }

/* ===== Карта деңгейлер ===== */
function showMap() {
  screen("", root => {
    const top = el("div", "top");
    top.append(el("div", "chip", ""), btn(soundOn ? "🔊" : "🔇", "icon-btn", () => { soundOn = !soundOn; showMap(); }));
    top.firstChild.innerHTML = `<span class="coin">●</span> ${save.coins}`;
    root.append(top, el("h1", "title", "Қауіпсіз цифрлық әлем"),
      el("p", "sub", "Интернет — пайдалы кеңістік, бірақ онда қауіптер де кездеседі. Ойнап, біліп, қауіпсіз бол!"));
    const path = el("div", "path");
    GAMES.forEach((g, i) => {
      const open = i === 0 || (save.stars[GAMES[i - 1].id] || 0) > 0;
      const n = el("button", "node " + g.tone + (open ? "" : " locked"));
      n.type = "button";
      n.style.animationDelay = i * 0.08 + "s";
      const info = el("div");
      info.append(el("b", "", g.title), starsText(save.stars[g.id] || 0));
      n.append(el("div", "orb", open ? String(i + 1) : "🔒"), info);
      if (open) n.onclick = () => play(g); else n.onclick = () => toast("Алдымен алдыңғы деңгейді өт");
      path.append(n);
    });
    const sos = el("div", "sos");
    sos.innerHTML = "Есте сақта: қауіп төнгенде <strong>102</strong> нөміріне қоңырау шал";
    const reset = btn("Прогресті өшіру", "reset", () => { save = { coins: 0, stars: {} }; persist(); showMap(); });
    root.append(path, sos, reset);
  });
}

/* ===== Ойын сеансы ===== */
function play(g) {
  const S = { hearts: LIVES, coins: 0, streak: 0, i: 0 };
  screen(g.tone, root => {
    const top = el("div", "top"), hearts = el("div", "chip"), coins = el("div", "chip");
    top.append(btn("✕", "icon-btn", showMap), hearts, coins);
    const meta = el("div", "meta"), timer = el("div", "timer"), stage = el("div", "stage");
    timer.append(el("i"));
    root.append(top, meta, timer, stage);
    const hud = () => {
      hearts.replaceChildren(...Array.from({ length: LIVES }, (_, k) => el("span", "heart" + (k < S.hearts ? "" : " lost"), "♥")));
      coins.innerHTML = `<span class="coin">●</span> ${S.coins}`;
    };
    const gain = () => {
      S.streak++;
      const add = COIN + (S.streak >= 3 ? STREAK_BONUS : 0);
      S.coins += add; sfx.ok(); hud();
      stage.append(el("div", "pop", `+${add}` + (S.streak >= 3 ? ` · Серия ×${S.streak}` : "")));
    };
    const lose = () => { S.hearts--; S.streak = 0; sfx.bad(); hud(); };
    const total = g.mode === "drag" ? g.pairs.length : g.items.length;
    const progress = () => (meta.replaceChildren(el("span", "", g.title), el("span", "", `${Math.min(S.i + 1, total)} / ${total}`)));

    function finish() {
      clearTimeout(S.timer);
      const win = S.hearts > 0, stars = win ? Math.max(1, S.hearts) : 0;
      if (win) { S.coins += 0; save.coins += S.coins; save.stars[g.id] = Math.max(save.stars[g.id] || 0, stars); persist(); }
      app.replaceChildren();
      const res = el("div", "result");
      res.append(el("h2", "", win ? "Деңгей өтті!" : "Жүрек таусылды"), starsText(stars), el("p", "", END_TEXTS[stars]), el("p", "", `+${win ? S.coins : 0} ●`));
      if (stars === 3) res.append(confetti());
      const next = GAMES[GAMES.indexOf(g) + 1];
      app.append(res);
      if (win && next) app.append(btn("Келесі деңгей", "btn", () => play(next)), el("div", "msg"));
      app.append(btn("Қайта ойнау", "btn light", () => play(g)), el("div", "msg"), btn("Басты бет", "btn light", showMap));
    }
    const advance = () => { S.i++; (S.i >= total || S.hearts <= 0) ? finish() : round(); };

    /* свайп / чат / викторина */
    function round() {
      const it = g.items[S.i];
      stage.replaceChildren(); progress(); hud();
      const bar = timer.firstChild; bar.className = ""; void bar.offsetWidth;
      timer.style.visibility = g.time ? "visible" : "hidden";
      let locked = false;
      const labels = g.mode === "swipe" ? SAFE_OPTS : it.o;
      const opts = el("div", g.mode === "swipe" ? "opts duo" : "opts");
      const order = g.mode === "swipe" ? [1, 0] : labels.map((_, k) => k);
      const buttons = {};
      order.forEach(k => { const b = btn(labels[k], "opt", () => choose(k)); buttons[k] = b; opts.append(b); });
      let card;
      if (g.mode === "chat") { card = el("div", "bubble"); card.append(el("small", "", "Бейтаныс"), document.createTextNode(it.q)); }
      else card = el("div", "qcard", it.q);
      stage.append(card, opts);
      if (g.mode === "swipe") swipe(card, k => choose(k));
      if (g.time) { bar.style.animationDuration = g.time + "s"; bar.className = "run"; S.timer = setTimeout(() => choose(-1), g.time * 1000); }

      function choose(k) {
        if (locked) return; locked = true; clearTimeout(S.timer); bar.style.animationPlayState = "paused";
        Object.values(buttons).forEach(b => (b.disabled = true));
        buttons[it.correct].classList.add("right");
        if (k === it.correct) { gain(); setTimeout(advance, 800); return; }
        if (k >= 0) buttons[k].classList.add("wrong");
        lose();
        const fb = el("div", "fb");
        fb.append(el("p", "", (k < 0 ? "Уақыт бітті. " : "") + it.explain), btn(S.hearts > 0 ? "Келесі" : "Нәтиже", "btn", advance));
        stage.append(fb);
      }
    }

    /* пазл: апарып тастау */
    function puzzle() {
      const order = shuffle(g.pairs.map((p, k) => k));
      const slots = el("div", "slots"), msg = el("div", "msg");
      let cur = 0, card;
      const els = {};
      shuffle(g.pairs.map((p, k) => k)).forEach(k => {
        const s = el("button", "slot", g.pairs[k][1]); s.type = "button"; s.onclick = () => attempt(k);
        els[k] = s; slots.append(s);
      });
      function show() {
        if (card) card.remove();
        progress(); hud();
        card = el("div", "qcard", g.pairs[order[cur]][0]);
        stage.prepend(card);
        drag(card, x => { const s = x && x.closest(".slot"); if (s) attempt(Number(Object.keys(els).find(k => els[k] === s))); });
      }
      function attempt(k) {
        if (!card || els[k].classList.contains("done")) return;
        if (k === order[cur]) {
          els[k].classList.add("done"); els[k].disabled = true; gain();
          msg.className = "msg good"; msg.textContent = "Дұрыс! Бұл шешім қауіпті болдырмауға көмектеседі";
          S.i = ++cur; if (cur >= total) { card.remove(); card = null; setTimeout(finish, 700); } else show();
        } else {
          lose(); els[k].classList.add("miss"); card.style.animation = "shake .35s";
          setTimeout(() => { els[k].classList.remove("miss"); if (card) card.style.animation = ""; }, 400);
          msg.className = "msg no"; msg.textContent = "Бұл жұп сәйкес емес. Тағы ойлан";
          if (S.hearts <= 0) setTimeout(finish, 500);
        }
      }
      stage.append(msg, slots); show();
    }

    g.mode === "drag" ? puzzle() : round();
  });
}

/* ===== Сүйреу / свайп ===== */
function drag(card, onDrop) {
  let sx = 0, sy = 0, on = false;
  card.onpointerdown = e => { on = true; sx = e.clientX; sy = e.clientY; card.setPointerCapture(e.pointerId); card.classList.add("drag"); };
  card.onpointermove = e => { if (on) card.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) rotate(${(e.clientX - sx) / 20}deg)`; };
  card.onpointerup = e => {
    if (!on) return; on = false; card.classList.remove("drag");
    card.style.pointerEvents = "none";
    const under = document.elementFromPoint(e.clientX, e.clientY);
    card.style.pointerEvents = "";
    card.style.transition = "transform .2s"; card.style.transform = "";
    onDrop(under, e.clientX - sx);
  };
}
function swipe(card, choose) {
  drag(card, (under, dx) => { if (Math.abs(dx) > 80) choose(dx > 0 ? 0 : 1); });
}

showMap();
