const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const plantingRoutes = require('../../routes/plants');
const { Planting } = require('../../models/plantmodel');

const app = express();
app.use(express.json());
app.use('/api/plantings', plantingRoutes);

describe('Planting Management API', () => {
  let mongoServer;

  beforeAll(async () => {
    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Planting.deleteMany({});
  });

  describe('POST /api/plantings', () => {
    it('should create a new planting', async () => {
      const plantingData = {
        cropType: 'Tea',
        section: 'Section A',
        plantingDate: new Date('2025-05-20'),
        numberOfPlants: 200,
        growthStage: 'Vegetative',
        healthStatus: 'Healthy'
      };

      const res = await request(app)
        .post('/api/plantings')
        .send(plantingData);

      expect(res.status).toBe(201);
      expect(res.body.cropType).toBe(plantingData.cropType);
      expect(res.body.section).toBe(plantingData.section);
      expect(res.body.numberOfPlants).toBe(plantingData.numberOfPlants);
      expect(res.body.growthStage).toBe(plantingData.growthStage);
      expect(res.body.healthStatus).toBe(plantingData.healthStatus);
      expect(res.body.growthMetrics).toMatchObject({ days: 0, height: 0 });
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = {
        cropType: 'Tea',
        // Missing section and plantingDate
      };

      const res = await request(app)
        .post('/api/plantings')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required');
    });
  });

  describe('GET /api/plantings', () => {
    it('should return all plantings', async () => {
      // Create test plantings
      const plantings = [
        {
          cropType: 'Tea',
          section: 'Section A',
          plantingDate: new Date('2025-05-20'),
          numberOfPlants: 200,
          growthStage: 'Vegetative',
          healthStatus: 'Healthy',
          growthMetrics: { days: 0, height: 0 }
        },
        {
          cropType: 'Coconut',
          section: 'Section B',
          plantingDate: new Date('2025-06-15'),
          numberOfPlants: 150,
          growthStage: 'Germination',
          healthStatus: 'At Risk',
          growthMetrics: { days: 0, height: 0 }
        }
      ];

      await Planting.insertMany(plantings);

      const res = await request(app).get('/api/plantings');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].cropType).toBe(plantings[0].cropType);
      expect(res.body[1].cropType).toBe(plantings[1].cropType);
    });
  });

  describe('PUT /api/plantings/:id', () => {
    it('should update a planting', async () => {
      const planting = new Planting({
        cropType: 'Tea',
        section: 'Section A',
        plantingDate: new Date('2025-05-20'),
        numberOfPlants: 200,
        growthStage: 'Vegetative',
        healthStatus: 'Healthy',
        growthMetrics: { days: 0, height: 0 }
      });
      await planting.save();

      const updateData = {
        growthStage: 'Flowering',
        healthStatus: 'At Risk',
        numberOfPlants: 180
      };

      const res = await request(app)
        .put(`/api/plantings/${planting._id}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.growthStage).toBe(updateData.growthStage);
      expect(res.body.healthStatus).toBe(updateData.healthStatus);
      expect(res.body.numberOfPlants).toBe(updateData.numberOfPlants);
    });

    it('should return 404 if planting not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/plantings/${fakeId}`)
        .send({ growthStage: 'Flowering' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/plantings/:id', () => {
    it('should delete a planting', async () => {
      const planting = new Planting({
        cropType: 'Tea',
        section: 'Section A',
        plantingDate: new Date('2025-05-20'),
        numberOfPlants: 200,
        growthStage: 'Vegetative',
        healthStatus: 'Healthy',
        growthMetrics: { days: 0, height: 0 }
      });
      await planting.save();

      const res = await request(app).delete(`/api/plantings/${planting._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Planting deleted');

      const deletedPlanting = await Planting.findById(planting._id);
      expect(deletedPlanting).toBeNull();
    });

    it('should return 404 if planting not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/plantings/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });
});