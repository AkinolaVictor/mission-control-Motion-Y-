i copied out the full chat components of a project (frontend section)
all the components to build out this chat section are stored in @sample_chat\
i want you to check through it all for better understanding
make sure to properly understand it very well





i want you to build out the complete chat architectural UI into this project
build the entire chat system in an separate folder inside the components\ folder
import the central chat window inside line 225 of the [agentSlug].js file 
where it would be displayed to screen, and interacted with
this is the chat component that allows the user to interact with each agent

just focus on the UI and basic interaction 
you don't need to build a highly polished and complete chat system
just focus on the heml, css, and any part of the js that help with the UI experience

before you start, do you have any question?
i insist that you let me see your plan before working it out






i already updated the files in the @simple_chat\ folder, read and understand it better

also, there are some errors i am geting in the task you just completed
1. Module not found: Can't resolve '../../utils/cn'
2. ./src/components/AgentChat/AgentChatWindow.jsx || Error: Global CSS cannot be imported from files other than your Custom <App>.
Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to pages/_app.js. Or convert the import to Component-Level CSS (CSS Modules).
Location: src/components/AgentChat/AgentChatWindow.jsx
Import path: ./AgentChat.css



when i click the button in line 297 of the [agentSlug].js file,
it should show a modal that contains the newly built chat window (the AgentChatWindow component)

this code keeps reporting a syntax error, can you fix it for me?



now everything works fine, i just need a few update for the mobile experience
when a user clicks on line 189 of the [agentSlug].js file, it should show a modal containing everything in the AgentList.jsx file
the user should be able to click on any of the available links, and navigate accordingly
also, the text in line






Creating a new Agent
-Frontend creation process:
when a user clicks on line 92 (create button) of the newAgent.js file, 
-it should validate the user data to ensure the name of this agent is unique (no name clash)
-make sure the name, model and the description in not left empty
-if all is clear, it should sent the data to the Backend for creation
-after the user sends the request, instead of having a loader that simply just spins throughout, 
replace it with a percentage progress (like: 36% done) bar that increases as the creation process progresses at the backend
-and under the progressing process percentage, write the current work being done at the back end.
Here's are examples:
- 10% completed \\n preparing agent workspace \\n creating folders and metadata
- 20% completed \\n creating system file \\n generating and creating IDENTITY.md file
- 34% completed \\n creating system file \\n generating and creating SOUL.md file
- 87% completed \\n updating agent system \\n adding new agent to config.js file


-Backend Creation Process:
to create an agent, create a /api/agent/create_agent API route
here are things that must be done
-a folder must be created in the @agents folder with the name of the agent, as in @agents/[name_of_agent]
-then 3 new folders, as in: 
  1. @agents/[name_of_agent]/functions
  2. @agents/[name_of_agent]/system
  3. @agents/[name_of_agent]/workspace
-then a file called metadata.json must also be created as in: @agents/[name_of_agent]/metadata.json
-the newly created metadata.json file should contain name, description, role, model properties of the agent as in:
  {
    name: "new_agent_name",
    description: "new agent description",
    role: "new agent role description",
    model: "llm_model_of_agent"
  }
-check the @agents/orchestrator/metadata.json file for clarity, updates on further changes
-every agent must have a unique name and id, no two (or more) agents should have the same name, every one must be unique
-then, based on the description of the agent provided by the user, all system files for this new agent must be generated and created in the @agents/[name_of_agent]/system folder as in:
 . @agents/[name_of_agent]/system/AGENTS.md
 . @agents/[name_of_agent]/system/IDENTITY.md
 . @agents/[name_of_agent]/system/SOUL.md
 . @agents/[name_of_agent]/system/MEMORY.md
 . @agents/[name_of_agent]/system/HEARTBEAT.md
 . @agents/[name_of_agent]/system/SECURITY.md
 . @agents/[name_of_agent]/system/TOOLS.md
-then, a chat function must be created for at @agents/[name_of_agent]/functions/[aagent_name_chat].js
-to create this chat function, the agent must be fed with all the files in the @agents/[name_of_agent]/system folder to help define who it is in each chat (ensure to check @agents/orchestrator/functions/orchestrator_chat.js)
-then you update the @agent/config.js file (to insert the new agent at the agents section)

