"use strict";

import Chart from "chart.js";
import roundedBarController from "./controllers/controller.roundedBar";
import roundedHorizontalBarController from "./controllers/controller.roundedHorizontalBar"

const layouts = Chart.layouts || Chart.layoutService;

const plugins = Chart.plugins;

const roundedControllers = {
  bar: roundedBarController,
  horizontalBar: roundedHorizontalBarController,
};

// Ported from Chart.js 2.9.4. Modified for rounded bar controllers
function buildOrUpdateControllers() {
  var me = this;
  var newControllers = [];
  var datasets = me.data.datasets;
  var i, ilen;

  for (i = 0, ilen = datasets.length; i < ilen; i++) {
    var dataset = datasets[i];
    var meta = me.getDatasetMeta(i);
    var type = dataset.type || me.config.type;

    if (meta.type && meta.type !== type) {
      me.destroyDatasetMeta(i);
      meta = me.getDatasetMeta(i);
    }
    meta.type = type;
    meta.order = dataset.order || 0;
    meta.index = i;

    if (meta.controller) {
      meta.controller.updateIndex(i);
      meta.controller.linkScales();
    } else {
      var ControllerClass = roundedControllers[meta.type];
      if (ControllerClass === undefined) {
        throw new Error('"' + meta.type + '" is not a chart type.');
      }

      meta.controller = new ControllerClass(me, i);
      newControllers.push(meta.controller);
    }
  }

  return newControllers;
}

const plugin = {
  id: "roundedbar",

  beforeInit: function (chart) {
    chart._roundedBar = {};

    chart.buildOrUpdateControllers = buildOrUpdateControllers;

    // Invalidate plugin cache and create new one
    delete chart.$plugins;
    // For Chart.js 2.7.1 backward compatibility
    delete chart._plugins;
  },
};

export default plugin;

// if the environment is neither amd nor commonjs, register the plugin globally for the samples and tests
if (
  !(typeof define === "function" && define.amd) &&
  !(typeof module === "object" && module.exports)
) {
  Chart.plugins.register(plugin);
}
