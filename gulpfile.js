const { readFileSync } = require("fs");
const { task, src, dest } = require("gulp");
const minify = require("gulp-uglify");
const rename = require("gulp-rename");
const pkg = JSON.parse(readFileSync("package.json"));

task("dist", async () => {
  src("animate.js")
    .pipe(minify({
      output: {
        preamble: 
        "/*!" +
        "\n * AnimateJS v" + pkg.version + " (https://github.com/RodnyE/AnimateJS)" +
        "\n * Copyright 2022 Rodny Estrada" +
        "\n * Licensed under the MIT license" +
        "\n */"
      }
    }))
    .pipe(rename("animate.min.js"))
    .pipe(dest("dist/"));
});