const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const accountRoutes = require("./controllers/accountsController");
const incomeRoutes = require("./routes/income");
const eventRoutes = require("./routes/eventroute");

const app = express(); // Initialize the 'app' first

connectDB(); // Connect to the database

// Use CORS middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json({ extended: false })); // Middleware for parsing JSON

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/Accounts/coop/", accountRoutes);
app.use("/api/Accounts/incomePerCrop", incomeRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
