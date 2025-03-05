import React from 'react';

const CircularHalo = ({
    opacity = 1.0
}) => {
    const haloStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `100%`,
        height: `100%`,
        background: `radial-gradient(circle, rgba(255,255,255, 0) 0%, rgba(255,255,255,${opacity}) 200%)`,
        pointerEvents: 'none',
        zIndex: 10
    };

    return <div style={haloStyle} />;
};

export default CircularHalo;