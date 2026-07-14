const dotenvPath = require('path').resolve(__dirname, '../../.env');
require("dotenv").config({ path: dotenvPath });
const { Credentials } = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// AWS S3 Client Setup
if (!process.env.LINODE_OBJECT_SECRET_KEY) {
  console.error("CRITICAL ERROR: LINODE_OBJECT_SECRET_KEY is missing! Image/Video uploads to S3 will fail.");
}

const s3Client = new S3({
  region: process.env.LINODE_OBJECT_STORAGE_REGION || "in-maa-1", // "in-maa-1"
  endpoint:
    process.env.LINODE_OBJECT_STORAGE_ENDPOINT || "in-maa-1.linodeobjects.com", // "in-maa-1.linodeobjects.com"
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: new Credentials({
    accessKeyId: process.env.LINODE_OBJECT_ACCESS_KEY,
    secretAccessKey: process.env.LINODE_OBJECT_SECRET_KEY,
  }),
});

exports.s3Client = s3Client;

// File Upload Filter Function
function multerFilter(req, file, cb) {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    const error = new Error("Only JPEG, JPG, or PNG formats allowed!");
    error.status = 400; // Set the status code as needed
    cb(error, false); // Reject the file with an error
  }
}

const sanitizeFileName = (originalName = "file") => {
  const ext = path.extname(originalName || "") || "";
  const base = path.basename(originalName || "file", ext);
  const normalizedBase = base
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  const safeBase = normalizedBase || `file_${Date.now()}`;
  return `${safeBase}${ext.toLowerCase()}`;
};

// Multer Storage Configuration
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    acl: "public-read",
    bucket: process.env.LINODE_OBJECT_BUCKET || "leadkart", // "leadkart"
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      let folderPath = "";
      if (file.mimetype.startsWith("image")) {
        folderPath = "LEADKART/IMAGE/";
      } else if (file.mimetype.startsWith("video")) {
        folderPath = "LEADKART/VIDEO/";
      } else if (file.mimetype.startsWith("application/pdf")) {
        folderPath = "LEADKART/PDF/";
      } else {
        folderPath = "LEADKART/OTHERS/";
      }
      const safeFileName = sanitizeFileName(file.originalname);
      const key = `${folderPath}${Date.now().toString()}_${safeFileName}`;
      cb(null, key);
    },
  }),
});

// Export the upload function
exports.upload = upload;

// Excel/CSV Upload for WhatsApp Contact Import
const uploadExcel = multer({
  storage: multerS3({
    s3: s3Client,
    acl: "public-read",
    bucket: process.env.LINODE_OBJECT_BUCKET || "leadkart",
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const key = `LEADKART/EXCEL/${Date.now()}_${file.originalname}`;
      cb(null, key);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Only Excel (.xlsx, .xls) or CSV files allowed!");
      error.status = 400;
      cb(error, false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

exports.uploadExcel = uploadExcel;

// WhatsApp Media Upload (Image/Video/Document for template headers)
const uploadWhatsAppMedia = multer({
  storage: multerS3({
    s3: s3Client,
    acl: "public-read",
    bucket: process.env.LINODE_OBJECT_BUCKET || "leadkart",
    contentType: (req, file, cb) => {
      cb(null, file.mimetype);
    },
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      let folderPath = "LEADKART/WHATSAPP_MEDIA/";
      if (file.mimetype.startsWith("image")) {
        folderPath += "IMAGE/";
      } else if (file.mimetype.startsWith("video")) {
        folderPath += "VIDEO/";
      } else {
        folderPath += "DOCUMENT/";
      }
      const key = `${folderPath}${Date.now()}_${file.originalname}`;
      cb(null, key);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      // Videos
      "video/mp4",
      "video/3gpp",
      "video/quicktime",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        "Unsupported file type. Allowed: JPG, PNG, WEBP, MP4, 3GP, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX",
      );
      error.status = 400;
      cb(error, false);
    }
  },
  limits: { fileSize: 16 * 1024 * 1024 }, // 16MB max (Meta limit for most media)
});

exports.uploadWhatsAppMedia = uploadWhatsAppMedia;

// Function to Delete a File from Object Storage
exports.deleteFileFromObjectStorage = async (url) => {
  try {
    // Extract the path from the full URL
    const urlObject = new URL(url);
    const key = urlObject.pathname.substring(1); // Remove the leading slash

    const params = {
      Bucket: process.env.LINODE_OBJECT_BUCKET || "leadkart", // "leadkart"
      Key: key,
    };

    await s3Client.deleteObject(params).promise();
    console.log(`File deleted successfully: ${key}`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};
