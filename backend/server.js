import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js"; 
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import userRouter from './routes/userRoute.js';
import productRouter from "./routes/productRoute.js";
import uploadRoutes from "./routes/uploadRoute.js";


// Load environment variables
dotenv.config();

// __dirname and __filename fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Create multiple upload directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const product1Dir = path.join(__dirname, 'product1');
const product2Dir = path.join(__dirname, 'product2');

[uploadsDir, product1Dir, product2Dir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ML_BASE_URL = process.env.ML_BASE_URL;
const BACKEND_NGROK_URL = process.env.BACKEND_NGROK_URL || "https://22d4338858a1.ngrok-free.app";
const ML_NGROK_URL = process.env.ML_NGROK_URL || "https://0d01acfb8c5a.ngrok-free.app";

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from all directories
app.use('/uploads', express.static(uploadsDir));
app.use('/product1', express.static(product1Dir));
app.use('/product2', express.static(product2Dir));

// API Routes - Use the proper MVC structure
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/uploads", uploadRoutes); 

// Helper function to get image count and existing files in directory
const getDirectoryInfo = (directory) => {
  const files = fs.readdirSync(directory).filter(file => 
    /\.(jpeg|jpg|png|webp)$/i.test(file)
  );
  
  const frontImages = files.filter(file => file.startsWith('front-'));
  const backImages = files.filter(file => file.startsWith('back-'));
  
  return {
    totalFiles: files.length,
    frontImages,
    backImages,
    allFiles: files
  };
};

// Helper function to clean up old files when limit is exceeded
const cleanupOldFiles = (directory, prefix) => {
  const files = fs.readdirSync(directory).filter(file => 
    file.startsWith(prefix) && /\.(jpeg|jpg|png|webp)$/i.test(file)
  );
  
  // Sort by creation time (based on filename timestamp)
  files.sort((a, b) => {
    const statA = fs.statSync(path.join(directory, a));
    const statB = fs.statSync(path.join(directory, b));
    return statA.mtime - statB.mtime;
  });
  
  // Remove oldest files if we have more than 1
  while (files.length > 0) {
    const oldFile = files.shift();
    fs.unlinkSync(path.join(directory, oldFile));
    console.log(`Removed old file: ${oldFile}`);
  }
};

// Helper function to create multer storage with front/back naming logic
const createSmartStorage = (directory) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      const dirInfo = getDirectoryInfo(directory);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      
      let prefix;
      
      // Determine prefix based on existing files
      if (dirInfo.frontImages.length === 0) {
        // No front image exists, make this the front
        prefix = 'front-';
        // Clean up any existing front images (shouldn't happen, but safety measure)
        cleanupOldFiles(directory, 'front-');
      } else if (dirInfo.backImages.length === 0) {
        // Front exists but no back, make this the back
        prefix = 'back-';
        // Clean up any existing back images
        cleanupOldFiles(directory, 'back-');
      } else {
        // Both exist, replace the older one
        // Get the older file type based on modification time
        const frontFile = dirInfo.frontImages[0];
        const backFile = dirInfo.backImages[0];
        
        const frontStat = fs.statSync(path.join(directory, frontFile));
        const backStat = fs.statSync(path.join(directory, backFile));
        
        if (frontStat.mtime < backStat.mtime) {
          // Front is older, replace it
          prefix = 'front-';
          cleanupOldFiles(directory, 'front-');
        } else {
          // Back is older, replace it
          prefix = 'back-';
          cleanupOldFiles(directory, 'back-');
        }
      }
      
      const filename = prefix + uniqueSuffix + extension;
      cb(null, filename);
    }
  });
};

