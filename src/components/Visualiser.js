import React from "react";

class Visualiser extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.canvasRef = React.createRef();
        this.requestRef = React.createRef();
        this.isPlaying = false;
        this.timeout = null;
        this.analyser = null
        this.frequencyArray = [];
        this.updateVisualization = this.updateVisualization.bind(this);

        //perfomance increase
        this.stop = false;
        this.frameCount = 0;
        this.fps = null;
        this.fpsInterval = 1000 / 30;
        this.startTime = null;
        this.now = null;
        this.then = null;
        this.elapsed = null;
        this.angle = (2 * Math.PI) / 127; // 127 bars drawn (i=1…127) → exact 360°, no gap
    }

    initCanvas() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.then = window.performance.now();
        this.startTime = this.then;
        this.updateVisualization();
    }

    initAudio() {
        this.analyser = this.props.analyser;
        this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    pausePauseEvent() {
        if(this.props.startAnimation) {
            clearTimeout(this.timeout);
            this.isPlaying = true;
            this.initCanvas();
        } else {
            this.timeout = setTimeout(() => {
                this.isPlaying = false;
            },2000);
        }
    }

    // draw the whole thing
    drawCanvas() {
        if (this.canvasRef.current) {
            this.analyser.getByteFrequencyData(this.frequencyArray);

            // ── directional thrust weighting ──────────────────────────────
            // Arrow direction  = movement direction
            // Exhaust (fire)   = OPPOSITE of movement on screen
            // NOTE: ctx.rotate(Math.PI) inverts canvas axes, so we do NOT
            //       negate here — the π rotation handles the flip.
            // e.g. press RIGHT → mvx=1 → bars boosted on LEFT side of screen ✓
            const keys = this.props.keys;
            let anyKey = false, ex = 0, ey = 0;
            if (keys) {
                const mvx = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
                const mvy = (keys.ArrowDown  ? 1 : 0) - (keys.ArrowUp   ? 1 : 0);
                const mag = Math.hypot(mvx, mvy);
                anyKey = mag > 0.01;
                // Same direction as movement — the π rotation makes it exhaust-opposite on screen
                if (anyKey) { ex = mvx / mag; ey = mvy / mag; }
            }

            const bass   = Math.floor(this.frequencyArray[1]);
            const radius = -(bass * 0.25 + 120);
            const step   = this.angle;

            // ── main fire bars ────────────────────────────────────────────
            this.ctx.save(); // save A (post-translate, before rotations)
            // Rotate 180° so bass/short-bar zone sits at bottom (behind controls)
            // and high-freq content fills the top — eliminates visible bald spot
            this.ctx.rotate(Math.PI);

            for (let i = 0; i < this.frequencyArray.length; i++) {
                let pos = this.frequencyArray[i];
                if (i > 0) {
                    // Bass correction for first few bins
                    if (i < 14 && pos > 100) pos = pos - (80 - i * 5);

                    // Directional thrust weight
                    if (anyKey) {
                        const barAngle = (i - 1) * step;
                        // barDir in canvas space (0=UP, CW positive):
                        const bx = Math.sin(barAngle);   // rightward component
                        const by = -Math.cos(barAngle);  // downward component
                        const dot = bx * ex + by * ey;
                        // weight: 1.0 at exhaust dir, ~0.04 at movement dir
                        pos *= Math.max(0.04, (1 + dot) / 2);
                    }

                    this.ctx.fillStyle = '#5a9470';
                    this.ctx.fillRect(0, radius, 9, -pos / 3);   // was 7 → 9: fills outer-edge gaps
                    // Hot inner core: bright thin line for high-energy bars
                    if (pos > 55) {
                        this.ctx.fillStyle = '#86c06c';
                        this.ctx.fillRect(1, radius, 6, -pos / 4);  // was 4 → 6
                    }
                    if (pos > 140) {
                        this.ctx.fillStyle = '#dff8d0';
                        this.ctx.fillRect(2, radius, 3, -Math.min(pos / 5, 38)); // was 2 → 3
                    }
                    this.ctx.rotate(step);
                }
            }

            this.ctx.restore(); // restore A
            this.ctx.restore(); // restore pre-translate (original save from updateVisualization)
        }
    }

    updateVisualization(newTime) {
        if (this.stop) {
            return;
        }
        if (this.isPlaying) {
            if (this.canvasRef.current) {

                this.requestRef.current = requestAnimationFrame(this.updateVisualization);
                this.now = newTime;
                this.elapsed = this.now - this.then;

                if (this.elapsed > this.fpsInterval) {
                    this.then = this.now - (this.elapsed % this.fpsInterval);
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.save();
                    this.ctx.globalCompositeOperation = 'lighter';
                    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

                    this.drawCanvas();
                }
            }
        }
    }

    render() {
        const { keys } = this.props;
        const tiltX = keys ? ((keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0)) : 0;
        const tiltY = keys ? ((keys.ArrowDown  ? 1 : 0) - (keys.ArrowUp   ? 1 : 0)) : 0;

        return (
            <>
                <canvas
                    ref={this.canvasRef}
                    className={'visualiser-element'}
                    style={{
                        background: "transparent",
                        transformOrigin: '50% 50%',
                        transform: `perspective(700px) rotate(${tiltX * 22}deg) rotateX(${tiltY * 15}deg)`,
                        transition: 'transform 0.15s ease-out',
                    }}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />

            </>
        );
    }

    componentDidMount(prevProps) {
        if (!prevProps || (prevProps && prevProps.audio !== this.props.audio)) {
            this.initAudio();
            this.pausePauseEvent();
        }
        if (!prevProps || (prevProps && prevProps.startAnimation !== this.props.startAnimation)) {
            this.pausePauseEvent();
        }
    }
}

export default Visualiser;
