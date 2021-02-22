"use strict";

import Chart from "chart.js";

let Rectangle = Chart.elements.Rectangle;

export default Rectangle.extend({
  draw: function () {
    const me = this;
    const ctx = me._chart.ctx;
    const vm = me._view;
    const rects = vm.boundingRects(vm);
    const outer = rects.outer;
    const inner = rects.inner;
    const addRectPath = vm.addRoundedRectPath;

    // ctx.fillRect(outer.x, outer.y, outer.w, outer.h);

    if (outer.w === inner.w && outer.h === inner.h) {
      return;
    }

    ctx.save();

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRectPath(ctx, outer);
      ctx.clip();
      addRectPath(ctx, inner);
      ctx.fillStyle = vm.borderColor;
      ctx.fill("evenodd");
    }

    ctx.beginPath();
    addRectPath(ctx, inner);
    ctx.fillStyle = vm.backgroundColor;
    ctx.fill();
    // ctx.rect(outer.x, outer.y, outer.w, outer.h);
    // ctx.clip();
    // ctx.fillStyle = vm.borderColor;
    // ctx.rect(inner.x, inner.y, inner.w, inner.h);
    // ctx.fill("evenodd");
    // ctx.restore();
  },
});
