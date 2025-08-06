//LOHI ONLY 1 SIDE IMAGE
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

// Store uploaded images temporarily (in production, use a database)
let uploadedImages = {
  original: null,
  comparison: null
};

// Routes (ANNA)
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  
  // Store the original image
  uploadedImages.original = req.file.filename;
  
  res.status(200).json({
    message: 'Image uploaded successfully!',
    fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    filename: req.file.filename
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

// Get comparison data (original image)
app.get('/api/compare', (req, res) => {
  try {
    res.json({
      success: true,
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
    hasComparison: !!uploadedImages.comparison
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


//ANANNAYA-CODE
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const fs = require('fs');
// const app = express();
// const PORT = 5000;


// // Create uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(uploadDir));

// // Image upload handling
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png|webp/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only images (jpeg, jpg, png, webp) are allowed'));
//     }
//   }
// });

// // Routes (ANNA)
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
//   }
  
//   res.status(200).json({
//     message: 'Image uploaded successfully!',
//     fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
//   });
// });

// app.post('/api/barcodes', (req, res) => {
//   const { barcode } = req.body;
  
//   // Validate barcode
//   if (!barcode || !/^\d{8,}$/.test(barcode)) {
//     return res.status(400).json({ error: 'Invalid barcode format' });
//   }

//   // Here you would typically save to a database
//   console.log('Received barcode:', barcode);
  
//   res.status(200).json({ 
//     success: true,
//     barcode,
//     message: 'Barcode saved successfully' 
//   });
// });

// app.post('/api/upload-comparison');
// app.post('api/compare-images')


// //ROUTE LOHI
// // let latestImage = null;

// // app.post('/upload', upload.single('image'), (req, res) => {
// //   if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

// //   const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
// //   latestImage = imageUrl;

// //   res.status(200).json({ message: 'Image uploaded', imageUrl });
// // });

// // app.get('/api/uploads/latest', (req, res) => {
// //   if (!latestImage) {
// //     return res.status(404).json({ message: 'No image found' });
// //   }
// //   res.status(200).json({ imageUrl: latestImage });
// // });


// // Error handling middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     return res.status(500).json({ message: err.message });
//   }
//   next();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT = 5000;
// // Enable CORS for frontend access
// app.use(cors());
// // Serve static files (uploaded images)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // Set up storage engine using multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // folder to store uploaded images
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });
// // Route: Upload image
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded.' });
//   }
//   // File saved successfully
//   res.status(200).json({
//     message: 'Image uploaded successfully!',
//     fileUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`
//   });
// });
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });