import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url'
import { upload } from '../utils/fileUploder.js';
import cloudinary from '../utils/fileUploadCloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, "public")));


router.get('/', (req, res) => {
    res.json({ status: "success" })
})

router.post('/uploads', upload.single("upload"), async (req, res) => {

    // Upload
    try {
        const urls = [];
        const { path: pathName } = req.file;

        const data = await cloudinary.uploader.upload(pathName, { public_id: "Images" });
        urls.push(data.secure_url);

        res.status(200).json({ status: "success", url: urls, data });

    } catch (error) {
        console.log(error.message)
    }
})

app.use('/api', router);
const server = http.createServer(app);

const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})
