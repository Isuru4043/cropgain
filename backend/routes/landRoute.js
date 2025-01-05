// routes/landRoute.js
const express = require("express");
const router = express.Router();
const Land = require("../models/land");

// Get all land sections
router.get("/", async (req, res) => {
  try {
    const lands = await Land.find();
    res.json(lands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific land section
router.get("/:section", async (req, res) => {
  try {
    const land = await Land.findOne({ section: req.params.section });
    if (!land) return res.status(404).json({ message: "Section not found" });
    res.json(land);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new land section
router.post("/", async (req, res) => {
  const land = new Land({
    section: req.body.section,
    crops: req.body.crops || [],
  });
  try {
    const newLand = await land.save();
    res.status(201).json(newLand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a new crop to a section
router.post("/:section/crops", async (req, res) => {
  try {
    const land = await Land.findOne({ section: req.params.section });
    if (!land) return res.status(404).json({ message: "Section not found" });

    const newCrop = {
      crop: req.body.crop,
      area: req.body.area,
      plantingDate: req.body.plantingDate,
      harvestDate: req.body.harvestDate,
      numberOfPlants: req.body.numberOfPlants,
    };

    land.crops.push(newCrop);
    await land.save();
    res.status(201).json(newCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update crop details
router.put("/:section/crops/:cropId", async (req, res) => {
  try {
    const land = await Land.findOne({ section: req.params.section });
    if (!land) return res.status(404).json({ message: "Section not found" });

    const crop = land.crops.id(req.params.cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Update fields
    crop.crop = req.body.crop || crop.crop;
    crop.area = req.body.area || crop.area;
    crop.plantingDate = req.body.plantingDate || crop.plantingDate;
    crop.harvestDate = req.body.harvestDate || crop.harvestDate;
    crop.numberOfPlants =
      req.body.numberOfPlants !== undefined
        ? req.body.numberOfPlants
        : crop.numberOfPlants;

    await land.save();
    res.json(crop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a crop from a section
router.delete("/:section/crops/:cropId", async (req, res) => {
  try {
    const land = await Land.findOne({ section: req.params.section });
    if (!land) return res.status(404).json({ message: "Section not found" });

    const crop = land.crops.id(req.params.cropId);
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    crop.remove();
    await land.save();
    res.json({ message: "Crop deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
