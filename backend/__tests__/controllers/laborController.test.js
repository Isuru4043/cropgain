const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const LaborTask = require('../../models/LaborTask');

const app = express();
app.use(express.json());
app.use('/api/labors', require('../../routes/laborRoute'));

describe('Labor Task API', () => {
  beforeEach(async () => {
    await LaborTask.deleteMany({});
  });

  describe('GET /api/labors', () => {
    it('should return all labor tasks', async () => {
      const tasks = [
        {
          description: 'Test task 1',
          assignedTo: 'Worker 1',
          shift: 'Morning',
          date: new Date()
        },
        {
          description: 'Test task 2',
          assignedTo: 'Worker 2',
          shift: 'Afternoon',
          date: new Date()
        }
      ];

      await LaborTask.insertMany(tasks);

      const res = await request(app).get('/api/labors');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('description', 'Test task 1');
      expect(res.body[1]).toHaveProperty('description', 'Test task 2');
    });
  });

  describe('POST /api/labors', () => {
    it('should create a new labor task', async () => {
      const task = {
        description: 'New test task',
        assignedTo: 'Worker 3',
        shift: 'Night',
        date: new Date()
      };

      const res = await request(app)
        .post('/api/labors')
        .send(task);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('description', task.description);
      expect(res.body).toHaveProperty('assignedTo', task.assignedTo);
      expect(res.body).toHaveProperty('shift', task.shift);

      const taskInDb = await LaborTask.findById(res.body._id);
      expect(taskInDb).toBeTruthy();
    });

    it('should fail to create task with invalid shift', async () => {
      const task = {
        description: 'Invalid shift task',
        assignedTo: 'Worker 4',
        shift: 'Invalid',
        date: new Date()
      };

      const res = await request(app)
        .post('/api/labors')
        .send(task);

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/labors/:id', () => {
    it('should update an existing task', async () => {
      const task = new LaborTask({
        description: 'Task to update',
        assignedTo: 'Worker 5',
        shift: 'Morning',
        date: new Date()
      });
      await task.save();

      const update = {
        description: 'Updated task',
        shift: 'Afternoon'
      };

      const res = await request(app)
        .put(`/api/labors/${task._id}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.description).toBe(update.description);
      expect(res.body.shift).toBe(update.shift);
    });
  });

  describe('DELETE /api/labors/:id', () => {
    it('should delete an existing task', async () => {
      const task = new LaborTask({
        description: 'Task to delete',
        assignedTo: 'Worker 6',
        shift: 'Morning',
        date: new Date()
      });
      await task.save();

      const res = await request(app)
        .delete(`/api/labors/${task._id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully');

      const taskInDb = await LaborTask.findById(task._id);
      expect(taskInDb).toBeNull();
    });
  });
});