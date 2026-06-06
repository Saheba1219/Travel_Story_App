import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // absolute path so uploads always land in backend/uploads/
    // regardless of the directory the server was launched from
    cb(null, path.join(__dirname, "uploads"))
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //unique file name
  },
})

// file filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only images are allowed"), false)
  }
}

// Initialize multer instance
const upload = multer({ storage, fileFilter })

export default upload
