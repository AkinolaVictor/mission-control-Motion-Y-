import axios from 'axios';

async function runTest() {
  const url = 'http://localhost:3000/api/agent/task_manager';

  try {
    const response = await axios.post(url);
    // console.log('\n--- API Response ---');
    // console.log(JSON.stringify(response.data, null, 2));
    // console.log('\nTest completed successfully.');
    console.log('launched task manager successfully.');
  } catch (error) {
    console.error('\n--- Task Manager Failed ---');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

runTest();
