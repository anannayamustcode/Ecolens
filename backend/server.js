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


dotenv.config();

// Add this debug line
console.log('🔍 ENV DEBUG:');
console.log('   BACKEND_NGROK_URL from env:', process.env.BACKEND_NGROK_URL);
console.log('   ML_NGROK_URL from env:', process.env.ML_NGROK_URL);
console.log('   PORT from env:', process.env.PORT);
console.log('   All env vars:', Object.keys(process.env).filter(key => key.includes('NGROK')));// __dirname and __filename fix for ES modules
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
const BACKEND_NGROK_URL = process.env.BACKEND_NGROK_URL || "https://875236eb16a9.ngrok-free.app";
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

// Helper function to test URL reachability
const testUrlReachability = async (url) => {
  try {
    console.log(`🔍 Testing URL reachability: ${url}`);
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 5000,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    const isReachable = response.ok;
    console.log(`${isReachable ? '✅' : '❌'} URL ${isReachable ? 'REACHABLE' : 'NOT REACHABLE'}: ${url}`);
    console.log(`   Status: ${response.status}, Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
    
    return isReachable;
  } catch (error) {
    console.log(`❌ URL FETCH ERROR: ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
};

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
    console.log(`🗑️ Removed old file: ${oldFile}`);
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

// Enhanced upload handler with debugging
const handleUploadWithDebug = async (req, res, folder, folderName) => {
  if (!req.file) {
    console.log(`❌ Upload failed - No file uploaded to ${folderName}`);
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  console.log(`\n📤 NEW UPLOAD TO ${folderName.toUpperCase()}`);
  console.log(`   File: ${req.file.filename}`);
  console.log(`   Original: ${req.file.originalname}`);
  console.log(`   Size: ${req.file.size} bytes`);
  console.log(`   Path: ${req.file.path}`);
  
  const dirInfo = getDirectoryInfo(folder);
  const isFirstImage = req.file.filename.startsWith('front-');
  
  // Generate URLs
  const localUrl = `http://localhost:${PORT}/${folderName}/${req.file.filename}`;
  const publicUrl = `${BACKEND_NGROK_URL}/${folderName}/${req.file.filename}`;
  
  console.log(`\n🔗 GENERATED URLS:`);
  console.log(`   Local URL: ${localUrl}`);
  console.log(`   Public URL: ${publicUrl}`);
  
  // Test URL reachability
  console.log(`\n🌐 TESTING URL REACHABILITY:`);
  const localReachable = await testUrlReachability(localUrl);
  const publicReachable = await testUrlReachability(publicUrl);
  
  console.log(`\n📊 UPLOAD SUMMARY:`);
  console.log(`   Folder: ${folderName}`);
  console.log(`   Image Type: ${isFirstImage ? 'front' : 'back'}`);
  console.log(`   Total Images Now: ${dirInfo.totalFiles + 1}`);
  console.log(`   Local URL Reachable: ${localReachable ? 'YES' : 'NO'}`);
  console.log(`   Public URL Reachable: ${publicReachable ? 'YES' : 'NO'}`);
  
  res.status(200).json({
    message: `Image uploaded successfully to ${folderName} as ${isFirstImage ? 'front' : 'back'} image!`,
    fileUrl: localUrl,
    publicUrl: publicUrl,
    folder: folderName,
    imageType: isFirstImage ? 'front' : 'back',
    totalImages: dirInfo.totalFiles + 1,
    debug: {
      localUrlReachable: localReachable,
      publicUrlReachable: publicReachable,
      fileSize: req.file.size,
      mimetype: req.file.mimetype
    }
  });
};

// LEGACY ROUTES - Enhanced with debugging
// File 1 - Upload to /uploads folder (LEGACY - consider moving to controller)
app.post('/upload', uploadToUploads.single('image'), async (req, res) => {
  await handleUploadWithDebug(req, res, uploadsDir, 'uploads');
});

// File 2 - Upload to /product1 folder (LEGACY)
app.post('/upload-product1', uploadToProduct1.single('image'), async (req, res) => {
  await handleUploadWithDebug(req, res, product1Dir, 'product1');
});

// File 3 - Upload to /product2 folder (LEGACY)
app.post('/upload-product2', uploadToProduct2.single('image'), async (req, res) => {
  await handleUploadWithDebug(req, res, product2Dir, 'product2');
});

// Generic upload route with folder parameter (LEGACY)
app.post('/upload/:folder', (req, res) => {
  const folder = req.params.folder;
  let uploadMiddleware;
  let directory;
  
  switch(folder) {
    case 'uploads':
      uploadMiddleware = uploadToUploads.single('image');
      directory = uploadsDir;
      break;
    case 'product1':
      uploadMiddleware = uploadToProduct1.single('image');
      directory = product1Dir;
      break;
    case 'product2':
      uploadMiddleware = uploadToProduct2.single('image');
      directory = product2Dir;
      break;
    default:
      return res.status(400).json({ message: 'Invalid folder specified. Use: uploads, product1, or product2' });
  }
  
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.log(`❌ Upload middleware error for ${folder}: ${err.message}`);
      return res.status(400).json({ message: err.message });
    }
    
    await handleUploadWithDebug(req, res, directory, folder);
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
  
  console.log(`\n📂 FOLDER STATUS REQUEST: ${folder}`);
  console.log(`   Directory: ${directory}`);
  console.log(`   Total Images: ${dirInfo.totalFiles}`);
  console.log(`   Front Images: ${dirInfo.frontImages.length}`);
  console.log(`   Back Images: ${dirInfo.backImages.length}`);
  console.log(`   All Files: ${dirInfo.allFiles.join(', ')}`);
  
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

// NEW ENDPOINT: Extract label information from uploaded images - ENHANCED WITH DEBUGGING
app.post('/api/extract-labels', async (req, res) => {
  try {
    console.log(`\n🏷️ STARTING LABEL EXTRACTION`);
    console.log(`   Request body:`, req.body);
    
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
        console.log(`❌ Invalid folder specified: ${folder}`);
        return res.status(400).json({ 
          success: false,
          error: 'Invalid folder specified. Use: uploads, product1, or product2' 
        });
    }
    
    console.log(`   Target folder: ${folder}`);
    console.log(`   Directory path: ${directory}`);
    
    // Get directory information
    const dirInfo = getDirectoryInfo(directory);
    console.log(`\n📁 DIRECTORY INFO:`);
    console.log(`   Total files: ${dirInfo.totalFiles}`);
    console.log(`   Front images: ${dirInfo.frontImages}`);
    console.log(`   Back images: ${dirInfo.backImages}`);
    console.log(`   All files: ${dirInfo.allFiles}`);
    
    // Check if we have both front and back images
    if (dirInfo.frontImages.length === 0 && dirInfo.backImages.length === 0) {
      console.log(`❌ No images found in ${folder}`);
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
    
    console.log(`\n🔗 PREPARED IMAGE URLS FOR ML API:`);
    console.log(`   Front Image URL: ${frontImageUrl || 'NULL'}`);
    console.log(`   Back Image URL: ${backImageUrl || 'NULL'}`);
    
    // Test URL reachability before sending to ML
    console.log(`\n🌐 TESTING IMAGE URL REACHABILITY BEFORE ML API CALL:`);
    if (frontImageUrl) {
      await testUrlReachability(frontImageUrl);
    }
    if (backImageUrl) {
      await testUrlReachability(backImageUrl);
    }
    
    // Prepare request payload for ML API
    const mlPayload = {
      image_path1: frontImageUrl || "",
      image_path2: backImageUrl || ""
    };
    
    console.log(`\n🚀 SENDING TO ML API:`);
    console.log(`   ML API URL: ${ML_NGROK_URL}/extract-picture`);
    console.log(`   Payload:`, JSON.stringify(mlPayload, null, 2));
    
    // Call the ML API
    const mlResponse = await fetch(`${ML_NGROK_URL}/extract-picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(mlPayload)
    });
    
    console.log(`\n📨 ML API RESPONSE:`);
    console.log(`   Status: ${mlResponse.status}`);
    console.log(`   Status Text: ${mlResponse.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(mlResponse.headers));
    
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error(`❌ ML API ERROR RESPONSE:`, errorText);
      throw new Error(`ML API responded with status: ${mlResponse.status}`);
    }
    
    const mlData = await mlResponse.json();
    console.log(`\n✅ ML API SUCCESS RESPONSE:`);
    console.log(`   Response Data:`, JSON.stringify(mlData, null, 2));
    
    // Return the extracted data along with image information
    const responseData = {
      success: true,
      folder: folder,
      images: {
        front: frontImageUrl,
        back: backImageUrl
      },
      extractedData: mlData,
      message: 'Label extraction completed successfully'
    };
    
    console.log(`\n🎯 FINAL RESPONSE TO CLIENT:`);
    console.log(`   Response:`, JSON.stringify(responseData, null, 2));
    
    res.json(responseData);
    
  } catch (error) {
    console.error(`\n💥 LABEL EXTRACTION ERROR:`, error);
    console.error(`   Error stack:`, error.stack);
    
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
    console.log(`\n🧪 STARTING COMPREHENSIVE PRODUCT ANALYSIS`);
    console.log(`   Request body:`, JSON.stringify(req.body, null, 2));
    
    const { folder = 'uploads', additionalProductInfo = {} } = req.body;
    
    console.log(`\n🏷️ STEP 1: EXTRACTING LABELS`);
    
    // First, extract labels
    const labelResponse = await fetch(`http://localhost:${PORT}/api/extract-labels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folder })
    });
    
    console.log(`   Label extraction response status: ${labelResponse.status}`);
    
    if (!labelResponse.ok) {
      const errorText = await labelResponse.text();
      console.log(`❌ Label extraction failed: ${errorText}`);
      throw new Error('Failed to extract labels');
    }
    
    const labelData = await labelResponse.json();
    console.log(`✅ Label extraction successful:`, JSON.stringify(labelData, null, 2));
    
    // If label extraction was successful, get eco-score
    if (labelData.success && labelData.extractedData) {
      try {
        console.log(`\n🌱 STEP 2: GETTING ECO-SCORE`);
        
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
        
        console.log(`   Eco-score API URL: ${ML_NGROK_URL}/api/get-eco-score`);
        console.log(`   Eco-score payload:`, JSON.stringify(ecoScorePayload, null, 2));
        
        const ecoScoreResponse = await fetch(`${ML_NGROK_URL}/api/get-eco-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(ecoScorePayload)
        });
        
        console.log(`   Eco-score response status: ${ecoScoreResponse.status}`);
        console.log(`   Eco-score response headers:`, Object.fromEntries(ecoScoreResponse.headers));
        
        if (ecoScoreResponse.ok) {
          const ecoScoreData = await ecoScoreResponse.json();
          console.log(`✅ Eco-score successful:`, JSON.stringify(ecoScoreData, null, 2));
          
          const finalResponse = {
            success: true,
            folder: folder,
            images: labelData.images,
            extractedLabels: labelData.extractedData,
            ecoScoreData: ecoScoreData,
            message: 'Complete product analysis completed successfully'
          };
          
          console.log(`\n🎯 COMPLETE ANALYSIS SUCCESS - FINAL RESPONSE:`);
          console.log(`   Response:`, JSON.stringify(finalResponse, null, 2));
          
          return res.json(finalResponse);
        } else {
          const ecoErrorText = await ecoScoreResponse.text();
          console.log(`❌ Eco-score API failed: ${ecoErrorText}`);
        }
      } catch (ecoError) {
        console.error(`💥 Eco-score API error:`, ecoError);
        console.error(`   Error stack:`, ecoError.stack);
        // Return just the label data if eco-score fails
      }
    }
    
    // Return just label extraction results if eco-score fails or wasn't attempted
    const partialResponse = {
      success: true,
      folder: folder,
      images: labelData.images,
      extractedLabels: labelData.extractedData,
      ecoScoreData: null,
      message: 'Label extraction completed successfully (eco-score analysis failed)'
    };
    
    console.log(`\n⚠️ PARTIAL ANALYSIS SUCCESS - FINAL RESPONSE:`);
    console.log(`   Response:`, JSON.stringify(partialResponse, null, 2));
    
    res.json(partialResponse);
    
  } catch (error) {
    console.error(`\n💥 PRODUCT ANALYSIS ERROR:`, error);
    console.error(`   Error stack:`, error.stack);
    
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
  
  console.log(`\n📊 BARCODE ENDPOINT:`);
  console.log(`   Received barcode: ${barcode}`);
  
  // Validate barcode
  if (!barcode || !/^\d{8,}$/.test(barcode)) {
    console.log(`❌ Invalid barcode format: ${barcode}`);
    return res.status(400).json({ error: 'Invalid barcode format' });
  }

  // Here you would typically save to a database
  console.log(`✅ Valid barcode processed: ${barcode}`);
  
  res.status(200).json({ 
    success: true,
    barcode,
    message: 'Barcode saved successfully' 
  });
});

// Placeholder routes (implement these based on your needs)
app.post('/api/upload-comparison', (req, res) => {
  console.log(`\n📋 UPLOAD COMPARISON ENDPOINT CALLED`);
  console.log(`   Request body:`, req.body);
  res.status(200).json({ message: 'Upload comparison endpoint - implement logic here' });
});

app.post('/api/compare-images', (req, res) => {
  console.log(`\n🔍 COMPARE IMAGES ENDPOINT CALLED`);
  console.log(`   Request body:`, req.body);
  res.status(200).json({ message: 'Compare images endpoint - implement logic here' });
});

// Eco-score proxy endpoint - ENHANCED WITH DEBUGGING
app.post("/api/get-eco-score-proxy", async (req, res) => {
  try {
    console.log(`\n🌱 ECO-SCORE PROXY ENDPOINT`);
    console.log(`   Request body:`, JSON.stringify(req.body, null, 2));
    
    if (!ML_BASE_URL) {
      console.log(`❌ ML_BASE_URL not configured`);
      return res.status(500).json({ error: "ML_BASE_URL not configured" });
    }

    const targetUrl = `${ML_BASE_URL}/api/get-eco-score`;
    console.log(`\n🚀 CALLING ML API:`);
    console.log(`   Target URL: ${targetUrl}`);
    console.log(`   Payload:`, JSON.stringify(req.body, null, 2));
    
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(req.body),
      timeout: 10000 // 10 second timeout
    });

    console.log(`\n📨 ML API PROXY RESPONSE:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Status Text: ${response.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ML API Error Response:`, errorText);
      throw new Error(`ML server responded with status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(`❌ Non-JSON response from ML server:`, text);
      return res.status(500).json({ 
        error: "ML server returned non-JSON response",
        details: text.substring(0, 200) // First 200 chars for debugging
      });
    }

    const data = await response.json();
    console.log(`✅ ML API Success Response:`, JSON.stringify(data, null, 2));
    
    res.json(data);

  } catch (err) {
    console.error(`\n💥 PROXY ERROR:`, err);
    console.error(`   Error stack:`, err.stack);
    
    if (err.code === 'ECONNREFUSED') {
      console.log(`❌ Connection refused to ML server`);
      return res.status(503).json({ 
        error: "Cannot connect to ML server",
        details: "ML service is not available"
      });
    }
    
    if (err.name === 'SyntaxError') {
      console.log(`❌ Invalid JSON from ML server`);
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
  console.log(`\n💥 ERROR MIDDLEWARE TRIGGERED:`);
  console.log(`   Error type: ${err.constructor.name}`);
  console.log(`   Error message: ${err.message}`);
  console.log(`   Error stack:`, err.stack);
  
  if (err instanceof multer.MulterError) {
    console.log(`❌ Multer error: ${err.message}`);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    console.log(`❌ General error: ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Debug endpoint to test URL serving
app.get('/debug/test-urls/:folder', async (req, res) => {
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
      return res.status(400).json({ message: 'Invalid folder specified' });
  }
  
  console.log(`\n🔧 DEBUG URL TESTING FOR ${folder.toUpperCase()}`);
  
  const dirInfo = getDirectoryInfo(directory);
  const results = [];
  
  for (const file of dirInfo.allFiles) {
    const localUrl = `http://localhost:${PORT}/${folder}/${file}`;
    const publicUrl = `${BACKEND_NGROK_URL}/${folder}/${file}`;
    
    console.log(`\n   Testing file: ${file}`);
    const localReachable = await testUrlReachability(localUrl);
    const publicReachable = await testUrlReachability(publicUrl);
    
    results.push({
      filename: file,
      localUrl,
      publicUrl,
      localReachable,
      publicReachable
    });
  }
  
  console.log(`\n📊 DEBUG RESULTS SUMMARY:`);
  console.log(`   Total files tested: ${results.length}`);
  console.log(`   Local URLs working: ${results.filter(r => r.localReachable).length}`);
  console.log(`   Public URLs working: ${results.filter(r => r.publicReachable).length}`);
  
  res.json({
    folder,
    totalFiles: results.length,
    results,
    summary: {
      localUrlsWorking: results.filter(r => r.localReachable).length,
      publicUrlsWorking: results.filter(r => r.publicReachable).length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 SERVER STARTING`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Server URL: http://localhost:${PORT}`);
  console.log(`   Backend NGROK URL: ${BACKEND_NGROK_URL}`);
  console.log(`   ML NGROK URL: ${ML_NGROK_URL}`);
  console.log(`   ML BASE URL: ${ML_BASE_URL}`);
  
  console.log(`\n📁 UPLOAD DIRECTORIES:`);
  console.log(`   uploads: ${uploadsDir}`);
  console.log(`   product1: ${product1Dir}`);
  console.log(`   product2: ${product2Dir}`);
  
  console.log(`\n🛠️ AVAILABLE ENDPOINTS:`);
  console.log(`   📤 Upload endpoints:`);
  console.log(`     - POST /upload (saves to /uploads)`);
  console.log(`     - POST /upload-product1 (saves to /product1)`);
  console.log(`     - POST /upload-product2 (saves to /product2)`);
  console.log(`     - POST /upload/:folder (dynamic folder selection)`);
  console.log(`   📊 Status endpoints:`);
  console.log(`     - GET /folder-status/:folder (get folder status)`);
  console.log(`   🏷️ ML endpoints:`);
  console.log(`     - POST /api/extract-labels (extract label data)`);
  console.log(`     - POST /api/analyze-product (complete analysis)`);
  console.log(`     - POST /api/get-eco-score-proxy (eco-score proxy)`);
  console.log(`   🔧 Debug endpoints:`);
  console.log(`     - GET /debug/test-urls/:folder (test URL reachability)`);
  console.log(`   📊 Other endpoints:`);
  console.log(`     - POST /api/barcodes (barcode processing)`);
  
  console.log(`\n📏 FOLDER RULES:`);
  console.log(`   Each folder maintains max 2 images: 1 front, 1 back`);
  console.log(`   Older images are automatically replaced`);
  
  console.log(`\n🔍 DEBUGGING FEATURES ACTIVE:`);
  console.log(`   ✅ URL reachability testing`);
  console.log(`   ✅ Comprehensive request/response logging`);
  console.log(`   ✅ ML API communication debugging`);
  console.log(`   ✅ File system operation logging`);
  console.log(`   ✅ Error tracking and reporting`);
  
  console.log(`\n🎯 TO DEBUG YOUR ISSUE:`);
  console.log(`   1. Upload an image and check console for URL generation/testing`);
  console.log(`   2. Call /api/extract-labels and check ML API communication logs`);
  console.log(`   3. Use /debug/test-urls/:folder to test all URLs in a folder`);
  console.log(`   4. Monitor console for detailed request/response logging`);
});