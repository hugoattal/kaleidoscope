export function animationLoop(callback: (delta: number) => void | Promise<void>, options: { fps?: number } = { }) {
    let animating = true;
    options.fps ??= 60;

    function stopHandler() {
        animating = false;
    }

    let last = 0;
    let delta = 0;

    async function frame(timestamp: number) {
        if (!last) {
            last = timestamp;
        }

        const currentDelta = timestamp - last;
        last = timestamp;

        if (!animating) {
            return;
        }

        delta += currentDelta;

        if (delta > 1000 / options.fps) {
            await callback(delta);
            delta = 0;
        }

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    return stopHandler; // Need to be called when component is destroyed
}
