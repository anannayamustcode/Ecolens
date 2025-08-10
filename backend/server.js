const fetch = require("node-fetch"); 
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

// Store uploaded images with timestamps (in production, use a database)
let uploadedImages = {
  original: null,
  comparison: null,
  uploadHistory: [] // Store upload history with timestamps
};

// Helper function to get recent uploaded images
function getRecentImages(count = 2) {
  const uploadedFiles = fs.readdirSync(uploadDir)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    })
    .map(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        uploadTime: stats.birthtime
      };
    })
    .sort((a, b) => b.uploadTime - a.uploadTime) // Sort by newest first
    .slice(0, count);

  return uploadedFiles.map(file => file.filename);
}

// Routes (ANNA)
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
//   }
  
//   // Store the original image
//   uploadedImages.original = req.file.filename;
  
//   // Add to upload history
//   uploadedImages.uploadHistory.push({
//     filename: req.file.filename,
//     uploadTime: new Date(),
//     type: 'original'
//   });
  
//   res.status(200).json({
//     message: 'Image uploaded successfully!',
//     fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
//     filename: req.file.filename
//   });
// });
// // In your server.js file

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }

  // The URL that the AI server can use to access the image
  const imageUrlForAIServer = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  // NOTE: For this to work, your AI server must be able to access this Node.js server.
  // If they are on different machines, you might need to use another ngrok tunnel for this server.js app as well.

  try {
    // === STEP 1: EXTRACT TEXT FROM THE IMAGE ===
    console.log(`Requesting text extraction for: ${imageUrlForAIServer}`);
    const extractResponse = await fetch('https://<YOUR_NGROK_URL>/extract-picture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_path: imageUrlForAIServer }), // Send the path to the image
    });

    if (!extractResponse.ok) {
      throw new Error(`Failed to extract text from image. Status: ${extractResponse.status}`);
    }

    const extractedData = await extractResponse.json();
    console.log('Extracted Data:', extractedData);
    // extractedData should be an object like: { product_name: "...", ingredient_list: "..." }

    // === STEP 2: GET ECO-SCORE USING THE EXTRACTED TEXT ===
    const ecoScorePayload = {
      ...extractedData, // Use the real data from the image!
      // Add other necessary fields that aren't in the image
      packaging_type: req.body.packaging_type || "Unknown", // Get packaging from the frontend request
      latitude: 12.9716,
      longitude: 77.5946,
      usage_frequency: 'daily',
    };

    console.log('Requesting Eco-Score with payload:', ecoScorePayload);
    const ecoResponse = await fetch('https://<YOUR_NGROK_URL>/api/get-eco-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ecoScorePayload),
    });

    if (!ecoResponse.ok) {
        throw new Error(`Failed to get Eco-Score. Status: ${ecoResponse.status}`);
    }

    const ecoData = await ecoResponse.json();
    console.log('Received Eco-Score Data:', ecoData);

    // === STEP 3: SEND THE FINAL, COMPLETE RESPONSE TO THE REACT APP ===
    return res.status(200).json({
      message: 'Image uploaded & EcoScore fetched successfully',
      fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
      filename: req.file.filename,
      ecoScoreData: ecoData, // This now contains accurate data
    });

  } catch (err) {
    console.error('Error in the upload process:', err);
    return res.status(500).json({
      message: err.message,
      fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    });
  }
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

// Get comparison data (recent 2 images)
app.get('/api/compare', (req, res) => {
  try {
    const recentImages = getRecentImages(2);
    
    res.json({
      success: true,
      recentImages: recentImages,
      frontImage: recentImages[0] || null,
      backImage: recentImages[1] || null,
      userImagePath: uploadedImages.original,
      uploadedImagePath: uploadedImages.original,
      similarityScores: null
    });
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch comparison data' 
    });
  }
});

// Upload comparison image
app.post('/api/upload-comparison', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file uploaded' 
      });
    }

    // Store the comparison image
    uploadedImages.comparison = req.file.filename;
    
    // Add to upload history
    uploadedImages.uploadHistory.push({
      filename: req.file.filename,
      uploadTime: new Date(),
      type: 'comparison'
    });

    res.json({
      success: true,
      message: 'Comparison image uploaded successfully',
      imagePath: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('Error uploading comparison image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image' 
    });
  }
});

