import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract medicine name and expiry date. Return ONLY JSON like:\n{ "name": "...", "expiry": "..." }'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const aiMessage = response.choices[0].message.content.trim();

    const jsonString = aiMessage.replace(/```json/i, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonString);

    res.json(result);
  } catch (error) {
    console.error('Error processing scan:', error);
    res.status(500).json({ error: 'Internal server error processing the image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});