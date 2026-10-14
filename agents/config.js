const orchestrator_config = require('./orchestrator/metadata.json');
const motion_dev_config = require('./motion_dev/metadata.json');
const technical_writter_config = require('./technical_writter/metadata.json');


export const agent_config = {
    "agents": [
        {
            ...technical_writter_config,
            "id": "technical_writter"
        },
        {
            ...orchestrator_config,
            "id": "orchestrator"
        },
        {
            ...motion_dev_config,
            "id": "motion_dev"
        }
    ]
};
