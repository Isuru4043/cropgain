require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require("multer");
const accountRoutes = require("./controllers/accountsController");
const incomeRoutes = require("./routes/income");
const eventRoutes = require("./routes/eventroute");
const cropManagementRoutes = require("./routes/croproutes");
const authRoutes = require("./routes/auth");

const landRoute = require("./routes/landRoute");
const plantingRoutes = require("./routes/plants");
const fertilizerRoutes = require("./routes/fertilizerTasks");
const laborRoutes = require("./routes/laborRoute");

const settingsRoutes = require("./routes/settings"); // Import the settings routes

const workerRoutes = require("./routes/workerRoutes");
const taskRoutes = require("./routes/taskRoutes");
const salaryRoutes = require("./routes/salaryRoutes");

const app = express();

// Connect to the database
connectDB();

// Configure CORS with enhanced security
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://cropgain.onrender.com",
        "https://crop-gain.onrender.com",
        "https://cropgain-frontend.onrender.com",
        undefined, // Allow requests with no origin (like mobile apps or curl requests)
      ];
      console.log("Request Origin:", origin); // Debug log
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "x-auth-token",
    ],
    exposedHeaders: ["Set-Cookie", "Authorization"],
  })
);

// Add security headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-auth-token"
  );
  next();
});

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, x-auth-token"
  );
  res.status(200).end();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/Accounts/coop/", accountRoutes);
app.use("/api/Accounts/incomePerCrop", incomeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/crops", cropManagementRoutes);
app.use("/api/lands", landRoute);

app.use("/api/plantings", plantingRoutes);
app.use("/api/fertilizertasks", fertilizerRoutes);
app.use("/api/labors", laborRoutes);
app.use("/api/settings", settingsRoutes); // Use the settings routes under /api/settings

app.use("/api/workers", workerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/salaries", salaryRoutes);

const PORT = process.env.PORT || 5000;

// Error handling for unhandled promises
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
