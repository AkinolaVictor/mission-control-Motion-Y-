this is the home page of the mission control: "/local_uploads/SPRK_default_preset_name_custom.png"
the task component in isolation: "/local_uploads/Group 105.png"

make sure to iterate over this image until you understand them well enough that you can be identical in your build

start with the home page now

ask me any question if necessary
let me see your plan before starting
let's go


good, make sure to write out the design principle out into a design.md file at the root folder for consistency
also any other design principles and guidelines you learn must be written in that file for consistency
do that first, after that is done, let me know
go ahead


this is the image sample for the tasks component: /local_uploads/tasks.png
i want it to be exactly identical, no difference

i have manually updated the tasks component to my taste.
now study it and learn the design principles and update yours
dont edit the design, only learn
you can implement the new color in css

with your new knowledge, 

this is the image for the agents component: /local_uploads/agents.png
i want you to view it and rebuild accordingly

let's build /ideas page
when i click on the idea button on the home page, it should open the /idea page
here's the ui for the idea page for that: @\local_uploads\home_ideas.png
make sure to preserve the header, and the three buttons (activities, ideas, and News) just like its in the photo described
make it look just like in the photo
i want it to look exactly the same as it appears in the picture
if you need more clarity, ask me


setup these route
the /ideas route, when i click on the ideas icon on the home page, it should take me to the /ideas page
the /news route, when i click on the news icon on the home page, it should take me to the /news page
you don't need to build out this new pages in full details. only make sure they exist and are setup.


I want to create something quite similar to openclaw, and i need your help





I want to create a openclaw new agent
His name is orchestrator, his is the orchestrator for my Motion-Y company mission control system
His role is to:
1. Be the central agent coordinating and monitor other agents, tasks and workflows
2. Be the go to agent to ask questions from on basic and some specialized things
3. Write any code where necessary
4. Receive instructions from me, the entire motion-y team (and sometimes from other agents) for upgrades and new features
5. Make any research where necessary
6. make some decisions
7. manage resources
8. quality control
9. communicate with other agents

Here is the working principles
1. Write codes in JavaScript by itself or other agents
2. Coordinate all agents through a unified workflow
3. Give agents concise, specific instructions. Communicate only relevant context and information
4. Minimize unnecessary agent calls, repeated work, excessive communication, and resource consumption.
5. Learn from recurring failures, bottlenecks, and feedback. Recommend improvements to workflows and coordination strategies.
6. Prioritize Motion-Y's overall objectives over individual agents' preferences or isolated task goals.

If there is any other questions you need clarity about, i'm open to your questions

I want you to write the identity, soul, memory, agents, heartbeat, bootstrap, tools.md files

Make sure each file created is to the point, clear and concise, not too long

I want you to build it one after the other, let's start with the identity.md file
What do you need





lets begin to build the backend system for this project
all agents live in the @agents\ folder (already created)
each agent should have a system\ folder containing some crucial system files, 
a @wokspace\ folder to help organize their workspace
a functions\ folder to contain agent's abilities

i want you to build an orchestrator_chat.js file inside the @agents/orchestrator/functions/ folder to help chat with the orchestrator at the front end
each agent would also have their separate agentname_chat.js file so we could easily chat with them

the main reason for this is so we can have a @src/pages/api/agent/chat api route that helps us chat with all agents, instead of having hundreds of agent chat route
the payload would be sent from the frontend containing agent to chat with, model, messages, and more
the @src/pages/api/agent/chat route would contain all agents chat functions imported into it, so based on the payload received, it is able to decide which of the imported agent chat functions to use.

