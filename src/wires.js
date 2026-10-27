var stage = document.getElementById('stage'), wires = document.getElementById('wires');
var links = [['MCU_DIN','LCD_DIN'],['MCU_CLK','LCD_CLK'],['MCU_CS_LCD','LCD_CS'],['MCU_RST','LCD_RST'],['MCU_GND','LCD_GND']];

function drawWires() {
  wires.innerHTML = '';
  links.forEach(function (l) {
    var a = getCenter(l[0], stage), b = getCenter(l[1], stage);
    var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', a.x); ln.setAttribute('y1', a.y); ln.setAttribute('x2', b.x); ln.setAttribute('y2', b.y);
    wires.appendChild(ln);
  });
  var c = getCenter('MCU_DIN'), k = getCords('MCU_DIN'), s = getCenter('MCU_DIN', 'svg');
  document.getElementById('readout').textContent =
    'MCU_DIN  getCords: ' + k.x.toFixed(1) + ', ' + k.y.toFixed(1) +
    '   getCenter: ' + c.x.toFixed(1) + ', ' + c.y.toFixed(1) +
    '   (svg units: ' + s.x.toFixed(1) + ', ' + s.y.toFixed(1) + ')';
}


new ResizeObserver(drawWires).observe(document.getElementById('mcu-container'));
new ResizeObserver(drawWires).observe(document.getElementById('lcd-container'));
window.addEventListener('scroll', drawWires); drawWires();
