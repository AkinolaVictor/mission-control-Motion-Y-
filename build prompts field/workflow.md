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
-this would create all the necessary function(s) needed for this agent to work fine at the @agents/[agent_name]/functions folder. ensure all functions are stored there
-at the top level of each function. write the information on function purpose, how to use it, and the data types necessary.
-after functions are created, check through the system files in the @agents/[agent_name]/system and update any necessary file to help the agent know how to call and use these functions where necessary (especially the TOOLS.md file, but basically any file that needs to be updated)
-after all these is done, update the metadata.json file of the agent, the setup:true, also add a property of functions as in:
{
    ...,
    setup: true,
    functions: {
        name_of_function: {
            parameters: [params1, params2, params3, etc],
            description,
            purpose: "why the function exists",
            ...any other necessary information
        },
        ...the other functions
    }
}

How to build the /api/agent/agent_ability_setup api route
-instead of having a long monolithic code doing all things at once, i want you to modularize the route into units of functions
-create the modules (components functions) in a  @src/pages/api/agent/agent_ability_setup_modules/ folder
-this folder should contain agent_function_builder.js (majorly for building all types of functions for agents), and also any other necessary modularized components. all theses modules must be imported into the @src/pages/api/agent/agent_ability_setup.js file
-i would give you further functions on how to make this agent builder more effective

don't worry about when the functions would be run by an agent, simply focus on creating the functions, teaching the agent to use it, the necessary data for the function to run











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
    title: title of task,
    description: description of task,
    created_at: data and time,
    created_by: orchestrator,
    max_attempt: 2,
    expected_output: "store post created in a place, otherwise report error",
    output,
    priority: high
    deadline,
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












