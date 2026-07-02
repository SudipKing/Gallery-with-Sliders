const express = require("express");
const router = express.Router();
const gallery = require("../data/galleryData");

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

router.get("/gallery", (req, res) => {
  const search = req.query.search;
  const category = req.query.category;

  let results = gallery;

  if (search) {
    results = results.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    results = results.filter(item => item.category === category);
  }

  res.render("gallery", {
    title: "Gallery",
    gallery: results,
    search: search || "",
    category: category || ""
  });
});

router.get("/gallery/:id", (req, res) => {
  const image = gallery.find(g => g.id === parseInt(req.params.id));

  if (!image) return res.status(404).send("Image not found");

  res.render("image", {
    title: image.title,
    image
  });
});

module.exports = router;
