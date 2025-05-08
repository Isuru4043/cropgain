const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Worker = require('../../models/Worker');

// Create Express app and configure it
const app = express();
app.use(express.json());
app.use('/api/workers', require('../../routes/workerRoutes'));

describe('Worker Controller', () => {
    const testWorker = {
        fullName: 'Test Worker',
        contactNumber: '1234567890',
        address: 'Test Address',
        role: 'Harvester',
        status: 'Active',
        email: 'test@example.com',
        dateJoined: new Date().toISOString().split('T')[0],
        age: 25,
        epfNumber: 'EPF123',
        skills: 'Harvesting,Pruning,Planting'  // Added skills as comma-separated string
    };

    beforeEach(async () => {
        await Worker.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/workers', () => {
        it('should create a new worker', async () => {
            const res = await request(app)
                .post('/api/workers')
                .send(testWorker);
            
            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('fullName', testWorker.fullName);
            expect(res.body).toHaveProperty('email', testWorker.email);
            expect(res.body.skills).toEqual(['Harvesting', 'Pruning', 'Planting']); // Check skills array
        });

        it('should fail without required fields', async () => {
            const res = await request(app)
                .post('/api/workers')
                .send({
                    fullName: 'Test Worker'
                });
            
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('GET /api/workers', () => {
        beforeEach(async () => {
            await Worker.create({
                ...testWorker,
                skills: testWorker.skills.split(',').map(skill => skill.trim())
            });
        });

        it('should return all workers', async () => {
            const res = await request(app).get('/api/workers');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('fullName', testWorker.fullName);
        });

        it('should return recent workers', async () => {
            const res = await request(app).get('/api/workers/recent');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThanOrEqual(0);
        });
    });
});