import express from 'express';
import cors from 'cors';
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

let userData: Array<Record<string, string>> = []

app.use(cors())
app.use(express.json());

// Route to handle csv file uploads
app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        if (file.mimetype !== 'text/csv') return res.status(400).json({ message: 'Invalid file format' });

        const csvData = file.buffer.toString('utf-8')
        const jsonFromCsv = csvToJson.fieldDelimiter(',').csvStringToJson(csvData)

        // Save in Memory (It could be a DB instead)
        userData = jsonFromCsv
    } catch (error) {
        return res.status(500).json({ message: 'Error parsing the file' });
    }

    return res.status(200).json({ data: userData, message: 'File uploaded successfully' });
})

// Route to filter users by query
app.get('/api/users', async (req, res) => {
    const q = req.query.q

    if (!q) return res.status(400).json({ message: 'Please provide a search query' });

    if (typeof q !== 'string') return res.status(400).json({ message: 'Please provide a valid search query' });
    const search = q.toLowerCase()
    const filteredData = userData.filter(user => {
        return Object.values(user).some(value => value.toLowerCase().includes(search))
    })
    return res.status(200).json({ data: filteredData });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

