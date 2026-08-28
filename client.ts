// Animated client — served transpiled from TS by server.ts
type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const canvas = document.createElement("canvas");
canvas.id = "bg";
Object.assign(canvas.style, {
  position: "fixed",
  inset: "0",
  width: "100%",
  height: "100%",
  zIndex: "-1",
  pointerEvents: "none",
} as CSSStyleDeclaration);
document.body.prepend(canvas);

const ctx = canvas.getContext("2d")!;
let particles: Particle[] = [];
let w = 0;
let h = 0;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  const count = Math.min(90, Math.floor((w * h) / 18000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1,
  }));
}
window.addEventListener("resize", resize);
resize();

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(79,70,229,0.35)";
    ctx.fill();
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(79,70,229,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}
draw();

// Hero entrance
const heroEls = document.querySelectorAll<HTMLElement>(".hero h1, .hero p, .hero .btn");
heroEls.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity .7s ease, transform .7s ease";
  setTimeout(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, 150 + i * 180);
});

// Scroll reveal for cards and plans
const cards = document.querySelectorAll<HTMLElement>(".card, .plan");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);
cards.forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = `opacity .6s ease ${i * 0.1}s, transform .6s ease ${i * 0.1}s`;
  io.observe(card);
});

// Button pulse
const btn = document.querySelector<HTMLElement>(".btn");
if (btn) {
  btn.style.transition += ", box-shadow .3s ease";
  btn.addEventListener("mouseenter", () => {
    btn.style.boxShadow = "0 8px 24px rgba(79,70,229,0.35)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.boxShadow = "none";
  });
}
