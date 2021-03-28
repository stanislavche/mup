import * as React from "react";

class Space  extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = null;
        this.ctx = null;
        this.canvasRef = React.createRef();
        this.h = 0;
        this.w = 0;
        this.stars = null;
        this.prevTime = null;
    }

    drawImage()  {
        window.onresize = () => {
            this.setCanvasExtents();
        };
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.setCanvasExtents();
        this.stars = this.makeStars(2000);
        this.init = this.init.bind(this);
        this.tick = this.tick.bind(this);
        requestAnimationFrame(this.init);
    };

    setCanvasExtents() {
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    };

    makeStars(count) {
        const out = [];
        for (let i = 0; i < count; i++) {
            const s = {
                x: Math.random() * 1600 - 800,
                y: Math.random() * 900 - 450,
                z: Math.random() * 1000
            };
            out.push(s);
        }
        return out;
    };



    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    putPixel = (x, y, brightness) => {
        const intensity = brightness * 255;
        const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
        this.ctx.fillStyle = rgb;
        this.ctx.fillRect(x, y, 1, 1);
    };

    moveStars(distance) {
        const count = this.stars.length;
        for (let i = 0; i < count; i++) {
            const s = this.stars[i];
            s.z -= distance;
            while (s.z <= 1) {
                s.z += 1000;
            }
        }
    };

    init(time) {
        this.prevTime = time;
        requestAnimationFrame(this.tick);
    };

    tick(time) {
        let elapsed = time - this.prevTime;
        this.prevTime = time;

        this.moveStars(elapsed * 0.1);

        this.clear();

        const cx = this.w / 2;
        const cy = this.h / 2;

        const count = this.stars.length;
        for (let i = 0; i < count; i++) {
            const star = this.stars[i];

            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
                continue;
            }

            const d = star.z / 1000.0;
            const b = 1 - d * d;

            this.putPixel(x, y, b);
        }

        requestAnimationFrame(this.tick);
    };


    render(){
        return (
            <canvas
                ref={this.canvasRef}
                className={'space-element'}
                style={{ background: "transparent" }}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        );
    }

    componentDidMount(prevProps) {
        console.log('draw');
        this.drawImage();
    }
}
export default Space;