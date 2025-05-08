const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Land = require('../../models/land');

const app = express();
app.use(express.json());
app.use('/api/lands', require('../../routes/landRoute'));

describe('Land Management API', () => {
  beforeEach(async () => {
    await Land.deleteMany({});
  });

  const testLand = {
    section: 'Section A',
    crops: []
  };

  const testCrop = {
    cropNameLand: 'Test Tea',
    area: '5 hectares',
    plantingDate: new Date('2025-01-01').toISOString(),
    harvestDate: new Date('2025-12-31').toISOString(),
    numberOfPlants: 1000
  };

  describe('POST /', () => {
    it('should create a new land section', async () => {
      const res = await request(app)
        .post('/api/lands')
        .send(testLand);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('section', testLand.section);
      expect(res.body.crops).toHaveLength(0);
    });

    it('should fail to create duplicate section', async () => {
      await Land.create(testLand);
      
      const res = await request(app)
        .post('/api/lands')
        .send(testLand);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /land', () => {
    beforeEach(async () => {
      await Land.create(testLand);
    });

    it('should return all land sections', async () => {
      const res = await request(app).get('/api/lands/land');

      expect(res.status).toBe(200);
      expect(typeof res.body).toBe('object');
      expect(res.body).toHaveProperty('Section A');
    });

    it('should return a specific land section', async () => {
      const res = await request(app)
        .get('/api/lands/land/Section A');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('section', 'Section A');
    });

    it('should return 404 for non-existent section', async () => {
      const res = await request(app)
        .get('/api/lands/land/Section X');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /:section/crops', () => {
    let landId;

    beforeEach(async () => {
      const land = await Land.create(testLand);
      landId = land._id;
    });

    it('should add a crop to a section', async () => {
      const res = await request(app)
        .post('/api/lands/Section A/crops')
        .send(testCrop);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('cropNameLand', testCrop.cropNameLand);
      expect(res.body).toHaveProperty('area', testCrop.area);
      expect(res.body).toHaveProperty('numberOfPlants', testCrop.numberOfPlants);
    });

    it('should fail when section not found', async () => {
      const res = await request(app)
        .post('/api/lands/Section X/crops')
        .send(testCrop);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /:section/crops/:cropId', () => {
    let landSection;
    let cropId;

    beforeEach(async () => {
      landSection = await Land.create({
        ...testLand,
        crops: [testCrop]
      });
      cropId = landSection.crops[0]._id;
    });

    it('should update a crop in a section', async () => {
      const update = {
        area: '6 hectares',
        numberOfPlants: 1200
      };

      const res = await request(app)
        .put(`/api/lands/Section A/crops/${cropId}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('area', update.area);
      expect(res.body).toHaveProperty('numberOfPlants', update.numberOfPlants);
    });

    it('should return 404 for non-existent crop', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/lands/Section A/crops/${fakeId}`)
        .send({ area: '6 hectares' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:section/crops/:cropId', () => {
    let landSection;
    let cropId;

    beforeEach(async () => {
      landSection = await Land.create({
        ...testLand,
        crops: [testCrop]
      });
      cropId = landSection.crops[0]._id;
    });

    it('should delete a crop from a section', async () => {
      const res = await request(app)
        .delete(`/api/lands/Section A/crops/${cropId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Crop deleted successfully');
      
      const updatedLand = await Land.findOne({ section: 'Section A' });
      expect(updatedLand.crops).toHaveLength(0);
    });

    it('should return 404 for non-existent section', async () => {
      const res = await request(app)
        .delete(`/api/lands/Section X/crops/${cropId}`);

      expect(res.status).toBe(404);
    });
  });
});