require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ✅ FIXED CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://task-management-pied-ten.vercel.app",
        // "https://task-management-git-main-mrsimens72-6377s-projects.vercel.app",
        process.env.CLIENT_URL,
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    env: process.env.NODE_ENV,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
