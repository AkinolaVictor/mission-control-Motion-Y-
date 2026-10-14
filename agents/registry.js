const orchestrator = require("./orchestrator/metadata.json")
const motion_dev = require("./motion_dev/metadata.json")

export const agent_registry = [
    require("./orchestrator/metadata.json"),
    require("./motion_dev/metadata.json"),
]