// Create multer instances for each directory with smart naming
const uploadToUploads = multer({ 
  storage: createSmartStorage(uploadsDir),
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

const uploadToProduct1 = multer({ 
  storage: createSmartStorage(product1Dir),
  limits: { fileSize: 5 * 1024 * 1024 },
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

const uploadToProduct2 = multer({ 
  storage: createSmartStorage(product2Dir),
  limits: { fileSize: 5 * 1024 * 1024 },
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

// LEGACY ROUTES - These should be moved to your uploadController eventually
// File 1 - Upload to /uploads folder (LEGACY - consider moving to controller)
app.post('/upload', uploadToUploads.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  const dirInfo = getDirectoryInfo(uploadsDir);
  const isFirstImage = req.file.filename.startsWith('front-');
  
  res.status(200).json({
    message: `Image uploaded successfully to uploads as ${isFirstImage ? 'front' : 'back'} image!`,
    fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    publicUrl: `${BACKEND_NGROK_URL}/uploads/${req.file.filename}`,
    folder: 'uploads',
    imageType: isFirstImage ? 'front' : 'back',
    totalImages: dirInfo.totalFiles + 1 // +1 because we just added one
  });
});

// File 2 - Upload to /product1 folder (LEGACY)
app.post('/upload-product1', uploadToProduct1.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  const dirInfo = getDirectoryInfo(product1Dir);
  const isFirstImage = req.file.filename.startsWith('front-');
  
  res.status(200).json({
    message: `Image uploaded successfully to product1 as ${isFirstImage ? 'front' : 'back'} image!`,
    fileUrl: `http://localhost:${PORT}/product1/${req.file.filename}`,
    publicUrl: `${BACKEND_NGROK_URL}/product1/${req.file.filename}`,
    folder: 'product1',
    imageType: isFirstImage ? 'front' : 'back',
    totalImages: dirInfo.totalFiles + 1
  });
});

// File 3 - Upload to /product2 folder (LEGACY)
app.post('/upload-product2', uploadToProduct2.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  const dirInfo = getDirectoryInfo(product2Dir);
  const isFirstImage = req.file.filename.startsWith('front-');
  
  res.status(200).json({
    message: `Image uploaded successfully to product2 as ${isFirstImage ? 'front' : 'back'} image!`,
    fileUrl: `http://localhost:${PORT}/product2/${req.file.filename}`,
    publicUrl: `${BACKEND_NGROK_URL}/product2/${req.file.filename}`,
    folder: 'product2',
    imageType: isFirstImage ? 'front' : 'back',
    totalImages: dirInfo.totalImages + 1
  });
});

// Generic upload route with folder parameter (LEGACY)
app.post('/upload/:folder', (req, res) => {
  const folder = req.params.folder;
  let uploadMiddleware;
  
  switch(folder) {
    case 'uploads':
      uploadMiddleware = uploadToUploads.single('image');
      break;
    case 'product1':
      uploadMiddleware = uploadToProduct1.single('image');
      break;
    case 'product2':
      uploadMiddleware = uploadToProduct2.single('image');
      break;
    default:
      return res.status(400).json({ message: 'Invalid folder specified. Use: uploads, product1, or product2' });
  }
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
    }
    
    const isFirstImage = req.file.filename.startsWith('front-');
    
    res.status(200).json({
      message: `Image uploaded successfully to ${folder} as ${isFirstImage ? 'front' : 'back'} image!`,
      fileUrl: `http://localhost:${PORT}/${folder}/${req.file.filename}`,
      publicUrl: `${BACKEND_NGROK_URL}/${folder}/${req.file.filename}`,
      folder: folder,
      imageType: isFirstImage ? 'front' : 'back'
    });
  });
});



app.get('/api/uploads/:id', (req, res) => {
  const bucket = new GridFSBucket(mongoose.connection.db);
  bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id))
    .pipe(res);
});


// Route to get folder status (LEGACY)
app.get('/folder-status/:folder', (req, res) => {
  const folder = req.params.folder;
  let directory;
  
  switch(folder) {
    case 'uploads':
      directory = uploadsDir;
      break;
    case 'product1':
      directory = product1Dir;
      break;
    case 'product2':
      directory = product2Dir;
      break;
    default:
      return res.status(400).json({ message: 'Invalid folder specified. Use: uploads, product1, or product2' });
  }
  
  const dirInfo = getDirectoryInfo(directory);
  
  res.status(200).json({
    folder: folder,
    totalImages: dirInfo.totalFiles,
    frontImages: dirInfo.frontImages.length,
    backImages: dirInfo.backImages.length,
    files: {
      front: dirInfo.frontImages.map(file => ({
        filename: file,
        localUrl: `http://localhost:${PORT}/${folder}/${file}`,
        publicUrl: `${BACKEND_NGROK_URL}/${folder}/${file}`
      })),
      back: dirInfo.backImages.map(file => ({
        filename: file,
        localUrl: `http://localhost:${PORT}/${folder}/${file}`,
        publicUrl: `${BACKEND_NGROK_URL}/${folder}/${file}`
      }))
    }
  });
});

