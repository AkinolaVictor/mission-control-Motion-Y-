create an agent that help me to create a workflow

a workflow is a systematic step by step way/phase/stage/approach/guide to getting a goal achieved

the agent would interact/chat with the user to create an a workflow
it ensures to ask every necessary detail on the goal to be achieved,
if the user has no answer, it does what is best
after every detail has been agreed upon, 
it walks the user through a summary of what has been concluded upon in less than 200 words
no fluff words, no idle words, be concise and hit the point
then it generates a [name_of_workflow]_workflow.md file to a folder






agents should have a list of all they can do
it should be stored in their individal metadata.json as skills
each skill should be properly documented in the TOOLS.md file











after an agent is just created, i want to have a welcoming onboarding screen as a modal on the screen
this modal is to setup the agent, create its necessary functions that make the agent function properly, 
and also modify the agent system files (like TOOLS.md, MEMORY.md, HEARTBEAT.md, etc) to know how to use these functions,
so that anytime the agent is prompted, it should be able to carry out operations on it's own, or wait for human approvals to get things done

workflow
Frontend Implementation
-by default every newly created agent should have a property in their metadata.json file that says (setup: false), if an agent has its setup property to be false, you must show the onboarding screen to the user to do the setup
- the setup screen should be majorly a chat interface where the user chats directly with the orchestrator agent
- after the chat is completed, the chat screen is replaced with a summary and plan screen, containing all the details of what was chatted about and the plan on how to go about it
- if the user clicks "Replan", it should revert back to the chat screen, so the user can replan (it means they are not satisfied with the plan)
- if the user clicks "Done", it should send the chat summary as request to the agent_setup api route, and show a spin loader while waiting for the backend request, if done, then it should close the onboarding screen
- do not ever edit html or css of the AgentChatWindow, i like it as it is

Backend Implementation
Phase 1:
- a new api route /api/agent/agent_setup_chat would be used for this, however since the AgentChatWindow.jsx component is already wired to /api/agent/chat, you must configure it to be able to still retain its ability while being also useful for this task (you can pass in props to help select which api route to use fo chating)
- note that in this chat with the /api/agent/agent_setup_chat api route, the orchestrator must read all the system files of the newly created agent to help guide in the chat (especially in the initial message)
- the AgentChatWindow component must retain all its previous abilities (to save and get chat history, and other, no breaking changes)
- when the chat screen (with orchestrator) is shown to the user, instead of waiting for a message from the user, the orchestrator should immediately propmt the user with all the necessary information to be gotten from this chat including: 
    1. warm welcome, 
    2. agent workflow (to help understand the right functions and the way to plan it out)
    3. the plan should include a list of functions that would be created to help the agent get it's work done.
    
    for example if i create an agent to write publish posts for me, it must be clear on certain things like:
    - social media platform to share the post (say dev.to), 
    - the details (keys and password) to access the social media plaform
    after all this is provided
    - the plan should be to write a function that receives a data (from a task), and pulls in information like content to be shared.
    -also it should be able to pull the necessary keys from @agents/config.js in a key[youtube] property for access to publish
    The plan must be focused and straight to point, no unnecessary function must be created

    

