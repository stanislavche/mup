import React, { useRef } from "react";
import track1 from '../audio/promise.mp3';

let frequencyArray = [];
let analyser;
let canvas;
let ctx;
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
                requestRef.current = requestAnimationFrame(updateVisualization);
            }
        }

    };

    const initAudio = () => {
        audio.src = track1;
        audio.crossOrigin = "anonymous";
        audio.load();

        const context = new (window.AudioContext || window.webkitAudioContext)();
        analyser = context.createAnalyser();
        analyser.fftSize = 512;
        const source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        audio.play();
    };

    // draw the whole thing
    const drawCanvas = (frequencyArray) => {
        if (canvasRef.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            //ctx.globalCompositeOperation='source-over';
            ctx.scale(0.5, 0.5);
            ctx.translate(window.innerWidth, window.innerHeight);


            var bass = Math.floor(frequencyArray[1]); //1Hz Frequenz
            var radius = 0.45 * canvas.width <= 450 ? -(bass * 0.25 + 0.45 * canvas.width) : -(bass * 0.25 + 300);
            for (var i = 0; i < frequencyArray.length; i++) {
                const position = frequencyArray[i];
                if (i > 0) {
                    ctx.fillStyle = '#86c06c';
                    ctx.fillRect(0, radius, 4, -position);
                    ctx.rotate((180 / 128) * Math.PI / 180);
                }
            }
            for (var i = 0; i < frequencyArray.length; i++) {
                const position = frequencyArray[i];
                if (i > 0) {
                    ctx.fillStyle = '#316851';
                    ctx.fillRect(0, radius, 3, -position);
                    ctx.rotate(-(180 / 128) * Math.PI / 180);
                }
            }
            ctx.restore();
        }
    };

    function updateVisualization () {
        analyser.getByteFrequencyData(frequencyArray);
        drawCanvas(frequencyArray);
        requestRef.current = requestAnimationFrame(updateVisualization);
    };

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