How to build the orchestrator_chat file.
-it should use all the files in the @/agents/orchestrator/system/ folder directly in the system prompt given to ollama to interact with the model
-it must always use all the files in the @/agents/orchestrator/system/ folder. imported (more files will still be added, so each time the function is called, it must always read all files in the @/agents/orchestrator/system/ folder to build it's system prompt)
-make sure to write the system rules before importing the files in @/agents/orchestrator/system/ folder

don't delete any file in this codebase
don't create any file outside the root directory of this codebase

what else do you need to do this, ask me so i can respond,
i want to see your plan before you write any code



List available agents
since all the agents would be stored directly in the @agents/ folder (which is at the root directory), 

i want to be able to list all available agents on the screen

loop through the @agents/ folder to get all availbale agents (which is the name of each folder directly in the @agents folder), and store them in the @agents/config.js file, store them in the "agents" array inside the @agents/config.js file, the orchestrator agent would always be the first, others would come after (store each agent as an object in the array, each object should contain necessary information about the agent)

let it be displayed in the AgentList.jsx component by reading the @agents/config.js file (through an API route /api/agents/getAgents) and showing all the agents available in the agents section

the AgentList.jsx component should always read the agents section in the @agents/config.js file each time the page is refreshed. it should read the list through a /api/agents/getAgents route

let me see your plan first before you do any work





Agent interactivity
since there'll be a lot of agents.
user should be able to chat with each agents separately, when a user clicks on a particular agent in the AgentList, the agents info should be interacted with in the [agentSlug].js file.
The AgentChatWindow.jsx is a dynamic component that helps to chat with different agents, it is not built hardcoded for one particular agent, it receives props on the details of the agent it is connected to per render.
so since the [agentSlug].js is a dynamic route, it should be able to provide all the necessary information of the existing (currently clicked/selected) agent that would allow the user to effectively chat with it.
use the redux state where necessary, use the react usestate where necessary, ensure consistency and efficiency
i want to see your plan before starting



Updates to the Agent Chat system
DO NOT EDIT THE DESIGN SYSTEM (CSS/TAILWIND), I LIKE HOW IT LOOKS
-on the header, instead of the hardcoded "AI Agent", let it always show the name of the agent being chatted with (receive the name of the agent as a prop, to ensure the chat system is dynamic)

let the chat history be functional so that a user can continue existing chats, and start a new chat
store each chat in the @agent_memory/chats/agent_name/chat_1_date_and_time.txt file
and ensure to always update each file for further chat sessions

a user should be able to preview the list of all chat history per agent, select anyone to continue a chat.
the agent should read the chat txt file, and return it as an array of chat data that can be passed into the LLM for chat continuity

there should be no unified chat history for all agents, each agent has it's own (list of chat history)
let me see your plan before starting

there should be an icon on each chat that allows us to delete a specific chat history

Updates to the Agent Chat system
also when i begin in an empty chat, it should show my starting message directly, i don't have to click on the default mesage to start a conversation. once i enter my starting message in the input field, it should automatically work
let me see your plan before starting

<!-- each time an agent is opened, it should always show the last  -->


when a user clicks the chat history, they should see all the previous chats with that particular agent listed in the chat history section. Don't read the items from a locastorage.get, read it from the agent chat history files through /api/agent/gethistory api route and let it be displayed in the chatHistory.jsx file,

user should be able to click on any listed history chat and continue the chat with the agent

each time a new chat history is to be saved, i notices that the /api/agent/savehistory route is called twice, and because of this, every new chat is saved twice, so instead of having a single history file for that chat, we have two, meanwhile, only one of the two initiallized files gets the updates on the chat. fix this so that only one files is created and also updated

what is the problem causing this
let me see your plan for fixing it

now i want you to save all chat history as a json file, instead of a txt file.
the json file should contain all the necessary information
-title of chat (brief/short description of the chat)
-time of chat initialization
-messages (content of the chat)
-agent
-any other necessary information

delete all currently existing .txt file, so new upcoming history can be saved as [chat_id_time_date].json
make sure to update the logic in the savehistory and gethistory api route (since the we're switching from .txt to .json file)

when a user clicks the delete icon in the chat history, it should delete the json file of that chat history
create a /api/agent/deletehistory api route to handle the delete logic, and wire it to the delete icon in the chathistory so the exact history to be deleted is the only one deleted
also remember to update the chat history list in the front end (on success). if the chathistory to be deleted is the one in focus (currently opened by the user), automatically open a new chat for them to start again



i noticed that when the user switches from one agent to another, the chat being held with the previous agent is being displayed in the new agent (only the agent name changes on the header). i don't like this behaviour
whenever user switch agent or open any agen, it should instead seaarch the agent chat history, and show the most recent chat in the agent's chat history so they could continue chatting




just like the orchestrator has it's own chat function in @agents/orchestrator/functions/orchestrator_chat.js create a chat function for the motion_dev agent to help chat with it at @agents/motion_dev/functions/motion_dev_chat.js

learn from the @agents/orchestrator/functions/orchestrator_chat.js to know how to create the @agents/motion_dev/functions/motion_dev_chat.js file

let it be accessible at the /api/agent/chat API route, so it can be chatted with through the API route

i want you to show me your plan before starting


in the @agents/config.js file, instead of hardcoding the agent detail inside the agents array.
i want you to import the metadata.json for each agent and simply just insert it into the agents array

for example:
const orchestrator_config = require(path to config file)
const motion_dev_config = require(path to config file)

then you insert it into the agents array
{
    ...,
    agents: [
        orchestrator_config,
        motion_dev_config
    ],
    ...
}
i believe it would be much easier to maintain and manage
i want you to show me your plan before starting



instead of using this agent_memory/chats/[agent_id]/[chat_id]_[timestamp].txt, i want you to use agent_memory/chats/[agent_name]/[chat_id]_[timestamp].txt

each time i enter a message or the agent replys in the chat, i want line 141 in AgentChatWindow.jsx to autoscroll
Autoscroll behaviour:
it should simply auto scroll the new message to view, it should not over scroll the top (starting texts) out of view, if the message is too long, it should only scroll part of it to view, the user will scroll in the rest manually, but if the message can fit in the screen completely, let it scroll all to view


the chat history is not working
i want you to update each chat history per messages sent in each chat so it cann totally be in sync
for every message sent by the user and responded by the agent, the agent chat history must be updated
show me your plan first

i want you to use axios instead of fetch for all API calls,
inspect all the api calls to the history route, ans ensure the right route is passed in
each time the /api/agent/history route is called, i keep getting a 400 error showing the agent name is not passed. or some payload is missiong
check through and fix this so the history route can work properly


instead of having one single route /api/agent/history that handles both get and post
lets have two route
1. /api/agent/gethistory route to get saved history chats (both single and all history)
2. /api/agent/savehistory route to update the history and keep each history in sync with its chat
also don't forget to update this logic at the AgentChatWIndow.jsx





Create agents
when a user clicks on the "New Agent" button in line 131 of the HomeNav.jsx component,
it should take them to a new /agents/createagent url page

the page should enable them to select a model (drop down) exactly like in line 241 of [agentSlug].jsx
the default model should always be gemma4:31b-cloud
there should be a textfield where they can expressly talk about the new agent they want to create
and a "Create" button to submit
for now, let's focus on the UI (HTML AND CSS) alone

(Create the UI to accomodate these)

when the Create button is clicked, to submit (ensure to validate the input)

when a user clicks the button in line 25 of newAgent.js file,
it should show a modal containing all the list of ollama models like in line 241 of [agentSlug].js
when a model is selected, it should be displayed in line 36 of newAgent.js
ensure consistency of design
study [agentSlug].js for better understanding,
let me see your plan before starting

















set a new property in the metadata.json file (called model: gemma4:31b-cloud)
every agent should have a default model to interact with.
every section of the code that require a model to interact with the agent must first read the agent's metadata.json file, to get the model to be used for the current interaction. NO HARD CODED MODEL
i want you to search through the codebase to let me know all the files that are concerned about this new changes
let me see your plan first before working



when a user clicks the line 143 in [agentSlug].js, it should show a modal of all available models in ollama (both local and cloud). a user should be able to select a model from the list to set it as the default model of the currently selected agent (model: newly_selected_model).
let this be done through an api route /api/agent/update_agent this route would be responsible for implementing any updates being made to the agent:
-change model,
-update system files (identity, soul, user, heartbeat, etc...)
-and MANY MANY more to come
also don't forget to update it on the frontend when a new model is selected and the metadata.json file of the agent has been updated,

keep in mind that the models available in ollama must not be static or hardcoded into the system.
each time the user clicks that specified button, it must always fetch and show all updated models on ollama,
do you understand me now?


When a user clicks on line 197 of [agentSlug].js it should show a list of all files in the @agents/[current_agent_name]/system in a modal
user should be able to click on any of them to preview and possibly edit them
any file clicked upon shold be shown in the line 213 of [agentSlug].js file.

when a user clicks on line 207 (the edit icon), 
-the texts in line 213 should be edittable
-the button in line 216 should be toggled (revealed/hidden)
-the icon inside line 207 should toggle edit/x icon

when the user is done editting the currently selected system file,
they should save the changes to the actual agent system file (@agents/[current_agent_name]/system/[FILE].md) by clicking on line 216 (update)

after the file has been updated,
- the text in line 213 should be view only (not edditable)
- the button in line 216 should be toggled back to hidden
- the icon in line 207 should toggle back from X to edit icon

instead of using the /api/agent/update_agent api route, create a new /api/agent/update_agent_system api route to handle this operation
ensure to read through and understand well
let me see your plan before starting

everything worked fine, but whenever i try to save the changes made to any file, i get this error: Failed to save system file.
fix it

instead of having a single api route /api/agent/update_agent_system, let us have 2
1. /api/agent/get_agent_system to only read any (selected) agent system file
2. /api/agent/edit_agent_system to update any (selected) agent system file

make sure to update any frontend files that are tied to the /api/agent/update_agent_system route based on the new logic


