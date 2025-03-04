export const requestAnimationFrame = (fn: FrameRequestCallback): void => {
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        window.requestAnimationFrame(fn);
    } else {
        fn(performance.now());
    }
};

export const cancelAnimationFrame = (id?: number): void => {
    if (typeof window !== 'undefined' && 'cancelAnimationFrame' in window && id !== undefined) {
        window.cancelAnimationFrame(id);
    }
};
