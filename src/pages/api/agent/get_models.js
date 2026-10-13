import axios from 'axios';

/**
 * Model Discovery API Route
 * Proxies Ollama's /api/tags to provide a list of available models to the frontend.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Please use GET.' });
  }

  try {
    // Fetch the latest tags from the local Ollama instance
    const response = await axios.get('http://localhost:11434/api/tags');
    const data = response.data;

    // Extract just the model names for the frontend list
    const models = data.models.map(m => ({
      name: m.name,
      details: m.details
    }));

    return res.status(200).json({ models });
  } catch (error) {
    console.error('GetModels API Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch models from Ollama',
      details: error.message
    });
  }
}
