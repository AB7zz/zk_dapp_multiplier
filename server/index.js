import express from 'express'
import { generateProof } from './lib/generateProof.js';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173', 'https://belcanto.netlify.app', 'http://localhost:5174', 'http://belcantoadmin.netlify.app/'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins array or if it's undefined (not set)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors())

app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}))

app.post('/generate_proof', async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(403).json({ error: 'Request has no body' });
  }

  console.log(body);

  const input0 = parseInt(body.input0);
  const input1 = parseInt(body.input1);

  if (isNaN(input0) || isNaN(input1)) {
    return res.status(403).json({ error: 'Invalid inputs' });
  }

  try {
    const proof = await generateProof(input0, input1);

    if (proof.proof === '') {
      return res.status(403).json({ error: 'Proving failed' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(proof);
  } catch (error) {
    console.error('Error generating proof:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});