const express=require('express');
const cors=require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 
app.get('/', (req, res) => {
    res.send('AI Image Generator Backend is officially online! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT}`);
});
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required, bro!' });
        }

        console.log(`🚀 Received prompt from frontend: "${prompt}"`);

        res.json({ 
            success: true, 
            message: `Backend received your prompt: "${prompt}". Image processing logic goes here.` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});