// NEW ENDPOINT: Extract label information from uploaded images
app.post('/api/extract-labels', async (req, res) => {
  try {
    const { folder = 'uploads' } = req.body;
    
    // Validate folder parameter
    let directory;
    switch(folder) {
      case 'uploads':
        directory = uploadsDir;
        break;
      case 'product1':
        directory = product1Dir;
        break;
      case 'product2':
        directory = product2Dir;
        break;
      default:
        return res.status(400).json({ 
          success: false,
          error: 'Invalid folder specified. Use: uploads, product1, or product2' 
        });
    }
    
    // Get directory information
    const dirInfo = getDirectoryInfo(directory);
    
    // Check if we have both front and back images
    if (dirInfo.frontImages.length === 0 && dirInfo.backImages.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No images found in the specified folder' 
      });
    }
    
    // Prepare image URLs for ML API
    const frontImageUrl = dirInfo.frontImages.length > 0 
      ? `${BACKEND_NGROK_URL}/${folder}/${dirInfo.frontImages[0]}`
      : null;
      
    const backImageUrl = dirInfo.backImages.length > 0 
      ? `${BACKEND_NGROK_URL}/${folder}/${dirInfo.backImages[0]}`
      : null;
    
    // Prepare request payload for ML API
    const mlPayload = {
      image_path1: frontImageUrl || "",
      image_path2: backImageUrl || ""
    };
    
    console.log("Sending to ML API:", mlPayload);
    
    // Call the ML API
    const mlResponse = await fetch(`${ML_NGROK_URL}/extract-picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(mlPayload)
    });
    
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error("ML API Error Response:", errorText);
      throw new Error(`ML API responded with status: ${mlResponse.status}`);
    }
    
    const mlData = await mlResponse.json();
    
    // Return the extracted data along with image information
    res.json({
      success: true,
      folder: folder,
      images: {
        front: frontImageUrl,
        back: backImageUrl
      },
      extractedData: mlData,
      message: 'Label extraction completed successfully'
    });
    
  } catch (error) {
    console.error("Label extraction error:", error);
    res.status(500).json({
      success: false,
      error: 'Failed to extract label information',
      details: error.message
    });
  }
});

// NEW ENDPOINT: Get comprehensive product analysis (combines label extraction + eco-score)
app.post('/api/analyze-product', async (req, res) => {
  try {
    const { folder = 'uploads', additionalProductInfo = {} } = req.body;
    
    // First, extract labels
    const labelResponse = await fetch(`http://localhost:${PORT}/api/extract-labels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folder })
    });
    
    if (!labelResponse.ok) {
      throw new Error('Failed to extract labels');
    }
    
    const labelData = await labelResponse.json();
    
    // If label extraction was successful, get eco-score
    if (labelData.success && labelData.extractedData) {
      try {
        // Prepare eco-score request with extracted data + additional info
        const ecoScorePayload = {
          product_name: additionalProductInfo.product_name || "Unknown Product",
          brand: additionalProductInfo.brand || "Unknown Brand",
          category: additionalProductInfo.category || "General",
          weight: additionalProductInfo.weight || "250ml",
          packaging_type: additionalProductInfo.packaging_type || "Plastic",
          ingredient_list: JSON.stringify(labelData.extractedData) || "",
          latitude: additionalProductInfo.latitude || 12.9716,
          longitude: additionalProductInfo.longitude || 77.5946,
          usage_frequency: additionalProductInfo.usage_frequency || "daily",
          manufacturing_loc: additionalProductInfo.manufacturing_loc || "Mumbai"
        };
        
        const ecoScoreResponse = await fetch(`${ML_NGROK_URL}/api/get-eco-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(ecoScorePayload)
        });
        
        if (ecoScoreResponse.ok) {
          const ecoScoreData = await ecoScoreResponse.json();
          
          return res.json({
            success: true,
            folder: folder,
            images: labelData.images,
            extractedLabels: labelData.extractedData,
            ecoScoreData: ecoScoreData,
            message: 'Complete product analysis completed successfully'
          });
        }
      } catch (ecoError) {
        console.error("Eco-score API error:", ecoError);
        // Return just the label data if eco-score fails
      }
    }
    
    // Return just label extraction results if eco-score fails or wasn't attempted
    res.json({
      success: true,
      folder: folder,
      images: labelData.images,
      extractedLabels: labelData.extractedData,
      ecoScoreData: null,
      message: 'Label extraction completed successfully (eco-score analysis failed)'
    });
    
  } catch (error) {
    console.error("Product analysis error:", error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze product',
      details: error.message
    });
  }
});

// Barcode endpoint
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
  console.log(`Upload endpoints available:`);
  console.log(`  - /upload (saves to /uploads)`);
  console.log(`  - /upload-product1 (saves to /product1)`);
  console.log(`  - /upload-product2 (saves to /product2)`);
  console.log(`  - /upload/:folder (dynamic folder selection)`);
  console.log(`  - /folder-status/:folder (get folder status)`);
  console.log(`Each folder maintains max 2 images: 1 front, 1 back`);
  console.log(`Backend NGROK URL: ${BACKEND_NGROK_URL}`);
  console.log(`ML NGROK URL: ${ML_NGROK_URL}`);
});
