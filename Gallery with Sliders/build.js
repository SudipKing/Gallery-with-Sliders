const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const gallery = require("./data/galleryData");

const root = __dirname;
const views = path.join(root, "views");
const publicDir = path.join(root, "public");
const dist = path.join(root, "dist");
const base = process.env.BASE_PATH || "/Gallery-with-Sliders";

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

function render(template, data) {
  return ejs.renderFile(path.join(views, template), {
    ...data,
    base
  });
}

function fixLinks(html) {
  return html
    .replace(/href="\//g, `href="${base}/`)
    .replace(/src="\//g, `src="${base}/`)
    .replace(/action="\//g, `action="${base}/`);
}

async function writePage(file, template, data) {
  const html = fixLinks(await render(template, data));
  const output = path.join(dist, file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}

async function build() {
  fs.cpSync(publicDir, dist, { recursive: true });

  await writePage("index.html", "index.ejs", { title: "Home" });
  await writePage("gallery/index.html", "gallery.ejs", {
    title: "Gallery",
    gallery,
    search: "",
    category: ""
  });

  for (const item of gallery) {
    await writePage(`gallery/${item.id}/index.html`, "image.ejs", {
      title: item.title,
      image: item
    });
  }

  fs.writeFileSync(path.join(dist, ".nojekyll"), "");
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
