import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js"; 
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
// Node.js 18+ has built-in fetch, no need to import

// Load environment variables
dotenv.config();

// __dirname and __filename fix for ES modules (moved before usage)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ML_BASE_URL = process.env.ML_BASE_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Image upload handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
    }
  }
});



// Routes
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  res.status(200).json({
    message: 'Image uploaded successfully!',
    fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
  });
});
app.post('/api/barcodes', (req, res) => {
  const { barcode } = req.body;
  
  // Validate barcode
  if (!barcode || !/^\d{8,}$/.test(barcode)) {
    return res.status(400).json({ error: 'Invalid barcode format' });
  }

  // Here you would typically save to a database
  console.log('Received barcode:', barcode);
  
  res.status(200).json({ 
    success: true,
    barcode,
    message: 'Barcode saved successfully' 
  });
});

// Placeholder routes (implement these based on your needs)
app.post('/api/upload-comparison', (req, res) => {
  res.status(200).json({ message: 'Upload comparison endpoint - implement logic here' });
});

app.post('/api/compare-images', (req, res) => {
  res.status(200).json({ message: 'Compare images endpoint - implement logic here' });
});

// Eco-score proxy endpoint
app.post("/api/get-eco-score-proxy", async (req, res) => {
  try {
    if (!ML_BASE_URL) {
      return res.status(500).json({ error: "ML_BASE_URL not configured" });
    }

    console.log("Fetching:", `${ML_BASE_URL}/api/get-eco-score`);
    
    const response = await fetch(`${ML_BASE_URL}/api/get-eco-score`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(req.body),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`ML server responded with status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response from ML server:", text);
      return res.status(500).json({ 
        error: "ML server returned non-JSON response",
        details: text.substring(0, 200) // First 200 chars for debugging
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Proxy error:", err.message);
    
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: "Cannot connect to ML server",
        details: "ML service is not available"
      });
    }
    
    if (err.name === 'SyntaxError') {
      return res.status(500).json({ 
        error: "Invalid JSON response from ML server"
      });
    }
    
    res.status(500).json({ 
      error: "Proxy request failed",
      details: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});