import React from 'react';
import boy from '../image/boy.gif';

/**
 * Pilot Screen — immersive space flight view.
 * boy.gif slowly tilts with arrow keys; music plays in background;
 * no progress ring, no track controls.
 */
function PilotScreen({ keys }) {
    const tiltX = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
    const tiltY = (keys.ArrowDown  ? 1 : 0) - (keys.ArrowUp   ? 1 : 0);

    const boyStyle = {
        transform: `perspective(900px) rotate(${tiltX * 6}deg) rotateX(${tiltY * 4}deg)`,
        transition: 'transform 0.6s ease-out',
    };

    return (
        <div className="pilot-screen">
            <img
                className="pilot-boy"
                src={boy}
                alt="pilot"
                style={boyStyle}
            />
        </div>
    );
}

export default PilotScreen;

