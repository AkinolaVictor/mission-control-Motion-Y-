
const fs = require('fs');
const path = require('path');

/**
 * Create a post on Dev.to
 * @param {Object} data - Post data (title, description, body_markdown, tags)
 */
export async function createPost(data) {
    // const apiKey = loadApiKey();
    const apiKey = process.env.dev_to_access;
    const url = 'https://dev.to/api/articles';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Prefer': 'url=articles',
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                article: {
                    title: data.title,
                    description: data.description,
                    body_markdown: data.body_markdown,
                    tags: data.tags || [],
                    published: data.published !== undefined ? data.published : false
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Dev.to API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

// --- CLI Execution Logic ---
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.log('Usage: node create_post.js \'<json_payload>\'');
        console.log('Example: node create_post.js \'{"title": "Hello World", "description": "My first post", "body_markdown": "# Hello\\nThis is a post!", "tags": ["javascript", "webdev"]}\'');
        process.exit(1);
    }

    try {
        let payload;
        if (args[0].endsWith('.json')) {
            const filePath = path.resolve(args[0]);
            payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } else {
            payload = JSON.parse(args[0]);
        }
        createPost(payload)
            .then(result => {
                console.log('Success: Post created successfully!');
                console.log(JSON.stringify(result, null, 2));
            })
            .catch(err => {
                console.error('Failed to create post:', err.message);
                process.exit(1);
            });
    } catch (e) {
        console.error('Invalid JSON payload provided. If using a file, ensure it is valid JSON.');
        process.exit(1);
    }
}

