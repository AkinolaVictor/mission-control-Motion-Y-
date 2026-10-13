const orchestrator_config = require('./orchestrator/metadata.json');
const motion_dev_config = require('./motion_dev/metadata.json');

export const agent_config = {
    "agents": [
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
