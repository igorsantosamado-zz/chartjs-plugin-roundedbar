const { src, dest, parallel } = require("gulp");
const loadConfigFile = require("rollup/dist/loadConfigFile");
const path = require("path");
const rollup = require("rollup");
const gulpClean = require("gulp-clean");
const eslint = require("gulp-eslint");
const streamify = require("gulp-streamify");
const replace = require('gulp-replace')

const argv = require("yargs")
  .options("output", { alias: "o", default: "dist" })
  .options("samples-dir", { default: "samples" })
  .options("docs-dir", { default: "docs" }).argv;

async function build() {
  // load the config file next to the current script;
  // the provided config object has the same effect as passing "--format es"
  // on the command line and will override the format of all outputs
  loadConfigFile(path.resolve(__dirname, "./rollup.config.js"), {
    format: "umd",
  }).then(async ({ options, warnings }) => {
    // "warnings" wraps the default `onwarn` handler passed by the CLI.
    // This prints all warnings up to this point:
    console.log(`We currently have ${warnings.count} warnings`);

    // This prints all deferred warnings
    warnings.flush();

    // options is an array of "inputOptions" objects with an additional "output"
    // property that contains an array of "outputOptions".
    // The following will generate all outputs for all inputs, and write them to disk the same
    // way the CLI does it:
    for (const optionsObj of options) {
      const bundle = await rollup.rollup(optionsObj);
      await Promise.all(optionsObj.output.map(bundle.write));
    }

    // You can also pass this directly to "rollup.watch"
    // rollup.watch(options);
  });
}

function clean() {
  return src("dist/", { read: false }).pipe(gulpClean());
}

function samples() {
  const out = path.join(argv.output, argv.samplesDir);
  return src("samples/**/*", { base: "samples" })
    .pipe(
      streamify(
        replace(/src="((?:\.\.\/)+)dist\//g, 'src="$1', { skipBinary: true })
      )
    )
    .pipe(dest(out));
}

async function lint() {
  const files = ["src/**/*.js", "*.js"];

  const options = {
    rules: {
      complexity: [1, 10],
      "max-statements": [1, 30],
    },
  };

  return src(files).pipe(
    eslint(options).pipe(eslint.format()).pipe(eslint.failAfterError())
  );
}

exports.build = build;
exports.clean = clean;
exports.lint = lint;
exports.samples = samples;
exports.default = parallel(build);