Phase 2:
-create a /api/agent/agent_ability_setup api route for this
-once the user clicks "done", after being satisfied with the summary and plan, then they should pass all necessary data to /api/agent/agent_ability_setup api route
-this would create all the necessary function(s) needed for this agent to work fine at the @agents/[agent_name]/functions/ folder. ensure all functions are stored there
-at the top level of each function. write the information on function purpose, how to use it, and the data types necessary.
-after functions are created, check through the system files in the @agents/[agent_name]/system and update the TOOLS.md file, create sections for each files and explain how to use them, how to prompt the user for all the necessary parameters, and how to insist upon the right parameter before calling the function
-for example if a user wants to send email, they must provide necessary information or context of the message to be sent, they agent must know how to ask the user to provide this parameters, or the agent should be able to generate them based on the contextual explanations given by the user, so the paramaters can be passed to the function and it works fine.
-after all these is done, update the metadata.json file of the agent, set the setup:true, also add (or update) a property of the tools array as in:
{
    ...,
    setup: true,
    tools: [  
        /* Example 1 */
        {
            type: "function",
            function: {
                name: "send_email",
                description: "Send an email to a specified recipient.",
                parameters: {
                    type: "object",
                    properties: {
                        to: { type: "string" },
                        subject: { type: "string" },
                        body: { type: "string" }
                    },
                    required: ["to", "subject", "body"]
                }
            }
        },
        /* Example 2 */
        {
            type: "function",
            function: {
                name: "create_social_post",
                description: "Create a post for a social media platform.",
                parameters: {
                    type: "object",
                    properties: {
                        platform: {
                            type: "string",
                            enum: ["linkedin", "instagram", "youtube"]
                        },
                        content: { type: "string" }
                    },
                    required: ["platform", "content"]
                }
            }
        }
    ]
}

How to build the /api/agent/agent_ability_setup api route
-instead of having a long monolithic code doing all things at once, i want you to modularize the route into units of functions
-create the modules (components functions) in a  @src/pages/api/agent/agent_ability_setup_modules/ folder
-this folder should contain agent_function_builder.js (majorly for building all types of functions for agents), and also any other necessary modularized components. all theses modules must be imported into the @src/pages/api/agent/agent_ability_setup.js file
-i would give you further functions on how to make this agent builder more effective

don't worry about when the functions would be run by an agent, simply focus on creating the functions, teaching the agent to use it, the necessary data for the function to run


ask me any question before starting (for clarity)
let me see your plan before starting

1. the metadata.json is a separate physical file inside each agent's folder (e.g., @agents/[agent_name]/metadata.json), 
2. yes, 
3. yes, i will import them in other files, 
4. yes, json/object passed down, 
5. yes, but instead of having an api url chatendpoint to be passed as a prop into the AgentChatWindow, let all the api urls be stored in an object inside the AgentChatWindow component, so you can receive a string prop for the name of the endpoint to chat with, stored inside the object, if no chatendpoint is provided, the default (currently being used) should be set as default





setup global skills for all agents,
and teach each agent on how to access them through api or basic function calls. for example:
-cron task scheduler
-task validator, // check if all conditions are right for this agent to carry out this task
-task runner,
-task manager,
-task creator,
-function creator,
-function updater,
-approval requester,
-speak to user directly






researcher
An agent that is able to make research, search the internet search and from all it finds it is able to create an article that can be reused elsewhere, or return it in any type of format




i created an agent that is meant to help me make research on the internet, and summarize all its findings into an article.
this is the process i want it to go through in doing it's work
1. url collector: search the web for url of helpful places sources (including youtube)
2. web scrapper: visit each url one by one, scrape its content and store it as a structured txt document
3. youtube text extractor: extract the transcript of a youtube video and save in a txt document
4. llm research: prompt an llm to make its own isolated research and store its result in a txt document
5. article writer: read each and all the (groups) of available data, analyze and summarize them, and write out a mature article [title.md] file

i would be building this one by one starting with this:
create a function that research a question/prompt (given to it) in the internet (google, wikipedia, bing, duckduckgo, youtube, and any other necessary place to make a research)
- create the function in @agents/researcher/functions/url_extractor.js 
- it should get about 3-5 top links from each of the sources it visits, and save them in the folder research_urls.json in the @agents/researcher/workspace/[task_id] folder (it should create the folder if it doesnt exist). the json should look like this: 
[
    {id: 1, url: "url address"},
    {id: 2, url: "url address"},
    {id: 3, url: "url address"},
    {id: 4, url: "url address"},
    {id: 5, url: "url address"},
    {id: 6, url: "url address"},
    {id: 7, url: "url address"},
    ...
]
- it keeps adding each url links to that single json file 
- it would receive props (task_id, search_prompt). these props are mandatory
-after the job is done and completed, it should update a @agents/researcher/workspace/[task_id].task_state.json file as in:
{
    ...,
    process_states: {
        ...,
        url_collection: "completed" /*completed || failed*/
    }
}

