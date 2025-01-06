const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { Planting, Notification } = require('../models/plantmodel');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all plantings
router.get('/', async (req, res) => {
  try {
    const plantings = await Planting.find();
    res.json(plantings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST route to add a new planting
// POST route to add a new planting
router.post('/', async (req, res) => {
    try {
      const { cropType, section, plantingDate, numberOfPlants, growthStage, healthStatus } = req.body;
  
      // Validate required fields
      if (!cropType || !section || !plantingDate) {
        return res.status(400).json({ message: 'cropType, section, and plantingDate are required' });
      }
  
      // Create a new planting document
      const planting = new Planting({
        cropType,
        section,
        plantingDate,
        numberOfPlants,
        growthStage,
        healthStatus,
        growthMetrics: { days: 0, height: 0 } // Default values for growthMetrics
      });
  
      // Save the planting to the database
      const newPlanting = await planting.save();
  
      // Return the saved planting
      res.status(201).json(newPlanting);
    } catch (error) {
      console.error('Error saving planting:', error); // Log the error
      res.status(500).json({ message: error.message });
    }
  });



// Update planting
// Update planting
router.put('/:id', async (req, res) => {
    try {
      const planting = await Planting.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!planting) return res.status(404).json({ message: 'Planting not found' });
      res.json(planting);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });



// Delete planting
router.delete('/:id', async (req, res) => {
    try {
      const planting = await Planting.findById(req.params.id);
      if (!planting) return res.status(404).json({ message: 'Planting not found' });
  
      // Delete associated photos from Cloudinary
      for (const photo of planting.photos) {
        if (photo.cloudinaryId) {
          await cloudinary.uploader.destroy(photo.cloudinaryId);
        }
      }
  
      // Delete the planting document
      await Planting.deleteOne({ _id: req.params.id });
  
      res.json({ message: 'Planting deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


//upload photos
  router.post('/:id/photos', upload.array('photos', 5), async (req, res) => {
    try {
      // Find the planting by ID
      const planting = await Planting.findById(req.params.id);
      if (!planting) {
        return res.status(404).json({ message: 'Planting not found' });
      }
  
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
  
      // Upload files to Cloudinary
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'plantings' }, // Optional: Organize photos in a folder
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve({
                  url: result.secure_url, // Cloudinary URL of the uploaded photo
                  date: new Date(), // Current date
                  cloudinaryId: result.public_id // Cloudinary public ID for future reference
                });
              }
            }
          );
          uploadStream.end(file.buffer); // Upload the file buffer to Cloudinary
        });
      });
  
      // Wait for all uploads to complete
      const uploadedPhotos = await Promise.all(uploadPromises);
  
      // Add the uploaded photos to the planting document
      planting.photos.push(...uploadedPhotos);
      await planting.save(); // Save the updated planting document
  
      // Return the uploaded photos
      res.status(201).json(uploadedPhotos);
    } catch (err) {
      console.error('Error uploading photos:', err);
      res.status(500).json({ message: err.message });
    }
  });


// Update growth metrics
router.post('/plantings/:id/metrics', async (req, res) => {
  try {
    const planting = await Planting.findByIdAndUpdate(
      req.params.id,
      { growthMetrics: req.body },
      { new: true }
    );
    if (!planting) return res.status(404).json({ message: 'Planting not found' });
    res.json(planting.growthMetrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;