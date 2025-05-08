const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Event = require('../../models/Eventmodels');

const app = express();
app.use(express.json());
app.use('/api/events', require('../../routes/eventroute'));

describe('Event Management API', () => {
  beforeEach(async () => {
    await Event.deleteMany({});
  });

  const testEvent = {
    date: '2025-05-08',  // ISO date string
    events: [
      {
        name: 'Fertilizer Application',
        time: '09:00'  // 24-hour format
      },
      {
        name: 'Irrigation Check',
        time: '14:00'
      }
    ]
  };

  describe('POST /', () => {
    it('should create new events for a date', async () => {
      const res = await request(app)
        .post('/api/events')
        .send(testEvent);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('date', testEvent.date);
      expect(res.body.events).toHaveLength(2);
      expect(res.body.events[0]).toHaveProperty('name', 'Fertilizer Application');
      expect(res.body.events[1]).toHaveProperty('name', 'Irrigation Check');
    });

    it('should fail without required fields', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          date: '2025-05-08'
          // Missing events array
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should validate event time format', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          date: '2025-05-08',
          events: [{
            name: 'Invalid Event',
            time: 'not-a-time'  // Invalid time format
          }]
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await Event.create(testEvent);
    });

    it('should return all events', async () => {
      const res = await request(app)
        .get('/api/events');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('date', testEvent.date);
    });

    it('should filter events by date', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ date: testEvent.date });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].date).toBe(testEvent.date);
    });

    it('should return empty array for non-existent date', async () => {
      const res = await request(app)
        .get('/api/events')
        .query({ date: '2025-12-31' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body).toHaveLength(0);
    });
  });

  describe('PUT /:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = await Event.create(testEvent);
      eventId = event._id;
    });

    it('should update an event', async () => {
      const update = {
        events: [
          {
            name: 'Updated Event',
            time: '10:00'
          }
        ]
      };

      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
      expect(res.body.events[0]).toHaveProperty('name', 'Updated Event');
      expect(res.body.events[0]).toHaveProperty('time', '10:00');
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/events/${fakeId}`)
        .send({
          events: [{
            name: 'Test Event',
            time: '10:00'
          }]
        });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = await Event.create(testEvent);
      eventId = event._id;
    });

    it('should delete an event', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`);

      expect(res.status).toBe(200);
      
      const eventInDb = await Event.findById(eventId);
      expect(eventInDb).toBeNull();
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/events/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });
});