let me see your plan for this first before starting


-keep in mind that the @agents/researcher/workspace/[task_id] should already have been created even before the function is called, but if it does not exist, it should be created
-make sure to use free options
-dont be limited to the target sources provided, if you know other important target source, please add them
-please keep in mind that the function must receive only a single prop called task_state, this would contain all necessary information including task_id, and search_prompt
-also while updating the research_urls.json file, the function must first ensure the process_states.url_collection is not already false,
if it is false, it must erase all existing url, and start inserting again

get it done now



i want you to modify this function to pull in at least 10 url links from about 30 different sources, make sure the new code runs :
effectively:


Now the urls have been acquired and stored in folder @agents/researcher/workspace/[task_id]/reasearch_urls.json
no i want you to create a function that loops through each url one after the other, extract the texts and store it in a txt file @agents/researcher/workspace/[task_id]/extractions/[generated_id].txt
each txt file should be in this order
1. link text is scraped from
2. title of content scrapped
3. all the content scrapped
create the function in @agents/researcher/functions/url_scrapper.js

- it would receive props (task_state) (which contains task_id (as in task_state.task_id) and other necessary information). this props is mandatory
-before any work is done, it must first check to donfirm that task_states.process_states.url_collection is set to "completed", otherwise scrapping cannot be done
-after the job is done and completed, it should update a @agents/researcher/workspace/[task_id]/task_state.json file as in:
{
    ...,
    process_states: {
        ...,
        url_scrapping: "completed" /*completed || failed*/
    }
}

let me see your plan before starting


i created this function to help scrape some web content but i often get some errors (419, 403), and sometimes, it does not save the scrapped document as a file for some url, i mean it does save some extracted content to txt as expected, but for some, it does not and also doesn't return any error for explanation

is there a better way or approach to scrape the content and save as [generated_id].txt for each url

here's the code:





now the scrapper function has been successfully built and all scrapped content are stored in @agents/researcher/workspace/[task_id]/extractions/ folder


i want you to create a function that prompts the specified model (of the researcher agent) to make a research on the given search_prompt (it can use internet where necessary), and save its outcome in @agents/researcher/workspace/[task_id]/extractions/agent_search_result.txt tile

- it would receive props (task_state) (which contains task_id (as in task_state.task_id), search_prompt, and other necessary information). this props is mandatory
-before any work is done, it must first check to confirm that task_states.process_states.url_scrapping is set to "completed", otherwise agent search cannot be done
-the research result should also contain references of 
-after the job is done and completed, it should update a @agents/researcher/workspace/[task_id]/task_state.json file as in:
{
    ...,
    process_states: {
        ...,
        agent_search: "completed" /*completed || failed*/
    }
}

create the function in @agents/researcher/functions/model_research.js
let me see your plan before starting


i want you to update this code, i want it as an agent to help me search the internet based on a topic:search_prompt and write an article that i can save in a document

i want it to inject a RESEARCH.md file (at path.join(process.cwd(), 'agents', 'researcher', 'system', 'RESEARCH.md');) into its instruction

preserve the other logic of the code,

here's the code






create a function in @agents/researcher/functions/article_writer.js
this function reads all the txt files in @agents/researcher/workspace/task_id/extractions
read and understand all of them, and write out a very comprehensive and detailed article
the title of the article is search_prompt (received as a prop, should be passed into the function)

the article should be stored in @agents/researcher/output/[search_prompt_date_and_time].md

the function should take in an object prop task_state (which contain {task_id, search_prompt})

ensure to inject in the @agents/researcher/system/ARTICLE.md file into the prompt instruction. It contains information on how the agent should write out the article

the model to be used for this operation is stored in @agents/researcher/metadata.json (as in {model})

let me see your plan before starting



i created an agent that is meant to write out an article based on the some extracted information given to it
it would be given a title, and also a bulk of information regarding the title given
i want you to write an article.md file, that teaches the agent how to write a detailed and comprehensive article



