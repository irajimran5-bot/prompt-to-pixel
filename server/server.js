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
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required, bro!' });
        }

        console.log(`🎨 Sending prompt to Hugging Face: "${prompt}"`);

        // Calling Hugging Face Serverless API
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("HF Error:", errorText);
            return res.status(response.status).json({ 
                error: "Hugging Face API failed. The model might be loading up, try again in a few seconds!" 
            });
        }

        const buffer = await response.arrayBuffer();
    
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        console.log("✅ Image successfully generated and encoded!");
        
        
        res.json({ success: true, image: dataUrl });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});