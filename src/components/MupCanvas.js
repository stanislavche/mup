import React, { useRef } from "react";
import track1 from '../audio/promise.mp3';

let frequencyArray = [];
let analyser;
let canvas;
let ctx;
let bars;
const audio = new Audio();

const MupCanvas = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    const handleInit = () => {
        if (!audio.paused) {
            audio.pause();
        } else {
            if (audio.src && audio.src.length) {
                audio.play();
            } else {
                initAudio();
                canvas = canvasRef.current;
                ctx = canvas.getContext("2d");
                ctx.lineWidth = 2;
                ctx.lineCap = "butt";
                bars = Math.round(canvas.width);
                requestRef.current = requestAnimationFrame(drawCanvas);
            }
        }

    };

    const initAudio = () => {
        audio.src = track1;
        audio.crossOrigin = "anonymous";
        audio.load();

        const context = new (window.AudioContext || window.webkitAudioContext)();
        analyser = context.createAnalyser();
        const source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        console.log(frequencyArray);
        audio.play();
    };

    // draw the whole thing
    const drawCanvas = () => {
        if (canvasRef.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(frequencyArray);

            const centerY = canvas.height / 2;
            for (var i = 0; i < frequencyArray.length; i++) {
                const height = frequencyArray[i];
                if (height > 0) drawLine(i * 2, height, centerY, ctx);
            }

            requestRef.current = requestAnimationFrame(drawCanvas);
        }
    };

    // dray lines around the circle
    const drawLine = (i, height, centerY, ctx) => {
        ctx.beginPath();
        ctx.strokeStyle = '#dff8d0';
        ctx.moveTo(i, centerY - (height/2));
        ctx.lineTo(i, centerY + (height/2));
        ctx.stroke();

        if (height > 150) {
           drawStar(i, height, centerY, ctx);
        }
    };

    const drawStar = (i, height, centerY, ctx) => {
        ctx.fillStyle = '#86c06c';
        ctx.fillRect(i, centerY - height - 30, 2, 2);
        ctx.fillRect(i, centerY + height + 30, 2, 2);
        //console.log(i, height);
    }

    return (
        <>
            <button onClick={handleInit}>Start</button>
            <canvas
                ref={canvasRef}
                style={{ background: "#071820" }}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </>
    );
};

export default MupCanvas;
