"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const run = function () {
    return GithubUtils_1.default.getStagingDeployCash()
        .then(({ labels, number }) => {
        const labelsNames = labels.map((label) => {
            if (typeof label === 'string') {
                return '';
            }
            return label.name;
        });
        console.log(`Found StagingDeployCash with labels: ${JSON.stringify(labelsNames)}`);
        core.setOutput('IS_LOCKED', labelsNames.includes('🔐 LockCashDeploys 🔐'));
        core.setOutput('NUMBER', number);
    })
        .catch((err) => {
        console.warn('No open StagingDeployCash found, continuing...', err);
        core.setOutput('IS_LOCKED', false);
        core.setOutput('NUMBER', 0);
    });
};
if (require.main === module) {
    run();
}
exports.default = run;
