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
        this.fpsInterval = 1000 / 24;
        this.startTime = null;
        this.now = null;
        this.then = null;
        this.elapsed = null;
        this.angle = (360 / 64) * Math.PI / 180;
    }

    initCanvas() {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        this.then = window.performance.now();
        this.startTime = this.then;
        this.updateVisualization();
    }

    initAudio() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        const source = audioContext.createMediaElementSource(this.props.audio);
        source.connect(this.analyser);
        this.analyser.connect(audioContext.destination);
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
            let bass = Math.floor(this.frequencyArray[1]); //1Hz Frequenz
            //let radius = -(bass * 0.25 + 120);
            let radius = -170;

            for (let i = 0; i < this.frequencyArray.length; i++) {
                let position = this.frequencyArray[i];
                if (i > 0) {
                    if (i < 14 && position > 100) {
                        position = position - (80 - i*5);
                    }
                    this.ctx.fillStyle = '#86c06c';
                    this.ctx.fillRect(0, radius, 6, -position/3);
                    this.ctx.rotate(this.angle);
                    // this.ctx.fillStyle = '#316851';
                    // this.ctx.fillRect(0, radius, 4, -position/2);
                    // this.ctx.rotate((180 / 128) * Math.PI / 180);
                }
            }
            // for (let i = 0; i < this.frequencyArray.length; i++) {
            //     const position = this.frequencyArray[i];
            //     if (i > 0) {
            //         this.ctx.fillStyle = '#86c06c';
            //         //this.ctx.fillStyle = '#316851';
            //         this.ctx.fillRect(0, radius, 6, -position/3);
            //         this.ctx.rotate(-(360 / 128) * Math.PI / 180);
            //     }
            // }
            this.ctx.restore();
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
                    this.ctx.globalCompositeOperation = 'color-dodge';
                    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

                    this.drawCanvas();
                }
            }
        }
    }

    render() {
        return (
            <>
                <canvas
                    ref={this.canvasRef}
                    className={'visualiser-element'}
                    style={{background: "transparent"}}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />

            </>
        );
    }

    componentDidMount(prevProps) {
        if (!prevProps || prevProps && prevProps.audio !== this.props.audio) {
            this.initAudio();
            this.pausePauseEvent();
        }
        if (!prevProps || prevProps && prevProps.startAnimation !== this.props.startAnimation) {
            this.pausePauseEvent();
        }
    }
}

export default Visualiser;
