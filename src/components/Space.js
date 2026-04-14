import * as React from "react";

// ─── constants ────────────────────────────────────────────────────────────────
// Per-tier star counts: FAR layer is a dense carpet, fewer near stars
const TIER_COUNTS  = [420, 60, 30];    // far, mid, near
const TARGET_FPS   = 24;
const FPS_INTERVAL = 1000 / TARGET_FPS;
const BASE_SPEED   = 0.10;
const GROW_FACTOR  = 0.004;
const BG_COLOR     = '#071820';
const STAR_COLORS  = ['#1e3a2a', '#2d5c3e', '#5a9470', '#96ccaa', '#dff8d0'];

// ─── depth tiers ──────────────────────────────────────────────────────────────
// tier 0 – far:  barely moves, 1 px dot, no trail  → deep-space background carpet
// tier 1 – mid:  slow drift, 1-2 px, faint trail
// tier 2 – near: full speed, 2-3 px, visible short trail
const TIERS = [
    { share: 0.42, speedMult: 0.08, colorBias: 0.00 },
    { share: 0.35, speedMult: 0.40, colorBias: 0.12 },
    { share: 0.23, speedMult: 1.00, colorBias: 0.28 },
];

class Space extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef     = React.createRef();
        this.canvas        = null;
        this.ctx           = null;
        this.w             = 0;
        this.h             = 0;
        this.maxR          = 0;
        this.stars         = [];
        this.stop          = false;
        this.then          = 0;
        this.animId        = null;

        // Smooth vanishing-point offset driven by arrow-key direction
        this.offsetX = 0;
        this.offsetY = 0;

        // Pre-allocated per-frame buffers — zero GC per tick
        this.buckets    = [[], [], [], [], []];
        this.midTrails  = [];   // flat: x0,y0,x1,y1,...
        this.nearTrails = [];

        this.tick          = this.tick.bind(this);
        this.resizeHandler = this.onResize.bind(this);
    }

    onResize() {
        this.w    = this.canvas.width  = document.body.clientWidth;
        this.h    = this.canvas.height = document.body.clientHeight;
        this.maxR = Math.hypot(this.w / 2, this.h / 2);
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    makeStar(tierIdx, spread) {
        const angle = Math.random() * Math.PI * 2;
        // Far stars (tier 0) spread across the full visible area;
        // other tiers use the standard spread range
        const spreadR = tierIdx === 0
            ? Math.random() * this.maxR * 0.95 + 2
            : Math.random() * this.maxR * 0.72 + 2;
        return {
            angle,
            cosA: Math.cos(angle),
            sinA: Math.sin(angle),
            r:    spread ? spreadR : 2 + Math.random() * 6,
            tier: tierIdx,
            psx:  null,
            psy:  null,
        };
    }

    tick(time) {
        if (this.stop) return;
        this.animId = requestAnimationFrame(this.tick);

        const elapsed = time - this.then;
        if (elapsed < FPS_INTERVAL) return;
        this.then = time - (elapsed % FPS_INTERVAL);

        const { ctx, w, h, maxR } = this;

        // cap dt so a hidden-tab resume doesn't teleport stars
        const dt = Math.min(elapsed / FPS_INTERVAL, 3);

        // ── directional vanishing-point offset ────────────────────────────
        const keys = this.props.keys;
        const mvx = keys ? ((keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0)) : 0;
        const mvy = keys ? ((keys.ArrowDown  ? 1 : 0) - (keys.ArrowUp   ? 1 : 0)) : 0;
        const mag = Math.hypot(mvx, mvy);
        const nmvx = mag > 0.01 ? mvx / mag : 0;
        const nmvy = mag > 0.01 ? mvy / mag : 0;
        // lerp offset toward target — very slow for cinematic deep-space feel
        this.offsetX += (nmvx * w * 0.27 - this.offsetX) * 0.007 * dt;
        this.offsetY += (nmvy * h * 0.27 - this.offsetY) * 0.007 * dt;

        const cx = (w >> 1) + (this.offsetX | 0);
        const cy = (h >> 1) + (this.offsetY | 0);

        // ── clear ─────────────────────────────────────────────────────────
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, w, h);

        for (const b of this.buckets) b.length = 0;
        this.midTrails.length  = 0;
        this.nearTrails.length = 0;

        // ── update + bucket each star ──────────────────────────────────────
        for (const s of this.stars) {
            const tier = TIERS[s.tier];
            s.r += (BASE_SPEED + s.r * GROW_FACTOR) * tier.speedMult * dt;

            const sx = (cx + s.cosA * s.r) | 0;
            const sy = (cy + s.sinA * s.r) | 0;

            // Recycle when the star leaves the screen
            if (sx < 0 || sx >= w || sy < 0 || sy >= h) {
                const a = Math.random() * Math.PI * 2;
                s.angle = a;
                s.cosA  = Math.cos(a);
                s.sinA  = Math.sin(a);
                // Far-tier stars respawn anywhere on the field, not just at center
                s.r = s.tier === 0
                    ? 2 + Math.random() * this.maxR * 0.90
                    : 2 + Math.random() * 6;
                s.psx   = null;
                continue;
            }

            // Brightness: 0=dim (near center) → 1=bright (near edge)
            const rawBright = Math.min(1, s.r / (maxR * 0.65));
            const bright    = Math.min(1, rawBright + tier.colorBias);
            const bi        = Math.min(4, (bright * 5) | 0);

            // Trail — only mid & near tiers, only when we have a previous position
            if (s.tier >= 1 && s.psx !== null) {
                const arr = s.tier === 2 ? this.nearTrails : this.midTrails;
                arr.push(s.psx, s.psy, sx, sy);
            }
            s.psx = sx;
            s.psy = sy;

            // Size: far always 1 px; near can reach 3 px when bright
            const size = s.tier === 0
                ? 1
                : rawBright < 0.45 ? 1 : (s.tier === 2 && rawBright > 0.78 ? 3 : 2);

            this.buckets[bi].push(sx, sy, size);
        }

        // ── draw trails — only 2 batched stroke calls total ────────────────
        ctx.lineWidth = 1;
        if (this.midTrails.length) {
            ctx.globalAlpha = 0.16;
            ctx.strokeStyle = STAR_COLORS[2];
            ctx.beginPath();
            for (let i = 0; i < this.midTrails.length; i += 4) {
                ctx.moveTo(this.midTrails[i],     this.midTrails[i + 1]);
                ctx.lineTo(this.midTrails[i + 2], this.midTrails[i + 3]);
            }
            ctx.stroke();
        }
        if (this.nearTrails.length) {
            ctx.globalAlpha = 0.36;
            ctx.strokeStyle = STAR_COLORS[3];
            ctx.beginPath();
            for (let i = 0; i < this.nearTrails.length; i += 4) {
                ctx.moveTo(this.nearTrails[i],     this.nearTrails[i + 1]);
                ctx.lineTo(this.nearTrails[i + 2], this.nearTrails[i + 3]);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // ── draw star dots — 5 fill calls for all 150 stars ───────────────
        for (let bi = 0; bi < 5; bi++) {
            const arr = this.buckets[bi];
            if (!arr.length) continue;
            ctx.fillStyle = STAR_COLORS[bi];
            ctx.beginPath();
            for (let i = 0; i < arr.length; i += 3) {
                ctx.rect(arr[i], arr[i + 1], arr[i + 2], arr[i + 2]);
            }
            ctx.fill();
        }
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        // alpha:false avoids compositing overhead; desynchronized allows async GPU flush
        this.ctx    = this.canvas.getContext('2d', { alpha: false, desynchronized: true });

        this.w    = this.canvas.width  = document.body.clientWidth;
        this.h    = this.canvas.height = document.body.clientHeight;
        this.maxR = Math.hypot(this.w / 2, this.h / 2);

        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.w, this.h);

        window.addEventListener('resize', this.resizeHandler);

        // Distribute initial stars: far tier spread across entire screen
        this.stars = [];
        for (let t = 0; t < TIERS.length; t++) {
            for (let i = 0; i < TIER_COUNTS[t]; i++) {
                this.stars.push(this.makeStar(t, true));
            }
        }

        this.then   = performance.now();
        this.animId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
        this.stop = true;
        if (this.animId) cancelAnimationFrame(this.animId);
        window.removeEventListener('resize', this.resizeHandler);
    }

    render() {
        // No will-change:transform — it would force an unnecessary GPU layer
        // on a full-screen canvas that redraws itself completely every frame
        return (
            <canvas
                ref={this.canvasRef}
                className="space-element"
            />
        );
    }
}

export default Space;

