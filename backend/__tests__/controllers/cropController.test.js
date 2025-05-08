const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Crop = require('../../models/Cropmanagementmodel');

const app = express();
app.use(express.json());
app.use('/api/crops', require('../../routes/croproutes'));

describe('Crop Management API', () => {
  beforeEach(async () => {
    await Crop.deleteMany({});
  });

  const testCrop = {
    cropName: 'Test Tea',
    scientificName: 'Camellia sinensis',
    cropType: 'Beverage',  // Changed from 'Tea' to valid enum
    growthCycle: 90,
    optimalGrowingConditions: 'Cool and Humid',  // Changed to valid enum
    soilTypePreference: 'Loamy',  // Changed to valid enum
    expectedYieldValue: 1000,
    expectedYieldUnit: 'kg/hectare',  // Changed to valid enum
    fertilizerType: 'Organic',  // Changed from 'NPK' to valid enum
    fertilizerQuantity: 50,
    fertilizerFrequency: 'Monthly',  // Changed to valid enum
    harvestFrequency: 'Monthly',  // Changed from 'Bi-weekly' to valid enum
    compatibleCrops: 'Shade trees,Coffee'
  };

  describe('POST /api/crops', () => {
    it('should create a new crop', async () => {
      const res = await request(app)
        .post('/api/crops')
        .send(testCrop);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('cropName', testCrop.cropName);
      expect(res.body).toHaveProperty('cropType', testCrop.cropType);
      expect(res.body.compatibleCrops).toEqual(['Shade trees', 'Coffee']);
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/crops')
        .send({
          cropName: 'Test Tea'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/crops', () => {
    beforeEach(async () => {
      await Crop.create({
        ...testCrop,
        compatibleCrops: testCrop.compatibleCrops.split(',').map(crop => crop.trim())
      });
    });

    it('should return all crops', async () => {
      const res = await request(app).get('/api/crops');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('cropName', testCrop.cropName);
    });

    it('should filter crops by search query', async () => {
      const res = await request(app)
        .get('/api/crops')
        .query({ search: 'Tea' });

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].cropName).toContain('Tea');
    });

    it('should filter crops by type', async () => {
      const res = await request(app)
        .get('/api/crops')
        .query({ cropType: 'Beverage' });  // Changed from 'Tea' to match new enum value

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].cropType).toBe('Beverage');
    });
  });

  describe('PUT /api/crops/:id', () => {
    let cropId;

    beforeEach(async () => {
      const crop = await Crop.create({
        ...testCrop,
        compatibleCrops: testCrop.compatibleCrops.split(',').map(crop => crop.trim())
      });
      cropId = crop._id;
    });

    it('should update an existing crop', async () => {
      const update = {
        ...testCrop,  // Include all required fields
        expectedYieldValue: 1200,
        fertilizerQuantity: 60,
        compatibleCrops: 'Shade trees,Coffee,Pepper'  // Updated compatible crops
      };

      const res = await request(app)
        .put(`/api/crops/${cropId}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.expectedYieldValue).toBe(update.expectedYieldValue);
      expect(res.body.fertilizerQuantity).toBe(update.fertilizerQuantity);
      expect(res.body.compatibleCrops).toEqual(['Shade trees', 'Coffee', 'Pepper']);
    });

    it('should return 404 for non-existent crop', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/crops/${fakeId}`)
        .send({
          ...testCrop,
          expectedYieldValue: 1200
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/crops/:id', () => {
    let cropId;

    beforeEach(async () => {
      const crop = await Crop.create({
        ...testCrop,
        compatibleCrops: testCrop.compatibleCrops.split(',').map(crop => crop.trim())
      });
      cropId = crop._id;
    });

    it('should delete an existing crop', async () => {
      const res = await request(app)
        .delete(`/api/crops/${cropId}`);

      expect(res.status).toBe(200);
      
      const cropInDb = await Crop.findById(cropId);
      expect(cropInDb).toBeNull();
    });

    it('should return 404 for non-existent crop', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/crops/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });
});