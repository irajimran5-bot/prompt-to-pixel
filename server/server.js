const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is online! ');
});

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required!' });
        }

        console.log(`\n====================================`);
        console.log(`Received prompt from frontend: "${prompt}"`);
        console.log(` Sending request to Hugging Face...`);

        // Using a faster, lighter model that wakes up quickly
        const response = await fetch(
            "https://api-inference.huggingface.co/models/Lykon/dreamshaper-8",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        console.log(` Hugging Face responded with status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(" HF Error Details:", errorText);
            return res.status(response.status).json({ 
                error: "Hugging Face is warming up the model. Try clicking generate again in 10 seconds!" 
            });
        }

        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        console.log("Image successfully processed! Sending to React.");
        
        
        res.json({ success: true, image: dataUrl });

    } catch (error) {
        console.error("Absolute Server Error:", error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT}`);
});