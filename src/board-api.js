/*
 * board-api.js — helpers for the inline MCU and LCD board SVGs.
 *
 * The SVGs must be inlined in the page (or loaded with fetch() and inserted)
 * so their ids are part of the document. <img> / <object> will not work.
 *
 *   getCords(id [, space])   -> { x, y }   top-left of the element
 *   getCenter(id [, space])  -> { x, y }   x + width/2, y + height/2
 *   changeLCD(title, content)               update the LCD text fields
 *
 * `space` selects the coordinate system (default "page"):
 *   "page"    CSS pixels from the top-left of the document (includes scroll)
 *   "client"  CSS pixels from the top-left of the viewport
 *   "svg"     the SVG's own viewBox units (independent of container size)
 *   Element   CSS pixels relative to that element's padding box
 *             (handy for an absolutely positioned wire overlay)
 *
 * Because the SVGs scale with their container, "page", "client" and Element
 * values are read live — call again after a resize (see ResizeObserver in demo.html).
 */
(function (global) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function box(id, space) {
    var el = document.getElementById(id);
    if (!el) { console.warn('board-api: no element with id "' + id + '"'); return null; }
    var r = el.getBoundingClientRect();
    var x = r.left, y = r.top, w = r.width, h = r.height;

    if (space === 'svg') {
      var svg = el.ownerSVGElement || el;
      var inv = svg.getScreenCTM().inverse();
      var p1 = new DOMPoint(r.left, r.top).matrixTransform(inv);
      var p2 = new DOMPoint(r.right, r.bottom).matrixTransform(inv);
      x = p1.x; y = p1.y; w = p2.x - p1.x; h = p2.y - p1.y;
    } else if (space instanceof Element) {
      var o = space.getBoundingClientRect();
      x = r.left - o.left - space.clientLeft + space.scrollLeft;
      y = r.top - o.top - space.clientTop + space.scrollTop;
    } else if (space === 'client') {
      /* viewport coordinates, nothing to add */
    } else { /* "page" (default) */
      x += window.scrollX; y += window.scrollY;
    }
    return { x: x, y: y, width: w, height: h };
  }

  function getCords(id, space) {
    var b = box(id, space);
    return b && { x: b.x, y: b.y };
  }

  function getCenter(id, space) {
    var b = box(id, space);
    return b && { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }

  function setText(el, value) {
    var lines = String(value).split(/\r?\n/);
    if (lines.length === 1) { el.textContent = lines[0]; return; }
    var x = el.getAttribute('x');
    el.textContent = '';
    lines.forEach(function (line, i) {
      var t = document.createElementNS(SVG_NS, 'tspan');
      t.setAttribute('x', x);
      if (i) t.setAttribute('dy', '1.2em');        // line spacing
      t.textContent = line || '\u00A0';             // keep blank lines
      el.appendChild(t);
    });
  }

  // Pass null/undefined to leave a field unchanged. "\n" in content = new line.
  function changeLCD(newTitle, newContent) {
    var title = document.getElementById('lcd-title');
    var content = document.getElementById('lcd-content');
    if (title && newTitle != null) setText(title, newTitle);
    if (content && newContent != null) setText(content, newContent);
  }

  global.getCords = getCords;
  global.getCenter = getCenter;
  global.changeLCD = changeLCD;
})(window);
