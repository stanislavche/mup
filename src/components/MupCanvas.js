import React, { useRef } from "react";
import track1 from '../audio/promise.mp3';
import boy from '../image/boy.svg';

let frequencyArray = [],
    analyser,
    canvas,
    ctx,
    isPlaying,
    timeout;
const audio = new Audio();
const image = new Image();



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
                initImage();
                initAudio();
            }
        }

    };

    const initImage = () => {
        image.src = boy;
    }

    const initCanvas = () => {
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        requestRef.current = requestAnimationFrame(updateVisualization);
    };

    const initAudio = () => {
        audio.addEventListener("pause", pauseEvent);
        audio.addEventListener("play", playEvent);
        audio.src = track1;
        audio.crossOrigin = "anonymous";
        audio.load();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        audio.play();
    };

    const pauseEvent = () => {
        timeout = setTimeout(()=>{
            isPlaying = false;
        },2000);
    }
    const playEvent = () => {
        clearTimeout(timeout);
        isPlaying = true;
        initCanvas();
    }

    // draw the whole thing
    const drawCanvas = () => {
        if (canvasRef.current) {
            analyser.getByteFrequencyData(frequencyArray);
            let bass = Math.floor(frequencyArray[1]); //1Hz Frequenz
            let radius = 0.45 * canvas.width <= 450 ? -(bass * 0.25 + 0.45 * canvas.width) : -(bass * 0.25 + 100);
            for (let i = 0; i < frequencyArray.length; i++) {
                const position = frequencyArray[i];
                if (i > 0) {
                    ctx.fillStyle = '#86c06c';
                    ctx.fillRect(0, radius, 3, -position/2);
                    ctx.rotate((180 / 128) * Math.PI / 180);
                }
            }
            for (let i = 0; i < frequencyArray.length; i++) {
                const position = frequencyArray[i];
                if (i > 0) {
                    ctx.fillStyle = '#316851';
                    ctx.fillRect(0, radius, 3, -position/2);
                    ctx.rotate(-(180 / 128) * Math.PI / 180);
                }
            }
            ctx.restore();
        }
    };

    function updateVisualization () {
        if (isPlaying) {
            if (canvasRef.current) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.globalCompositeOperation = 'color-dodge';
                ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
                drawImage();
                drawCanvas();
                requestRef.current = requestAnimationFrame(updateVisualization);
            }
        }
    };

    const drawImage = () => {
        ctx.drawImage(image, canvas.width/2 - 150, canvas.height/2 - 150, 300, 300);
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
