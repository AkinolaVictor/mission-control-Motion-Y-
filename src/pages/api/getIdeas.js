import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { category } = req.query;
  const ideasDir = path.join(process.cwd(), 'agent_memory', 'ideas');

  try {
    if (!category) {
      // Return list of categories (filenames without .json)
      const files = fs.readdirSync(ideasDir);
      const categories = files
        .filter(file => file.endsWith('.json'))
        .map(file => path.parse(file).name);

      return res.status(200).json({ categories });
    }

    // Return content of the specific category file
    const filePath = path.join(ideasDir, `${category}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const ideas = JSON.parse(fileContent);
      return res.status(200).json({ ideas });
    } else {
      return res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
