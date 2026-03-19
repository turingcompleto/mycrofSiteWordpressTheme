/* ═══════════════════════════════════════════════════════════════════════════
   MYCROF — main.js  |  GSAP 3 + Canvas API
═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const isMobile = () => window.innerWidth < 768;

  /* ─── NAV ────────────────────────────────────────────────────────────────── */
  const header  = document.getElementById('site-header');
  const toggle  = document.getElementById('nav-toggle');
  const menu    = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');

  if (header) {
    const heroHeight = document.querySelector('.hero')?.offsetHeight ?? 600;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > heroHeight - 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      overlay.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    overlay.addEventListener('click', closeMenu);
  }

  /* ─── MAGNETIC BUTTONS ───────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-pulse').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width/2) * 0.28, y: (e.clientY - r.top - r.height/2) * 0.28, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.1,0.5)' }));
  });

  /* ─── CARD 3D TILT ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      gsap.to(card, { rotateX: ((e.clientY-r.top)/r.height-0.5)*-14, rotateY: ((e.clientX-r.left)/r.width-0.5)*14, transformPerspective: 900, duration: 0.25, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'power3.out' }));
  });

  /* ═══════════════════════════════════════════════════════════════════════════
     HERO CANVAS
       Layer 1: Dot Mesh Field — dense dots forming abstract mesh lattices
       Layer 2: Brutalist Iso-Cube Formation — large dramatic cubes
  ═══════════════════════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return; // nothing else to do if no hero

  const ctx = canvas.getContext('2d');
  let W, H, animId, time = 0;

  /* ══════════════════════════════════════════════════════════════════════════
     LAYER 1 — DOT MESH FIELD
     Many small dots that assemble into abstract mesh lattices covering the
     full hero. Nearby dots are connected with faint lines → visible mesh.
  ══════════════════════════════════════════════════════════════════════════ */
  const DOT_COUNT   = () => isMobile() ? 200 : 420;
  const DOT_CONNECT = 78;   // px — connect dots within this distance
  const DOT_HOLD    = () => 440 + Math.random() * 220;

  let dots = [], dotState = 'assemble', dotFrames = 0, dotHold = 440, dotFormIdx = -1;

  /* ── Dot formations — all return [[nx,ny]…] normalised 0–1 ─────────────── */

  // 1. Sine-distorted regular grid
  function dmSineGrid(n) {
    const cols = Math.round(Math.sqrt(n * W / H)) + 1;
    const rows = Math.ceil(n / cols) + 1;
    const pts  = [];
    for (let r = 0; r <= rows && pts.length < n; r++) {
      for (let c = 0; c < cols && pts.length < n; c++) {
        const nx = c / (cols - 1);
        const ny = r / rows;
        const wave = Math.sin(nx * Math.PI * 3.0) * 0.048
                   + Math.sin(nx * Math.PI * 6.5 + 1.1) * 0.020;
        pts.push([
          nx + (Math.random() - 0.5) * 0.015,
          Math.max(0.01, Math.min(0.99, ny + wave + (Math.random() - 0.5) * 0.014))
        ]);
      }
    }
    return pts.slice(0, n);
  }

  // 2. Diamond / hexagonal staggered lattice
  function dmHexLattice(n) {
    const cols = Math.round(Math.sqrt(n * W / H) * 1.2) + 1;
    const rows = Math.ceil(n / cols) + 1;
    const pts  = [];
    for (let r = 0; r <= rows && pts.length < n; r++) {
      for (let c = 0; c < cols && pts.length < n; c++) {
        const nx = (c + (r % 2) * 0.5) / cols;
        const ny = r / rows;
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
          pts.push([
            nx + (Math.random() - 0.5) * 0.011,
            ny + (Math.random() - 0.5) * 0.011
          ]);
        }
      }
    }
    while (pts.length < n) pts.push([Math.random(), Math.random()]);
    return pts.slice(0, n);
  }

  // 3. Horizontal wave ribbons — full width
  function dmWaveRibbons(n) {
    const ribbons  = isMobile() ? 5 : 9;
    const perRibbon = Math.ceil(n / ribbons);
    const pts = [];
    for (let r = 0; r < ribbons && pts.length < n; r++) {
      for (let i = 0; i < perRibbon && pts.length < n; i++) {
        const t = i / (perRibbon - 1);
        const ph = r * 1.05;
        const ny = (r + 0.5) / ribbons
                 + Math.sin(t * Math.PI * 3.5 + ph)  * 0.058
                 + Math.sin(t * Math.PI * 7.0 + ph * 0.7) * 0.022;
        pts.push([
          t + (Math.random() - 0.5) * 0.009,
          Math.max(0.01, Math.min(0.99, ny + (Math.random() - 0.5) * 0.012))
        ]);
      }
    }
    return pts.slice(0, n);
  }

  // 4. Radial burst from 4 strategic points — expands to fill canvas
  function dmRadialBurst(n) {
    const centers  = [[0.12, 0.14], [0.88, 0.12], [0.14, 0.86], [0.86, 0.86], [0.50, 0.46]];
    const perCtr   = Math.ceil(n / centers.length);
    const pts = [];
    centers.forEach((ctr, ci) => {
      const rings = 7;
      const perRing = Math.ceil(perCtr / rings);
      for (let r = 0; r < rings && pts.length < (ci + 1) * perCtr && pts.length < n; r++) {
        const rad  = ((r + 1) / rings) * 0.54;
        const cnt  = Math.max(5, Math.round(perRing * (r + 1) / rings * 1.8));
        for (let i = 0; i < cnt && pts.length < n; i++) {
          const a = (i / cnt) * Math.PI * 2;
          pts.push([
            Math.max(0.01, Math.min(0.99, ctr[0] + Math.cos(a) * rad + (Math.random()-0.5)*0.014)),
            Math.max(0.01, Math.min(0.99, ctr[1] + Math.sin(a) * rad * (H / W) + (Math.random()-0.5)*0.014))
          ]);
        }
      }
    });
    while (pts.length < n) pts.push([Math.random(), Math.random()]);
    return pts.slice(0, n);
  }

  // 5. Diagonal parallel slashes from corner to corner
  function dmDiagSlashes(n) {
    const slashes  = isMobile() ? 6 : 11;
    const perSlash = Math.ceil(n / slashes);
    const pts = [];
    for (let s = 0; s < slashes && pts.length < n; s++) {
      const offset = (s / (slashes - 1)) * 1.85 - 0.42;
      for (let i = 0; i < perSlash && pts.length < n; i++) {
        const t  = i / (perSlash - 1);
        const nx = t;
        const ny = offset + t * 0.70
                 + Math.sin(t * Math.PI * 2.2 + s * 0.75) * 0.055;
        if (ny >= 0.01 && ny <= 0.99) {
          pts.push([
            nx + (Math.random() - 0.5) * 0.011,
            ny + (Math.random() - 0.5) * 0.011
          ]);
        }
      }
    }
    while (pts.length < n) pts.push([Math.random(), Math.random()]);
    return pts.slice(0, n);
  }

  // 6. Concentric ellipses — electromagnetic feel
  function dmConcentricEllipses(n) {
    const rings = isMobile() ? 6 : 10;
    const perRing = Math.ceil(n / rings);
    const cx = 0.50, cy = 0.47;
    const pts = [];
    for (let r = 0; r < rings && pts.length < n; r++) {
      const rx = 0.06 + (r / (rings - 1)) * 0.48;
      const ry = rx * (H / W) * 0.85;
      const cnt = Math.max(8, Math.round(perRing * (0.5 + r * 0.5)));
      for (let i = 0; i < cnt && pts.length < n; i++) {
        const a = (i / cnt) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
        pts.push([
          Math.max(0.01, Math.min(0.99, cx + Math.cos(a) * rx + (Math.random()-0.5)*0.012)),
          Math.max(0.01, Math.min(0.99, cy + Math.sin(a) * ry + (Math.random()-0.5)*0.012))
        ]);
      }
    }
    while (pts.length < n) pts.push([Math.random(), Math.random()]);
    return pts.slice(0, n);
  }

  const DOT_FORMATIONS = [dmSineGrid, dmHexLattice, dmWaveRibbons, dmRadialBurst, dmDiagSlashes, dmConcentricEllipses];

  function makeDot() {
    return {
      x:  Math.random() * (W || 1200),
      y:  Math.random() * (H || 700),
      tx: 0, ty: 0,
      lerpSpeed: 0.014 + Math.random() * 0.012,
      alpha: 0,
      size:  1.0 + Math.random() * 1.1,
    };
  }

  function initDots() {
    dots = Array.from({ length: DOT_COUNT() }, makeDot);
  }

  function nextDotFormation() {
    dotFormIdx = (dotFormIdx + 1) % DOT_FORMATIONS.length;
    dotHold    = DOT_HOLD();
    dotFrames  = 0;
    dotState   = 'assemble';
    const pos  = DOT_FORMATIONS[dotFormIdx](dots.length);
    dots.forEach((d, i) => {
      const [nx, ny] = pos[i] || [Math.random(), Math.random()];
      d.tx = nx * W;
      d.ty = ny * H;
    });
  }

  function drawDotMesh() {
    dotFrames++;

    if (dotState === 'assemble') {
      let arrived = 0;
      dots.forEach(d => {
        d.x += (d.tx - d.x) * d.lerpSpeed;
        d.y += (d.ty - d.y) * d.lerpSpeed;
        d.alpha = Math.min(1, d.alpha + 0.012);
        if (Math.hypot(d.tx - d.x, d.ty - d.y) < 3) arrived++;
      });
      if (arrived >= dots.length * 0.82 && dotFrames > 120) {
        dotState = 'hold'; dotFrames = 0;
      }
    } else if (dotState === 'hold') {
      dots.forEach((d, i) => {
        d.x = d.tx + Math.sin(time * 0.55 + i * 0.22) * 1.6;
        d.y = d.ty + Math.cos(time * 0.42 + i * 0.18) * 1.3;
      });
      if (dotFrames > dotHold) {
        dotState = 'dissolve'; dotFrames = 0;
      }
    } else if (dotState === 'dissolve') {
      dots.forEach(d => {
        d.x += (Math.random() - 0.5) * 4;
        d.y += (Math.random() - 0.5) * 4;
        d.alpha = Math.max(0, d.alpha - 0.022);
      });
      if (dotFrames > 45) {
        dots.forEach(d => { d.x = Math.random()*W; d.y = Math.random()*H; d.alpha = 0; });
        nextDotFormation();
      }
    }

    /* Draw connection lines — one beginPath per unique alpha bucket to batch */
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      if (a.alpha < 0.03) continue;
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        if (b.alpha < 0.03) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > DOT_CONNECT || Math.abs(dy) > DOT_CONNECT) continue; // AABB cull
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < DOT_CONNECT) {
          const la = (1 - dist / DOT_CONNECT) * 0.16 * Math.min(a.alpha, b.alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(98,125,233,${la.toFixed(2)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw dots on top of lines
    dots.forEach(d => {
      if (d.alpha < 0.02) return;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(98,125,233,${(d.alpha * 0.50).toFixed(2)})`;
      ctx.fill();
    });
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LAYER 2 — BRUTALIST ISO-CUBE FIELD
     Fewer, much larger cubes with heavy presence and thick scanline build.
  ══════════════════════════════════════════════════════════════════════════ */
  const CUBE_COUNT   = () => isMobile() ? 6 : 11;
  const CUBE_CONNECT = 320;   // longer edges between big cubes
  const CUBE_HOLD    = () => 330 + Math.random() * 170;

  let cubes = [], cubeState = 'explode', cubeFrames = 0, cubeHold = 300, cubeFormIdx = -1;

  function jit(nx, ny, amt) {
    return [nx + (Math.random()-0.5)*amt, ny + (Math.random()-0.5)*amt];
  }

  /* Cube formations — fewer points, dramatically placed */
  function cfScatter(n) {
    const anchors = [
      [0.13,0.28],[0.84,0.20],[0.48,0.52],[0.74,0.65],[0.26,0.68],
      [0.61,0.30],[0.09,0.56],[0.90,0.52],[0.50,0.18],[0.38,0.42],[0.78,0.38]
    ];
    return Array.from({length:n}, (_,i) => jit(...anchors[i % anchors.length], 0.045));
  }

  function cfDiagonal(n) {
    return Array.from({length:n}, (_,i) => {
      const t = i / Math.max(n-1, 1);
      return jit(0.10 + t*0.80, 0.18 + t*0.64, 0.055);
    });
  }

  function cfCross(n) {
    return Array.from({length:n}, (_,i) => {
      if (i < Math.ceil(n/2)) {
        const t = i / Math.max(Math.ceil(n/2)-1, 1);
        return jit(0.12 + t*0.76, 0.46, 0.055);
      }
      const t = (i - Math.ceil(n/2)) / Math.max(n - Math.ceil(n/2) - 1, 1);
      return jit(0.50, 0.12 + t*0.76, 0.055);
    });
  }

  function cfCorners(n) {
    const corners = [[0.10,0.20],[0.88,0.18],[0.12,0.78],[0.86,0.76],[0.50,0.46]];
    return Array.from({length:n}, (_,i) => {
      const c = corners[i % corners.length];
      const extra = i >= corners.length ? 0.10 : 0.04;
      return jit(c[0], c[1], extra);
    });
  }

  const CUBE_FORMATIONS = [cfScatter, cfDiagonal, cfCross, cfCorners];

  function makeCube() {
    return {
      x: 0, y: 0, tx: 0, ty: 0,
      vx: 0, vy: 0,
      size:       70 + Math.random() * 95,   // 70–165 px — BRUTALIST
      bp:         0,
      buildSpeed: 0.005 + Math.random() * 0.008,
      arrived:    false,
      alpha:      0,
      colorType:  Math.random() < 0.58 ? 0 : 1,
      wireOnly:   Math.random() < 0.22,
      lerpSpeed:  0.020 + Math.random() * 0.014,
    };
  }

  function initCubes() {
    cubes = Array.from({ length: CUBE_COUNT() }, makeCube);
  }

  function nextCubeFormation() {
    cubeFormIdx = (cubeFormIdx + 1) % CUBE_FORMATIONS.length;
    cubeHold    = CUBE_HOLD();
    cubeFrames  = 0;
    cubeState   = 'assemble';

    cubes.forEach(c => {
      const side = Math.floor(Math.random() * 4);
      if      (side === 0) { c.x = Math.random()*W; c.y = -180; }
      else if (side === 1) { c.x = W+180;            c.y = Math.random()*H; }
      else if (side === 2) { c.x = Math.random()*W; c.y = H+180; }
      else                 { c.x = -180;             c.y = Math.random()*H; }
      c.vx=0; c.vy=0; c.bp=0; c.arrived=false; c.alpha=0;
    });

    const pos = CUBE_FORMATIONS[cubeFormIdx](cubes.length);
    cubes.forEach((c, i) => { c.tx = pos[i][0]*W; c.ty = pos[i][1]*H; });
  }

  /* ── Iso-cube renderer ────────────────────────────────────────────────── */
  function drawIsoCube(x, y, s, bp, fillAlpha, wireAlpha, colorType) {
    const h = s, w = s * 0.866;
    const top=[x,y-h], tr=[x+w,y-h/2], br=[x+w,y+h/2],
          bot=[x,y+h], bl=[x-w,y+h/2], tl=[x-w,y-h/2], ctr=[x,y];

    function face(pts, r, g, b, a) {
      if (a < 0.005) return;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i=1; i<pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath(); ctx.fillStyle = `rgba(${r},${g},${b},${a})`; ctx.fill();
    }

    if (fillAlpha > 0.005) {
      ctx.save();
      if (bp < 1) {
        ctx.beginPath();
        ctx.rect(x-w-2, y-h-2, w*2+4, bp*h*2+4);
        ctx.clip();
      }
      if (colorType === 0) {
        face([top,tr,ctr,tl], 148,172,255, fillAlpha * 0.76);
        face([tr,br,bot,ctr],  98,125,233, fillAlpha);
        face([tl,ctr,bot,bl],  46, 20,168, fillAlpha * 0.90);
      } else {
        face([top,tr,ctr,tl], 165,118,255, fillAlpha * 0.76);
        face([tr,br,bot,ctr], 120, 58,228, fillAlpha);
        face([tl,ctr,bot,bl],  42,  8,158, fillAlpha * 0.90);
      }
      ctx.restore();
    }

    if (wireAlpha > 0.005) {
      ctx.strokeStyle = `rgba(98,125,233,${wireAlpha})`;
      ctx.lineWidth   = fillAlpha > 0 ? 1.4 : 2.8;  // thicker wireframe on wireOnly
      ctx.lineJoin    = 'round';
      const edges = [[top,tr],[top,tl],[tr,ctr],[tl,ctr],[tr,br],[tl,bl],[br,bot],[bl,bot],[ctr,bot]];
      for (const [a, b] of edges) {
        ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
      }
    }

    // Scanline build sweep — more dramatic on big cubes
    if (bp > 0.01 && bp < 0.98) {
      const sy = y - h + bp * h * 2;
      const sw = w * Math.min(1, Math.min(bp, 1 - bp) * 5);
      const grd = ctx.createLinearGradient(x - sw, sy, x + sw, sy);
      grd.addColorStop(0,    'rgba(200,225,255,0)');
      grd.addColorStop(0.32, 'rgba(200,225,255,0.65)');
      grd.addColorStop(0.50, 'rgba(240,248,255,1.00)');
      grd.addColorStop(0.68, 'rgba(200,225,255,0.65)');
      grd.addColorStop(1,    'rgba(200,225,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(x - sw, sy - 2.5, sw * 2, 5);
    }
  }

  /* ── Edges between cubes ─────────────────────────────────────────────── */
  function drawCubeEdges() {
    for (let i = 0; i < cubes.length; i++) {
      for (let j = i + 1; j < cubes.length; j++) {
        const ci = cubes[i], cj = cubes[j];
        if (ci.alpha < 0.05 || cj.alpha < 0.05) continue;
        const d = Math.hypot(ci.x - cj.x, ci.y - cj.y);
        if (d < CUBE_CONNECT) {
          const a = (1 - d / CUBE_CONNECT) * 0.30 * Math.min(ci.alpha, cj.alpha);
          ctx.beginPath();
          ctx.moveTo(ci.x, ci.y); ctx.lineTo(cj.x, cj.y);
          ctx.strokeStyle = `rgba(98,125,233,${a.toFixed(2)})`; ctx.lineWidth = 1.8; ctx.stroke();
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════════════════
     MAIN RENDER LOOP
  ══════════════════════════════════════════════════════════════════════════ */
  function frame() {
    ctx.fillStyle = '#0e1112';
    ctx.fillRect(0, 0, W, H);
    time += 0.012;
    cubeFrames++;

    /* ── Layer 1: dot mesh ────────────────────────────────────────────── */
    drawDotMesh();

    /* ── Layer 2: cube state machine ──────────────────────────────────── */
    if (cubeState === 'assemble') {
      let arrived = 0;
      cubes.forEach(c => {
        c.x += (c.tx - c.x) * c.lerpSpeed;
        c.y += (c.ty - c.y) * c.lerpSpeed;
        c.alpha = Math.min(1, c.alpha + 0.030);
        if (Math.hypot(c.tx-c.x, c.ty-c.y) < 10) {
          arrived++;
          if (!c.arrived) { c.arrived = true; c.bp = 0; }
        }
      });
      if (arrived >= cubes.length * 0.85 && cubeFrames > 65) { cubeState = 'hold'; cubeFrames = 0; }
    }

    if (cubeState === 'hold') {
      cubes.forEach((c, i) => {
        c.x = c.tx + Math.sin(time * 0.75 + i * 0.52) * 2.8;
        c.y = c.ty + Math.cos(time * 0.58 + i * 0.40) * 2.2;
        if (c.bp < 1) c.bp = Math.min(1, c.bp + c.buildSpeed);
      });
      if (cubeFrames > cubeHold) {
        cubeState = 'explode'; cubeFrames = 0;
        const cx = W * 0.5, cy = H * 0.46;
        cubes.forEach(c => {
          const d   = Math.hypot(c.x-cx, c.y-cy) + 1;
          const spd = 3.8 + Math.random() * 6.0;
          c.vx = (c.x-cx)/d * spd + (Math.random()-0.5) * 3.0;
          c.vy = (c.y-cy)/d * spd + (Math.random()-0.5) * 3.0;
        });
      }
    }

    if (cubeState === 'explode') {
      cubes.forEach(c => {
        c.x += c.vx; c.y += c.vy; c.vx *= 0.968; c.vy *= 0.968;
        c.bp = Math.max(0, c.bp - 0.038);
        const d = Math.hypot(c.x-W/2, c.y-H/2);
        c.alpha = Math.max(0, 1 - d / Math.hypot(W/2, H/2) * 1.08);
      });
      if (cubeFrames > 80) nextCubeFormation();
    }

    drawCubeEdges();

    cubes.forEach(c => {
      if (c.alpha < 0.01) return;
      drawIsoCube(
        c.x, c.y, c.size, c.bp,
        c.wireOnly ? 0           : c.alpha * 0.90,
        c.wireOnly ? c.alpha*0.80: c.alpha * 0.28,
        c.colorType
      );
    });

    animId = requestAnimationFrame(frame);
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize(); initDots(); initCubes(); nextDotFormation(); nextCubeFormation();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId); else frame();
  });

  resize(); initDots(); initCubes();
  nextDotFormation(); nextCubeFormation();
  frame();

  gsap.to(canvas, { opacity: 1, duration: 2.5, ease: 'power2.inOut', delay: 0.2 });
  gsap.to(canvas, { opacity: 0.88, duration: 5.5, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3 });

  /* ═══════════════════════════════════════════════════════════════════════════
     TEXT SCRAMBLE
  ═══════════════════════════════════════════════════════════════════════════ */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';
  function scramble(el) {
    const final = el.dataset.scramble || el.textContent.trim();
    el.dataset.scramble = final;
    let f = 0; const total = final.length * 1.8 | 0;
    const id = setInterval(() => {
      el.textContent = final.split('').map((ch, i) =>
        ch === ' ' ? ' ' : i < (f/total) * final.length ? ch : GLYPHS[Math.random() * GLYPHS.length | 0]
      ).join('');
      if (++f > total + 4) { el.textContent = final; clearInterval(id); }
    }, 28);
  }
  document.querySelectorAll('.scramble-title').forEach(el => {
    let tm;
    el.addEventListener('mouseenter', () => { clearTimeout(tm); tm = setTimeout(() => scramble(el), 80); });
  });

  /* ─── NUMBER COUNTER ─────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const raw    = el.textContent.trim();
    const prefix = raw.match(/^\D*/)?.[0] || '';
    const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.match(/\D+$/)?.[0] || '';
    if (isNaN(num)) return;
    const obj = { v: 0 };
    gsap.to(obj, { v: num, duration: 2, ease: 'power2.out', onUpdate() { el.textContent = prefix + Math.round(obj.v) + suffix; } });
  }

  /* ─── INTERSECTION OBSERVER ──────────────────────────────────────────────── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      if (e.target.classList.contains('scramble-title')) scramble(e.target);
      if (e.target.classList.contains('counter'))        animateCounter(e.target);
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal], .scramble-title, .counter').forEach(el => revealIO.observe(el));

  /* ─── PROCESS STEPS ──────────────────────────────────────────────────────── */
  const pg = document.getElementById('process-grid');
  if (pg) {
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      pg.querySelectorAll('.process-step').forEach((s,i) => setTimeout(() => s.classList.add('is-active'), i*240));
      io.disconnect();
    }, { threshold: 0.25 });
    io.observe(pg);
  }

  /* ─── GSAP HERO ENTRANCE ─────────────────────────────────────────────────── */
  gsap.timeline({ delay: 0.5 })
    .from('.hero-label',      { y: 18, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
    .from('.hero-title-line', { y: 55, autoAlpha: 0, stagger: { each: 0.16 }, duration: 0.95, ease: 'expo.out' }, '-=0.2')
    .from('.hero-typewriter', { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from(['.hero-cta-1','.hero-cta-2'], { y: 18, autoAlpha: 0, stagger: { each: 0.13 }, duration: 0.6, ease: 'power3.out' }, '-=0.3')
    .from('.hero-scroll', { autoAlpha: 0, duration: 0.5 }, '-=0.1')
    .call(startTypewriter);

  /* ─── TYPEWRITER ─────────────────────────────────────────────────────────── */
  function startTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    const phrases = ['Uploading Talent.', 'Transformamos el futuro.', 'Tu próximo gran equipo.'];
    let idx = 0, ci = 0, del = false;
    (function tick() {
      const cur = phrases[idx];
      if (!del) { el.textContent = cur.slice(0, ++ci); if (ci === cur.length) { del = true; setTimeout(tick, 2000); return; } }
      else       { el.textContent = cur.slice(0, --ci); if (ci === 0) { del = false; idx = (idx+1) % phrases.length; } }
      setTimeout(tick, del ? 28 : 52);
    })();
  }

  /* ─── SMOOTH SCROLL ──────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return; e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 72) - 16, behavior: 'smooth' });
    });
  });

})();