// Compare two images
app.post('/api/compare-images', async (req, res) => {
  try {
    const { originalImage, comparisonImage } = req.body;

    if (!originalImage || !comparisonImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both images are required for comparison' 
      });
    }

    // Check if both image files exist
    const originalPath = path.join(uploadDir, originalImage);
    const comparisonPath = path.join(uploadDir, comparisonImage);

    if (!fs.existsSync(originalPath) || !fs.existsSync(comparisonPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'One or both images not found' 
      });
    }

    // Perform image comparison
    const similarityScores = await performImageComparison(originalPath, comparisonPath);

    res.json({
      success: true,
      message: 'Images compared successfully',
      similarityScores: similarityScores,
      originalImage: originalImage,
      comparisonImage: comparisonImage
    });

  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to compare images' 
    });
  }
});

// New endpoint to handle URL image upload
app.post('/api/upload-from-url', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    // Here you would implement URL image download and save
    // For now, we'll return a mock response
    const mockFilename = `url-image-${Date.now()}.jpg`;
    
    res.json({
      success: true,
      message: 'Image from URL processed successfully',
      imagePath: mockFilename,
      originalUrl: imageUrl
    });

  } catch (error) {
    console.error('Error processing URL image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image from URL'
    });
  }
});

// Barcode processing endpoint for comparison
app.post('/api/process-barcode', (req, res) => {
  try {
    const { barcode } = req.body;
    
    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: 'Barcode is required'
      });
    }

    // Mock barcode processing
    res.json({
      success: true,
      message: 'Barcode processed successfully',
      barcode: barcode,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing barcode:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process barcode'
    });
  }
});

// Get recent images endpoint
app.get('/api/recent-images', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 2;
    const recentImages = getRecentImages(count);
    
    res.json({
      success: true,
      recentImages: recentImages,
      count: recentImages.length
    });
  } catch (error) {
    console.error('Error fetching recent images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent images'
    });
  }
});

// Placeholder function for image comparison
// Replace this with your actual image comparison logic
async function performImageComparison(originalPath, comparisonPath) {
  // This is a mock implementation - replace with your actual comparison algorithm
  // You might use libraries like:
  // - OpenCV for JavaScript
  // - TensorFlow.js
  // - Sharp for image processing
  // - Or call an external AI service
  
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Mock similarity scores - replace with actual calculations
      const mockScores = {
        clarity: Math.floor(Math.random() * 40) + 60,    // 60-100%
        design: Math.floor(Math.random() * 40) + 60,     // 60-100%
        color: Math.floor(Math.random() * 40) + 60,      // 60-100%
        pattern: Math.floor(Math.random() * 40) + 60,    // 60-100%
        texture: Math.floor(Math.random() * 40) + 60,    // 60-100%
        overall: 0 // Will be calculated based on other scores
      };
      
      // Calculate overall score as average of other metrics
      const metrics = ['clarity', 'design', 'color', 'pattern', 'texture'];
      const total = metrics.reduce((sum, metric) => sum + mockScores[metric], 0);
      mockScores.overall = Math.round(total / metrics.length);
      
      resolve(mockScores);
    }, 2000); // 2 second delay to simulate processing
  });
}

// Reset comparison data (optional utility endpoint)
app.post('/api/reset-comparison', (req, res) => {
  uploadedImages.original = null;
  uploadedImages.comparison = null;
  uploadedImages.uploadHistory = [];
  
  res.json({
    success: true,
    message: 'Comparison data reset successfully'
  });
});

// Get current upload status (optional utility endpoint)
app.get('/api/upload-status', (req, res) => {
  res.json({
    success: true,
    originalImage: uploadedImages.original,
    comparisonImage: uploadedImages.comparison,
    hasOriginal: !!uploadedImages.original,
    hasComparison: !!uploadedImages.comparison,
    uploadHistory: uploadedImages.uploadHistory
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  } else if (err) {
    if (err.message === 'Only images (jpeg, jpg, png, webp) are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed!'
      });
    }
    return res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});