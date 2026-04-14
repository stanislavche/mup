import React, { useRef, useEffect } from 'react';
import boy from '../image/boy.gif';

/**
 * Pilot Screen — immersive space flight view.
 * boy.gif smoothly tilts with arrow/WASD keys via rAF lerp (no CSS transition).
 */
function PilotScreen({ keys }) {
    const imgRef  = useRef(null);
    const sxRef   = useRef(0);   // smooth tilt X
    const syRef   = useRef(0);   // smooth tilt Y
    const keysRef = useRef(keys);

    // keep keysRef in sync without re-running the animation effect
    useEffect(() => { keysRef.current = keys; }, [keys]);

    useEffect(() => {
        let rafId;
        const tick = () => {
            rafId = requestAnimationFrame(tick);
            const k  = keysRef.current;
            const tx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
            const ty = (k.ArrowDown  ? 1 : 0) - (k.ArrowUp   ? 1 : 0);
            sxRef.current += (tx - sxRef.current) * 0.04;
            syRef.current += (ty - syRef.current) * 0.04;
            if (imgRef.current) {
                imgRef.current.style.transform =
                    `perspective(900px) rotate(${sxRef.current * 6}deg) rotateX(${syRef.current * 4}deg)`;
            }
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    return (
        <div className="pilot-screen">
            <img
                ref={imgRef}
                className="pilot-boy"
                src={boy}
                alt="pilot"
            />
        </div>
    );
}

export default PilotScreen;