let me see your plan before getting this done.

instead of hardcoding the content of each system file of a new agent, let it be generated by the orchestrator
write a function for the orchestrator in @agents/orchestrator/functions/generate_system_files.js to generate each of the system file, 
so instead of having a hard-coded template in line 66 of the create_agent.js api file, let it be a generated one by the orchestrator
let me see your plan before starting

TO BE DONE

in the @agent/config.js file, the orchestrator agent must always be at the top of the array, 
new agents coming should be added to the bottom of the array,
also please ensure that the creation progress update works fine and is updated also (in the frontend) at line 116 of the newAgent.js file
let me see your plan before starting




Also, instead of directly inputing into agent's metadata.json file the agent description the user inputted at the front end (don't do that),
instead, write a compressed 3-7 words that best describe the agent, and insert this compressed version into the description in metadata.json

everytime i create a new agent, the @agent/config.js file is always misformatted,
please ensure that the newly created agents object (with id) are correctly added as the last element in the "agents" array property of the @agent/config.js (javascript) file,

also ensure that the new agent's metadata.json file is correctly imported (and rightly written) into the top level of the @agent/config.js file,

make sure to run proper test that this is working fine

let me see your plan before starting


problem: unable to chat with new agents
update the create_agent api route to also allow the user to chat with new agents
after creating the chat function for the new agent, next ,
update the chat (/api/agent/chat) api route to be able to chat with new agent (import new chat function of new agents and let it work),
import the newly created chat function, and rewire the /api/agent/chat api route so that interactions are possible with new agent

let me see your plan before starting

instead lets do it this way, instead of having the path to the metadata.json of each agent in the registry.json file, write the raw data of the all metadata.json into the registry.json file, but make sure to delete all the metadata.json files, also don't forget to inform the creation process (create_agent api) to stop creating metadata.json files, but instead update the registry.json file directly.

also remember to update the @agens/config.js file simply import the registry.json file

let me see your plan before starting




here's the error i get: Module not found: Can't resolve './ROOT/agents' <dynamic> '/functions' <dynamic> '_chat.js'
./src/pages/api/agent

Error: Module not found: Can't resolve './ROOT/agents' <dynamic> '/functions' <dynamic> '_chat.js'
server relative imports are not implemented yet. Please try an import relative to the file you are importing from.

https://nextjs.org/docs/messages/module-not-found






delete agent
keep in mind that this is only to make sure the agent is successfully deleted
when a user clicks on line 537 of the [agentSlug].js file, it should delete the agent from the system

#frontend process
-after the agent has been successfully deleted, the user should be routed back to the /agents url page

#backend process
create a /api/agent/delete_agent api route to handle this operation
-the files of the agent should be deleted (delete the @agents/[agent_name] folder and all in it)

-update the @agents/registry.js file (remove the deleted agent from the agent_registry array)
-update the agent_mappings file to remove the agent chat import and its implementation in the agentMappings object. (since the agent is deleted, the chat route should also be updated)
-delete the @agent_memory/chat/[agent_name] folder, so there is no chat history of that agent (be sure to first check if the folder exist before deleting)

show me your plan before starting
io




instead of using the @agents/registry.json approach, lets use a registry.js file approach

when creating a new agent, after creating all the folders, and system files, in the @agents/[agent_name] folder
create a metadata.json file at the @agents/[agent_name], and populate it with the necessary data {name, description, role, model, id, date_and_time}

make sure the description is not hard coded, 
let the orchestrator agent rewrite a summarized description of the agent (not more than 7 words in total) based on the description written by the user at the frontend, use the transformed description in the metadata.json file

after all this is done, update the registry.js file: simply insert (push) require("./[agent_name]/metadata.json") into the agent_registry array

then update the agent chat api route (already working, no need to change)

i already created and implemented a registry.js file and implemented in in the config.js file
i want you to learn from it, and follow the pattern already created

show me your plan before starting






