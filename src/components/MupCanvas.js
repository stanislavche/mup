import React, { useRef } from "react";

let frequencyArray = [];
let analyser;
let canvas;
let ctx;
let bars;

const MupCanvas = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    const handleInit = () => {
        initAudio();
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        ctx.lineWidth = 0.5;
        ctx.lineCap = "round";
        bars = Math.round(canvas.width);
        requestRef.current = requestAnimationFrame(drawCanvas);
    };

    const initAudio = () => {
        const audio = new Audio();
        audio.src =
            "https://s3.us-west-2.amazonaws.com/storycreator.uploads/ck9kpb5ss0xf90132mgf8z893?client_id=d8976b195733c213f3ead34a2d95d1c1";
        audio.crossOrigin = "anonymous";
        audio.load();

        const context = new (window.AudioContext || window.webkitAudioContext)();
        analyser = context.createAnalyser();
        const source = context.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(context.destination);

        frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        audio.play();
    };

    // draw the whole thing
    const drawCanvas = () => {
        if (canvasRef.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            analyser.getByteFrequencyData(frequencyArray);

            const centerY = canvas.height / 2;
            for (var i = 0; i < bars; i++) {
                const height = frequencyArray[i];
                if (height > 0) drawLine(i * 2, height, centerY, ctx);
            }

            requestRef.current = requestAnimationFrame(drawCanvas);
        }
    };

    // dray lines around the circle
    const drawLine = (i, height, centerY, ctx) => {
        ctx.beginPath();
        ctx.moveTo(i, centerY + height);
        ctx.lineTo(i, centerY - height);
        ctx.stroke();
    };

    return (
        <>
            <button onClick={handleInit}>Start Visualizer</button>
            <canvas
                ref={canvasRef}
                style={{ background: "#f5f5f5" }}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </>
    );
};

export default MupCanvas;
