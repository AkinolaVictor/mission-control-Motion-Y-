import fs from 'fs/promises';
import path from 'path';


async function updateTaskState(status, errorMessage, task_id) {
    const baseDir = path.join(process.cwd(), 'agents', 'devto_content_creator');
    const workspaceDir = path.join(baseDir, 'workspace', task_id);
    const stateFile = path.join(workspaceDir, 'task_state.json');

    try {
        const state = JSON.parse(
            await fs.readFile(stateFile, 'utf8')
        );

        state.process_states = {
            ...(state.process_states ?? {}),
            published: status
        };

        if (status === 'completed') {
            state.status = 'completed';
            state.await_approval = true;
        } else if (status === 'failed') {
            state.status = 'failed';
        }

        if (errorMessage) {
            state.devto_post_writer_error = errorMessage;
        } else {
            delete state.devto_post_writer_error;
        }

        await fs.writeFile(
            stateFile,
            JSON.stringify(state, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error(
            'Could not update task state:',
            error.message
        );
    }
}


/**
 * Publishes the generated content to Dev.to
 * @param {Object} task_state - The current state of the task including task_id
 */

export async function content_publisher(task_state) {
    const { task_id } = task_state;
    const apiKey = process.env.dev_to_access;
    // console.log("api", apiKey)
    console.log("publishing...")
    if (!apiKey) {
        throw new Error('Dev.to API key (dev_to_access) is not configured in environment variables');
    }

    try {
        // 1. Locate the output directory
        const outputDir = path.join(process.cwd(), 'agents', 'devto_content_creator', 'workspace', task_id, 'output');

        // 2. Find the JSON content file in the output directory
        const files = await fs.readdir(outputDir);
        const contentFile = files.find(file => file.endsWith('.json'));

        if (!contentFile) {
            throw new Error(`No content JSON file found in output directory: ${outputDir}`);
        }

        const filePath = path.join(outputDir, contentFile);
        const fileData = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(fileData);

        // 3. Validate and extract article data based on expected format
        const article = parsedData.article;
        if (!article || !article.title || !article.body_markdown) {
            throw new Error('Invalid content format: Missing title or body_markdown in the article object');
        }

        // 4. Publish to Dev.to API
        const tags = article.tags
        .map(tag =>
            tag
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9_]/g, "")
        )
        .filter(Boolean)
        .slice(0, 4);

        const url = 'https://dev.to/api/articles';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Prefer': 'url=articles',
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                article: {
                    title: article.title,
                    description: article.description || '',
                    body_markdown: article.body_markdown,
                    tags: article.tags || [],
                    // tags: tags || article.tags || [],
                    published: true // Set to true to make the post live
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Dev.to API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        const articleUrl = result.url || result.article?.url;

        // 5. Update task state to reflect successful publication
        const statePath = path.join(process.cwd(), 'agents', 'devto_content_creator', 'workspace', task_id, 'task_state.json');
        const currentState = JSON.parse(await fs.readFile(statePath, 'utf8'));

        const updatedState = {
            ...currentState,
            process_states: {
                ...currentState.process_states,
                published: 'completed'
            },
            published_url: articleUrl
        };

        await fs.writeFile(statePath, JSON.stringify(updatedState, null, 2), 'utf8');

        console.log(`Successfully published to Dev.to: ${articleUrl}`);
        return { success: true, url: articleUrl };

    } catch (error) {
        console.error(`Content Publisher Error for task ${task_id}:`, error.message);
        await updateTaskState("failed", "Content Publisher Error for task", task_id)
        throw error;
    }
}
