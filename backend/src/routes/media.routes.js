const express = require('express');
const multer = require('multer');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'));
    }
  }
});

// Upload image
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.mimetype.split('/')[1]}`;
    const filePath = `uploads/${fileName}`;

    // Check if bucket exists, if not create it
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('List buckets error:', bucketsError);
    } else {
      const bucketExists = buckets.find(b => b.name === 'media');
      if (!bucketExists) {
        console.log('Creating "media" bucket...');
        const { error: createError } = await supabase.storage.createBucket('media', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880 // 5MB
        });
        if (createError) {
          console.error('Create bucket error:', createError);
        }
      }
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to upload file' 
      });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    res.json({ 
      success: true, 
      data: {
        url: urlData.publicUrl,
        path: filePath
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
});

// Delete image
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        message: 'File URL is required' 
      });
    }

    // Extract path from URL
    const urlParts = url.split('/storage/v1/object/public/media/');
    if (urlParts.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid file URL' 
      });
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('media')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete file' 
      });
    }

    res.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;