i created an agent that is meant to write out an article
it would be given a title, and also a bulk of information regarding the title given
i want you to write an RESEARCH.md file, that teaches the agent how to search and write a detailed and comprehensive and effective article


update the function:
-after the job is done and completed, and article saved, it should update a @agents/researcher/workspace/[task_id]/task_state.json file as in:
{
    ...,
    process_states: {
        ...,
        article_generated: "completed" /*completed || failed*/
    }
}

create the function in @agents/researcher/functions/model_research.js
let me see your plan before starting











running a tasks
any time a task is given to this agent, it would be stored in @agents/[agent_name]/workspace/tasks/scheduled/[task_id].json (don't worry about this)
the agent gets to be aware of the new task that just got in (don't worry about this), 
when the conditions are right for the agent to begin work on the task, it moves that specific task to @agents/[agent_name]/workspace/tasks/ongoing/[task_id].json so the agent can begin work on it (don't worry about this)
there, the json task contains all the necessary information the agent neeed to run the task successfully 
so all the imput needed to run the function must be pulled from the inputs property, 
so when th

a typical task should look like this: 
[task_id].json
{
    task_id: id,

    await_approval: boolean,
    status: ongoing, // pending, completed, failed, scheduled/pending
    start_time: any,
    assigned_to: agent_name,
    created_at: data and time,
    description: description of task,
    title: title of task,
    max_attempt: 5,
    attempt: 0
    expected_output: "store post created in a place, otherwise report error",
    created_by: orchestrator,
    deadline,

    priority: high
    output,
    instructions: [],
    error: {},
    context: additional relevalt information
    dependencies: [task_id], // tasks that must be done first
    inputs: {
        ..necessary input to carry out this task by any function
    },
    ...others
}


the agent runs the necessary function on each task (as needed),


how to handle functions with a need for approval
-use json for memory in agent's workspace






create an api route /api/agent/test_task_runner
this api route checks the @agents/researcher/workspace/ directory. it looks for the task_state.json file contained in each folder inside the @agents/researcher/workspace/ directory. as in @agents/researcher/workspace/[any_folder]/task_state.json

it creates an array, and push in the content of all task_state.json data.

it loops through the array and calls the @agents/researcher/task_runner function on each of the array item (pass each item as prop)

this api route is simply just to test that task_runner function

after this
create a @test_runner.js file, using axios to call the /api/agent/test_task_runner api route. 

the task_runner function has already been created in @agents/researcher/task_runner.js simply import it, you don't need to create it again 

let me see your plan before starting







create a function in @agents/researcher/functions/task_creator.js
the purpose of this function is to be able to create assigned tasks for the researcher agent

it receives a prop called, assigned_task {prompt} (basically contains a prompt) that contain conext of information on what is needed to create the task 

the prompt is passed into an llm (using the model of the researcher Agent (in @agents/researcher/metadata.json[model]), and also reads the  @agents/researcher/system files), 
then it reads the @agents/researcher/metadata.json[task_state_prototype] to understand what an ideal task_state is, and should contain, 
this llm implements tool calling and calls the "task_func" function that receives the ideal object of a task_state, that looks exactly like the sample in the metadata.json

the metadata must always be read each time this code is ran, it must not be hardcoded. 

the ideal prototype of a task_state is always read from @agents/researcher/metadata.json[task_state_prototype], the llm must read the prompt given to it and return an object that looks exactly like task_state, containing all the unique specifics of this current task, and pass it directly into the task_func

the task_func recieves the task_state object prop and creates: 
a task_state.json file in @agents/researcher/workspace/[task_state.task_id]/task_state.json, the task_state.json contains exactly everything in the task_state prop passed to it (no changes)

ask me any question for clarity
show me you plan before starting






Tool calling to researcher agent
implement a tool calling feature in the @agents/researcher/researcher.js, the created @agents/researcher/functions/task_creator.js must be used in @agents/researcher/researcher.js agent as a callable tool so that the agent is given the ability to create a research task, so implement a tool calling feature in the @agents/researcher/researcher.js.

check @agents/researcher/functions/task_creator.js function on example on how to implement an ollama tool calling feature

the researcher agent must read the @agents/researcher/metadata.json[task_state_prototype] to know what must be contained in the prompt to be sent to the task_creator function, it should ask the user to clarify things if an information is not provided.

ask me any question for clarity
show me you plan before starting






orchestrator central task creator
create a function in @agents/orchestrator/functions/task_assigner.js
this function implements an llm (using the model of the orchestrator Agent (in @agents/orchestrator/metadata.json[model])), it receives a prop {prompt}, 
it reads this prompt, and loops through the @agents/[each_agents]/metadata.json and reads to know which agent is capable/qualified of carrying out this task, 
it check the task_state_prototype property of the qualified agent, and checks if the given prop ({propmt}) contains all the necessary context to build a task_state, if not, it returns a message  saying something like "prompt does not contain all the requirement to create this task, please create a prompt that has all i need to create the task"

if the prop ({propmt}) contains all needed to create a task, then, it calls the @agents/[qualified_agents]/functions/task_creator.js function found in the qualified agent (could be imported using "require(`.../${qualified_agent}/...`)), the task_creator function takes in a onject prop {prompt}, it passes the right prompt into the function. the prompt should be a string contain all the context needed to be contained in an ideal task_state prototype

if no suitable agent is found who can carry out the task, then, returns back a prompt string message containing all the agents available and what they can do.

ask me any question for clarity
show me you plan before starting




Tool calling to the orchestrator agent
implement a tool calling feature in the @agents/orchestrator/orchestrator.js agent, the created @agents/orchestrator/functions/task_assigner.js must be used in the orchestrator agent as a callable tool so it can assign task to any agent, 
it must be able to engage in a chat with the task_assigner function, to know if all the necessary information to create the task has been provided, if it has not yet been provided, it must ask the user to provide the necessary contexts.
Let all it's instruction be kept in @agents/orchestrator/system/TASK_ASSIGNER.md file so you don't really need to edit the current instruction

for example on how to implement tool calling, check @agents/researcher/researcher.js file

ask me any question for clarity
show me you plan before starting



write a function @agents/researcher/functions/task_cleanup.js that moves a complete task folder @agents/researcher/workspace/[any_given_task_folder_name]/ including all it's content into a new folder @agents/researher/finished/ 

ask me any question for clarity
show me you plan before starting






i gave my llm this prompt:

PROPMP STARTS



PROMPT ENDS

HERE IS THE CODE IT WROTE:


HERE IS THE CODE for the researcher.js file:

CODE STARTS


CODE ENDS

help me fix the code, it dosen't work




instead of using the task assigner approach (as in @agents/orchestrator/functions/task_assigner.js).
now i want you to use the direct wiring approach to the research @agents/researcher/functions/task_creator.js file
just as the task_creator is implemented in the @agent/researcher/researcher.js file as a called tool, implement the same in the orchestrator.js file and make sure it works fine

check the @agent/researcher/researcher.js as an example, ensure to not delete or edit it

let me see your plan before starting









now tasks can await approval
create an api route /api/agent/getApprovals this route searches through all agents @agents/[each_agent]/workspace/[each_task]/task_state.json

it reads to know if task_state[approval] is true, gets the task_state object, and returns a list of all tasks_states awaiting approval.

this tasks are to be listed on the front end in line 109 of the approval.js file
and also in line 181 in the modal for the mobile screen

ensure the mobile option selection is also functional in line 77

also read the task_state object of each awaiting task (at the front end), and clearly format it in line 155 of the approval.js url page file. ensure to format it in a very readable file, you can use a table or any mean, simply just format it in a great way

ensure this api is called each time this page is refreshed

from the task_state of the currently task, the user should be able to chat with the agent this task is assigned to in line 162 of the approval.js file, ensure to provide all the necessary information to make the user chat with the agent the task is assigned to

let me see your plan before starting
