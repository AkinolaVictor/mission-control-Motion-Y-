const report_scrapper_config = require('./report_scrapper/metadata.json');
const live_scores_config = require('./live_scores/metadata.json');
const orchestrator_config = require('./orchestrator/metadata.json');
const motion_dev_config = require('./motion_dev/metadata.json');
const technical_writter_config = require('./technical_writter/metadata.json');


export const agent_config = {
    "agents": [
        {
            ...orchestrator_config,
            "id": "orchestrator"
        },
        {
            ...technical_writter_config,
            "id": "technical_writter"
        },
        {
            ...motion_dev_config,
            "id": "motion_dev"
        },
        {
            ...report_scrapper_config,
            "id": "report_scrapper"
        },
        {
            ...live_scores_config,
            "id": "live_scores"
        },
    ]
};