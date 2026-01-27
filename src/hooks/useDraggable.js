import { useRef, useState, useCallback } from 'react';

export function useDraggable() {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);

    const onMouseDown = useCallback((e) => {
        if (!ref.current) return;
        setIsDragging(false);
        setHasMoved(false);
        setStartX(e.pageX - ref.current.offsetLeft);
        setScrollLeft(ref.current.scrollLeft);
    }, []);

    const onMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onMouseUp = useCallback(() => {
        // We keep isDragging as whatever it was during the move
        // but we use a small timeout to let the click event finish
        // before resetting it, if needed by the component.
        setTimeout(() => {
            setIsDragging(false);
            setHasMoved(false);
        }, 50);
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!ref.current || e.buttons !== 1) return; // Only drag if left mouse button is down

        const x = e.pageX - ref.current.offsetLeft;
        const distance = Math.abs(x - startX);

        if (distance > 5) { // Threshold for dragging
            setIsDragging(true);
            setHasMoved(true);
            e.preventDefault();
            const walk = (x - startX) * 2; // Scroll speed
            ref.current.scrollLeft = scrollLeft - walk;
        }
    }, [startX, scrollLeft]);

    return {
        ref,
        onMouseDown,
        onMouseLeave,
        onMouseUp,
        onMouseMove,
        isDragging
    };
}
