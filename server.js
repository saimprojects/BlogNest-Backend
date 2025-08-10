const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment')
const adminRoutes = require('./routes/admin')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: "https://blog-nest-frontend-pi.vercel.app",  
  credentials: true                 
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/admin',adminRoutes)



mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
