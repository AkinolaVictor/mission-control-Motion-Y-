
// import { article_writter } from './agents/researcher/functions/article_writter.js';
import { url_scrapper } from './archives/url_scrapper_x.js';

async function runTest() {
  const task_state = {
    task_id: "game_3_test",
    search_prompt: "advancements in game generation AI"
  };

  console.log('Starting test with task_state:', task_state);
  
  try {
    // const result = await article_writter(task_state);
    const result = await url_scrapper(task_state);
    console.log("done");

  } catch (error) {
    console.error('\n--- Test Failed ---');
    console.error(error);
  }
}

runTest();