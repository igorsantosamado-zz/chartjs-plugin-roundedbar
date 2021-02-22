const terser = require("rollup-plugin-terser").terser;
const pkg = require("./package.json");
const clear = require("rollup-plugin-clear");

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} Igor Amado
 * Released under the ${pkg.license} license
 */`;

export default [
  {
    input: "src/plugin.js",
    output: {
      name: "RoundedBar",
      file: `dist/${pkg.name}.js`,
      banner: banner,
      format: "umd",
      indent: false,
      globals: {
        "chart.js": "Chart",
      },
    },
    plugins: [clear({ targets: "dist/*", watch: true })],
    external: ["chart.js"],
  },
  {
    input: "src/plugin.js",
    output: {
      name: "RoundedBar",
      file: `dist/${pkg.name}.min.js`,
      format: "umd",
      indent: false,
      globals: {
        "chart.js": "Chart",
      },
    },
    plugins: [
      terser({
        output: {
          preamble: banner,
        },
      }),
    ],
    external: ["chart.js"],
  },
];
