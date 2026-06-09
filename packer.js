import * as fsPromises from "fs/promises";
import * as path from "path";
import * as svgo from "svgo";
const start = Date.now();

const sourcedir = "./source";
const outputdirs = [ "./output" ];
const outputName = `fx-icons-${Date.now()}`;
const nameHeader = "fx-icon-";
const header = (await fsPromises.readFile("./header.css", "utf-8")).split("\n").map((x) => x.replace(/[\r\n]/g, ""));
const root = [ ":root {" ];
const after = [ "}" ];
const map = {};

const categories = await fsPromises.readdir(sourcedir);
for (const category of categories) {
  if (!map[category]) map[category] = [];
  const categorydir = path.join(sourcedir, category);
  const files = await fsPromises.readdir(categorydir);
  for (const file of files) {
    const filedir = path.join(categorydir, file);
    const { name } = path.parse(file);
    const raw = await fsPromises.readFile(filedir, "utf-8");
    const { data: optimized } = svgo.optimize(raw);
    const encoded = `data:image/svg+xml;base64,${btoa(optimized)}`;

    root.push(`  --${nameHeader}${name}: url(${encoded});`);
    after.push(`i.${name} { mask-image: var(--${nameHeader}${name}); }`);
    map[category].push(name);
    console.log(`+ ${category}:${name} (R: ${raw.length}B, O: ${optimized.length}B, E: ${encoded.length}B)`);
  };
};

const css = [ ...header, ...root, ...after ];
const result = css.join("\n");

for (const outputdir of outputdirs) {
  let shouldSkip = false;
  try {
    const stat = await fsPromises.stat(outputdir);
    if (!stat.isDirectory()) {
      shouldSkip = true;
    };
  } catch(error) {
    if (error.code === "ENOENT") {
      await fsPromises.mkdir(outputdir);
    } else {
      shouldSkip = true;
    };
  };
  if (shouldSkip) continue;

  const cssdir = path.join(outputdir, `${outputName}.css`);
  await fsPromises.writeFile(cssdir, result);
  console.log(`+ ${cssdir} (${result.length}B)`);

  const mapdir = path.join(outputdir, `${outputName}.json`);
  const mapraw = JSON.stringify(map);
  await fsPromises.writeFile(mapdir, mapraw);
  console.log(`+ ${mapdir} (${mapraw.length}B)`);
};

const end = Date.now();
const diff = end - start;
console.log(`* DONE (${diff}ms)`);