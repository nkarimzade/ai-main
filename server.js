import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

// Express uygulamasını başlat
const app = express();
const port = 4003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API key'i burada kullanacağız
const API_KEY = process.env.GROQ_API_KEY;

// Sunucu çalıştığında
app.get("/", (req, res) => {
    res.send("Kyrax AI sunucusu çalışıyor! 🌟");
});

// POST isteği ile Groq API'ye veri gönderme
app.post("/ask", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: "API anahtarı tanımlı değil." });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            res.json({ 
                response: data.choices[0].message.content 
            });
        } else {
            console.error("Groq API Hata:", data);
            res.status(response.status).json({ 
                error: data.error?.message || 'API yanıt hatası' 
            });
        }
    } catch (error) {
        console.error("API Hatası:", error);
        res.status(500).json({ 
            error: 'Sunucu hatası', 
            details: error.message 
        });
    }
});

// Sunucu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} üzerinde çalışıyor.`);
});
