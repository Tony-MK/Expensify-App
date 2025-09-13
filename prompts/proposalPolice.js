"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("@github/libs/CONST");
var PROPOSAL_POLICE_TEMPLATES = {
    getPromptForNewProposalTemplateCheck: function (commentBody) {
        return "I NEED HELP WITH CASE (1.), CHECK IF COMMENT IS PROPOSAL AND IF TEMPLATE IS FOLLOWED AS PER INSTRUCTIONS. IT IS MANDATORY THAT YOU RESPOND ONLY WITH \"".concat(CONST_1.default.NO_ACTION, "\" IN CASE THE COMMENT IS NOT A PROPOSAL. Comment content: ").concat(commentBody);
    },
    getPromptForNewProposalDuplicateCheck: function (newProposalBody, existingProposal) {
        return "I NEED HELP WITH CASE (3.) [INSTRUCTIONS SECTION: IX. DUPLICATE PROPOSAL DETECTION], COMPARE THE FOLLOWING TWO PROPOSALS AND RETURN A SIMILARITY PERCENTAGE (0-100) REPRESENTING HOW SIMILAR THESE TWO PROPOSALS ARE IN THOSE SECTIONS AS PER THE INSTRUCTIONS. \n\nProposal 1:\n".concat(existingProposal, "\n\nProposal 2:\n").concat(newProposalBody);
    },
    getPromptForEditedProposal: function (previousBody, editedBody) {
        return "I NEED HELP WITH CASE (2.) WHEN A USER THAT POSTED AN INITIAL PROPOSAL OR COMMENT (UNEDITED) THEN EDITS THE COMMENT - WE NEED TO CLASSIFY THE COMMENT BASED IN THE GIVEN INSTRUCTIONS AND IF TEMPLATE IS FOLLOWED AS PER INSTRUCTIONS. IT IS MANDATORY THAT YOU RESPOND ONLY WITH \"".concat(CONST_1.default.NO_ACTION, "\" IN CASE THE COMMENT IS NOT A PROPOSAL. \n\nPrevious comment content: ").concat(previousBody, ".\n\nEdited comment content: ").concat(editedBody);
    },
    getDuplicateCheckWithdrawMessage: function () {
        return '#### 🚫 Duplicated proposal withdrawn by 🤖 ProposalPolice.';
    },
    getDuplicateCheckNoticeMessage: function (proposalAuthor, originalProposalURL) {
        var existingProposalWithURL = originalProposalURL ? "[existing proposal](".concat(originalProposalURL, ")") : 'existing proposal';
        return "\u26A0\uFE0F @".concat(proposalAuthor, " Your proposal is a duplicate of an already ").concat(existingProposalWithURL, " and has been automatically withdrawn to prevent spam. Please review the existing proposals before submitting a new one.");
    },
};
exports.default = PROPOSAL_POLICE_TEMPLATES;
