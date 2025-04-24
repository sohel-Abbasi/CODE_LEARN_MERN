const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const StudentViewCourseRoutes = require("./routes/students-routes/course-routes");
const StudentViewOrderRoutes = require("./routes/students-routes/order-routes");
const StudentCoursesRoutes = require("./routes/students-routes/student-courses-routes");
const StudentCourseProgressRoutes = require("./routes/students-routes/course-progress-routes");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;
const _dirname = path.resolve();
const MONGO_URL = process.env.MONGO_URL;
const CLIENT_URL = "http://localhost:5173";
app.use(
  cors({
    origin: 
      process.env.CLIENT_URL || CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// middleware
app.use(express.json());

// database connections
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDb is connected successfully"))
  .catch((e) => console.log(e));

// routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", StudentViewCourseRoutes);
app.use("/student/order", StudentViewOrderRoutes);
app.use("/student/courses-bought", StudentCoursesRoutes);
app.use("/student/course-progress", StudentCourseProgressRoutes);
// Global error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Somthing went wrong", success: false });
});
// this code for deployement ------
app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
