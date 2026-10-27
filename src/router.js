/**
 * Fully Optimized Circuit Trace Router & Component Dragging Engine
 */

const wireLayer = document.getElementById('wire-layer');

// Configuration mapping for connection pairs (viewBox="0 0 200 200")
const connectionPairs = [
    { 
        from: 'mcu-con-1', parentId: 'mcu-block', svgId: 'mcu-svg', localX: 180, localY: 70,
        to: 'lcd-con-1', targetId: 'lcd-block', svgIdTarget: 'lcd-svg', targetX: 20, targetY: 70,
        class: 'pair-1', color: '#06b6d4' // Neon Cyan
    },
    { 
        from: 'mcu-con-2', parentId: 'mcu-block', svgId: 'mcu-svg', localX: 180, localY: 130, 
        to: 'lcd-con-2', targetId: 'lcd-block', svgIdTarget: 'lcd-svg', targetX: 20, targetY: 130,
        class: 'pair-2', color: '#f97316' // Neon Orange
    }
];

/**
 * Fits the wire layer to the absolute browser window size
 */
function fitCanvasToWindow() {
    if (!wireLayer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    wireLayer.setAttribute('width', w);
    wireLayer.setAttribute('height', h);
    wireLayer.setAttribute('style', `position:absolute; top:0; left:0; width:${w}px; height:${h}px; z-index:9999; pointer-events:none; display:block !important;`);
}

/**
 * Maps standard internal SVG coordinates directly to the absolute page layout grid
 */
function getAbsoluteVectorCoords(blockId, svgId, localX, localY) {
    const block = document.getElementById(blockId);
    const svg = document.getElementById(svgId);
    if (!block || !svg) return null;

    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return null;

    // Scale factors matching the original 200x200 viewBox definitions
    const scaleX = svgRect.width / 200;
    const scaleY = svgRect.height / 200;

    return {
        x: svgRect.left + (localX * scaleX) + window.scrollX,
        y: svgRect.top + (localY * scaleY) + window.scrollY
    };
}

/**
 * Generates an orthogonal Manhattan wire channel path to prevent overlapping lines
 */
function calculateRoute(start, end, pairIndex) {
    const midX = start.x + (end.x - start.x) * 0.5;
    const laneOffset = (pairIndex - 0.5) * 20;
    const channelX = midX + laneOffset;

    return [
        { x: start.x, y: start.y },
        { x: channelX, y: start.y },
        { x: channelX, y: end.y },
        { x: end.x, y: end.y }
    ];
}

/**
 * Smooths sharp 90-degree corners into wide-radius turns using SVG quadratic bezier commands (Q)
 */
function buildRoundedPath(points, radius = 20) {
    if (!points || points.length < 2) return '';
    
    const startPoint = points[0];
    let pathData = `M ${startPoint.x} ${startPoint.y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const d1x = curr.x - prev.x;
        const d1y = curr.y - prev.y;
        const d2x = next.x - curr.x;
        const d2y = next.y - curr.y;

        const len1 = Math.sqrt(d1x * d1x + d1y * d1y);
        const len2 = Math.sqrt(d2x * d2x + d2y * d2y);

        if (len1 === 0 || len2 === 0) continue;

        const appliedRadius = Math.min(radius, len1 / 2, len2 / 2);

        const startX = curr.x - (d1x / len1) * appliedRadius;
        const startY = curr.y - (d1y / len1) * appliedRadius;
        const endX = curr.x + (d2x / len2) * appliedRadius;
        const endY = curr.y + (d2y / len2) * appliedRadius;

        pathData += ` L ${startX} ${startY} Q ${curr.x} ${curr.y}, ${endX} ${endY}`;
    }

    const endPoint = points[points.length - 1];
    pathData += ` L ${endPoint.x} ${endPoint.y}`;
    return pathData;
}

/**
 * Clears old paths and draws the updated connection lines
 */
function updateCircuitTraces() {
    if (!wireLayer) return;
    wireLayer.innerHTML = '';

    connectionPairs.forEach((pair, index) => {
        const startCoords = getAbsoluteVectorCoords(pair.parentId, pair.svgId, pair.localX, pair.localY);
        const endCoords = getAbsoluteVectorCoords(pair.targetId, pair.svgIdTarget, pair.targetX, pair.targetY);

        if (!startCoords || !endCoords) return;

        const routingPoints = calculateRoute(startCoords, endCoords, index);
        const svgPathString = buildRoundedPath(routingPoints, 24);

        const pathElement = document.createElementNS('http://w3.org', 'path');
        pathElement.setAttribute('d', svgPathString);
        pathElement.setAttribute('class', `trace-wire ${pair.class}`);
        
        // Inline styles to guarantee high-performance cross-browser renders
        pathElement.setAttribute('style', `fill:none; stroke:${pair.color}; stroke-width:5px; stroke-linecap:round; stroke-linejoin:round;`);
        
        wireLayer.appendChild(pathElement);
    });
}

/**
 * Custom Drag-and-Drop Handler Engine
 */
function makeComponentDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;
    
    element.addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        if (e.target.tagName === 'circle' || e.target.tagName === 'path') return;
        
        e.preventDefault();
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        document.addEventListener('mouseup', closeDragElement);
        document.addEventListener('mousemove', elementDrag);
    }

    function elementDrag(e) {
        e.preventDefault();
        offsetX = mouseX - e.clientX;
        offsetY = mouseY - e.clientY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        element.style.top = (element.offsetTop - offsetY) + "px";
        element.style.left = (element.offsetLeft - offsetX) + "px";
        
        updateCircuitTraces();
    }

    function closeDragElement() {
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('mousemove', elementDrag);
    }
}

// Ensure the canvas is correctly sized before drawing
fitCanvasToWindow();

// Initialize drag functionality on components
document.querySelectorAll('.hardware-component').forEach(makeComponentDraggable);

// Hook performance-optimized window event triggers
let frameId;
window.addEventListener('resize', () => {
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
        fitCanvasToWindow();
        updateCircuitTraces();
    });
});

window.addEventListener('load', () => {
    fitCanvasToWindow();
    updateCircuitTraces();
});

document.addEventListener('DOMContentLoaded', () => {
    fitCanvasToWindow();
    updateCircuitTraces();
});

// Layout fallback interval to ensure calculation accuracy after asset loads
setTimeout(() => {
    fitCanvasToWindow();
    updateCircuitTraces();
}, 150);
