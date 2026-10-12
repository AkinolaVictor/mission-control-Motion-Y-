import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { category } = req.query;
  const newsDir = path.join(process.cwd(), 'agent_memory', 'news');

  try {
    if (!category) {
      // Return all categories
      const categoriesPath = path.join(newsDir, 'categories.json');
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      return res.status(200).json({ categories: categoriesData });
    } else {
      // Return news items for the specific category
      const categoryPath = path.join(newsDir, `${category}.json`);
      if (fs.existsSync(categoryPath)) {
        const newsData = JSON.parse(fs.readFileSync(categoryPath, 'utf8'));
        return res.status(200).json({ news: newsData });
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    }
  } catch (error) {
    console.error('Error reading news data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}