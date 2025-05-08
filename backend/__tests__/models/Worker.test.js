const mongoose = require('mongoose');
const Worker = require('../../models/Worker');

describe('Worker Model Test', () => {
    const validWorkerData = {
        fullName: 'John Doe',
        epfNumber: 'EPF123',
        age: 25,
        role: 'Farmer',
        skills: ['Planting', 'Harvesting'],
        dateJoined: new Date(),
        contactNumber: '1234567890',
        email: 'john@example.com'
    };

    it('should create & save worker successfully', async () => {
        const validWorker = new Worker(validWorkerData);
        const savedWorker = await validWorker.save();
        
        expect(savedWorker._id).toBeDefined();
        expect(savedWorker.fullName).toBe(validWorkerData.fullName);
        expect(savedWorker.epfNumber).toBe(validWorkerData.epfNumber);
    });

    it('should fail to save worker without required fields', async () => {
        const workerWithoutRequiredField = new Worker({ fullName: 'John Doe' });
        let err;
        
        try {
            await workerWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }
        
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should fail to save duplicate EPF number', async () => {
        const firstWorker = new Worker(validWorkerData);
        await firstWorker.save();

        const duplicateWorker = new Worker(validWorkerData);
        let err;

        try {
            await duplicateWorker.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.code).toBe(11000); // MongoDB duplicate key error code
    });
});