const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set up test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";

let mongod;

// Global setup - runs once before all tests
beforeAll(async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create({
      binary: {
        version: "6.0.2", // Specify a version to avoid downloading latest
      },
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  }
});

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(
      collections.map((collection) => collection.deleteMany({}))
    );
  }
});

// Global teardown - runs once after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
});
