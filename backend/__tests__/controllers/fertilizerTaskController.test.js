const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const FertilizerTask = require('../../models/FertilizerTask');

const app = express();
app.use(express.json());
app.use('/api/fertilizertasks', require('../../routes/fertilizerTasks'));

describe('Fertilizer Task API', () => {
  beforeEach(async () => {
    await FertilizerTask.deleteMany({});
  });

  describe('GET /api/fertilizertasks', () => {
    it('should return all fertilizer tasks', async () => {
      const tasks = [
        {
          cropType: 'Tea',
          fertilizerType: 'NPK',
          quantity: 100,
          date: new Date(),
          method: 'Broadcast',
          recurring: false
        },
        {
          cropType: 'Coconut',
          fertilizerType: 'Urea',
          quantity: 50,
          date: new Date(),
          method: 'Ring',
          recurring: true
        }
      ];

      await FertilizerTask.insertMany(tasks);

      const res = await request(app).get('/api/fertilizertasks');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('cropType', 'Tea');
      expect(res.body[1]).toHaveProperty('cropType', 'Coconut');
    });
  });

  describe('POST /api/fertilizertasks', () => {
    it('should create a new fertilizer task', async () => {
      const task = {
        cropType: 'Cinnamon',
        fertilizerType: 'Organic',
        quantity: 75,
        date: new Date(),
        method: 'Band',
        recurring: false
      };

      const res = await request(app)
        .post('/api/fertilizertasks')
        .send(task);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('cropType', task.cropType);
      expect(res.body).toHaveProperty('fertilizerType', task.fertilizerType);
      expect(res.body).toHaveProperty('quantity', task.quantity);
      expect(res.body).toHaveProperty('method', task.method);

      const taskInDb = await FertilizerTask.findById(res.body._id);
      expect(taskInDb).toBeTruthy();
    });
  });

  describe('PUT /api/fertilizertasks/:id', () => {
    it('should update an existing fertilizer task', async () => {
      const task = new FertilizerTask({
        cropType: 'Tea',
        fertilizerType: 'NPK',
        quantity: 100,
        date: new Date(),
        method: 'Broadcast',
        recurring: false
      });
      await task.save();

      const update = {
        quantity: 150,
        method: 'Ring'
      };

      const res = await request(app)
        .put(`/api/fertilizertasks/${task._id}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.quantity).toBe(update.quantity);
      expect(res.body.method).toBe(update.method);

      const updatedTask = await FertilizerTask.findById(task._id);
      expect(updatedTask.quantity).toBe(update.quantity);
      expect(updatedTask.method).toBe(update.method);
    });
  });

  describe('DELETE /api/fertilizertasks/:id', () => {
    it('should delete an existing fertilizer task', async () => {
      const task = new FertilizerTask({
        cropType: 'Coconut',
        fertilizerType: 'Urea',
        quantity: 50,
        date: new Date(),
        method: 'Ring',
        recurring: true
      });
      await task.save();

      const res = await request(app)
        .delete(`/api/fertilizertasks/${task._id}`);

      expect(res.status).toBe(200);

      const taskInDb = await FertilizerTask.findById(task._id);
      expect(taskInDb).toBeNull();
    });
  });
});