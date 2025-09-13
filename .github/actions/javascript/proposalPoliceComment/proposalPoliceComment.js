"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const core = require("@actions/core");
const github_1 = require("@actions/github");
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const ActionUtils_1 = require("@github/libs/ActionUtils");
const CONST_1 = require("@github/libs/CONST");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const proposalPolice_1 = require("@prompts/proposalPolice");
const OpenAIUtils_1 = require("@scripts/utils/OpenAIUtils");
function isCommentCreatedEvent(payload) {
    return payload.action === CONST_1.default.ACTIONS.CREATED;
}
function isCommentEditedEvent(payload) {
    return payload.action === CONST_1.default.ACTIONS.EDITED;
}
// Main function to process the workflow event
async function run() {
    // Capture the timestamp immediately at the start of the run
    const now = Date.now();
    const zonedDate = (0, date_fns_tz_1.toZonedTime)(now, 'UTC');
    const formattedDate = (0, date_fns_1.format)(zonedDate, "yyyy-MM-dd HH:mm:ss 'UTC'");
    // Verify this is running for an expected webhook event
    if (github_1.context.eventName !== CONST_1.default.EVENTS.ISSUE_COMMENT) {
        throw new Error('ProposalPolice™ only supports the issue_comment webhook event');
    }
    const payload = github_1.context.payload;
    // Return early unless issue is open AND has the "Help Wanted" label
    if (payload.issue?.state !== CONST_1.default.STATE.OPEN || !payload.issue?.labels.some((issueLabel) => issueLabel.name === CONST_1.default.LABELS.HELP_WANTED)) {
        console.log('Issue is not open or does not have the "Help Wanted" label, skipping checks.');
        return;
    }
    // Verify that the comment is not empty and contains the case sensitive `Proposal` keyword
    if (!payload.comment?.body.trim() || !payload.comment?.body.includes(CONST_1.default.PROPOSAL_KEYWORD)) {
        console.log('Comment body is either empty or doesn\'t contain the keyword "Proposal": ', payload.comment?.body);
        return;
    }
    // If event is `edited` and comment was already edited by the bot, return early
    if (isCommentEditedEvent(payload) && payload.comment?.body.trim().includes('Edited by **proposal-police**')) {
        console.log('Comment was already edited by proposal-police once.\n', payload.comment?.body);
        return;
    }
    console.log('ProposalPolice™ Action triggered for comment:', payload.comment?.body);
    console.log('-> GitHub Action Type: ', payload.action?.toUpperCase());
    if (!isCommentCreatedEvent(payload) && !isCommentEditedEvent(payload)) {
        console.error('Unsupported action type:', payload?.action);
        (0, core_1.setFailed)(new Error(`Unsupported action type ${payload?.action}`));
        return;
    }
    const apiKey = (0, core_1.getInput)('PROPOSAL_POLICE_API_KEY', { required: true });
    const assistantID = (0, core_1.getInput)('PROPOSAL_POLICE_ASSISTANT_ID', { required: true });
    const openAI = new OpenAIUtils_1.default(apiKey);
    /* eslint-disable rulesdir/no-default-id-values */
    const issueNumber = payload.issue?.number ?? -1;
    /* eslint-disable rulesdir/no-default-id-values */
    const commentID = payload.comment?.id ?? -1;
    // DUPLICATE PROPOSAL DETECTION
    if (isCommentCreatedEvent(payload)) {
        console.log('Starting DUPLICATE PROPOSAL DETECTION Check');
        const newProposalCreatedAt = new Date(payload.comment.created_at).getTime();
        const newProposalBody = payload.comment.body;
        const newProposalAuthor = payload.comment.user.login;
        // Fetch all comments in the issue
        console.log('Get comments for issue #', issueNumber);
        const commentsResponse = await GithubUtils_1.default.getAllCommentDetails(issueNumber);
        core.startGroup('Comments Response');
        console.log('commentsResponse', commentsResponse);
        core.endGroup();
        let didFindDuplicate = false;
        let originalProposal;
        for (const previousProposal of commentsResponse) {
            const isProposal = !!previousProposal.body?.includes(CONST_1.default.PROPOSAL_KEYWORD);
            const previousProposalCreatedAt = new Date(previousProposal.created_at).getTime();
            // Early continue if not a proposal or previous comment is newer than current one
            if (!isProposal || previousProposalCreatedAt >= newProposalCreatedAt) {
                continue;
            }
            const isAuthorBot = previousProposal.user?.login === CONST_1.default.COMMENT.NAME_GITHUB_ACTIONS || previousProposal.user?.type === CONST_1.default.COMMENT.TYPE_BOT;
            // Skip prompting if comment author is the GH bot
            if (isAuthorBot) {
                continue;
            }
            const duplicateCheckPrompt = proposalPolice_1.default.getPromptForNewProposalDuplicateCheck(previousProposal.body, newProposalBody);
            const duplicateCheckResponse = await openAI.promptAssistant(assistantID, duplicateCheckPrompt);
            let similarityPercentage = 0;
            const parsedDuplicateCheckResponse = openAI.parseAssistantResponse(duplicateCheckResponse);
            core.startGroup('Parsed Duplicate Check Response');
            console.log('parsedDuplicateCheckResponse: ', parsedDuplicateCheckResponse);
            core.endGroup();
            if (parsedDuplicateCheckResponse) {
                const { similarity = 0 } = parsedDuplicateCheckResponse ?? {};
                similarityPercentage = (0, ActionUtils_1.convertToNumber)(similarity);
                if (similarityPercentage >= 90) {
                    console.log(`Found duplicate with ${similarityPercentage}% similarity.`);
                    didFindDuplicate = true;
                    originalProposal = previousProposal;
                    break;
                }
            }
        }
        if (didFindDuplicate) {
            const duplicateCheckWithdrawMessage = proposalPolice_1.default.getDuplicateCheckWithdrawMessage();
            const duplicateCheckNoticeMessage = proposalPolice_1.default.getDuplicateCheckNoticeMessage(newProposalAuthor, originalProposal?.html_url);
            // If a duplicate proposal is detected, update the comment to withdraw it
            console.log('ProposalPolice™ withdrawing duplicated proposal...');
            await GithubUtils_1.default.octokit.issues.updateComment({
                ...github_1.context.repo,
                /* eslint-disable @typescript-eslint/naming-convention */
                comment_id: commentID,
                body: duplicateCheckWithdrawMessage,
            });
            // Post a comment to notify the user about the withdrawn duplicated proposal
            console.log('ProposalPolice™ notifying contributor of withdrawn proposal...');
            await GithubUtils_1.default.createComment(CONST_1.default.APP_REPO, issueNumber, duplicateCheckNoticeMessage);
            console.log('DUPLICATE PROPOSAL DETECTION Check Completed, returning early.');
            return;
        }
    }
    const prompt = isCommentCreatedEvent(payload)
        ? proposalPolice_1.default.getPromptForNewProposalTemplateCheck(payload.comment?.body)
        : proposalPolice_1.default.getPromptForEditedProposal(payload.changes.body?.from, payload.comment?.body);
    const assistantResponse = await openAI.promptAssistant(assistantID, prompt);
    const parsedAssistantResponse = openAI.parseAssistantResponse(assistantResponse);
    core.startGroup('Parsed Assistant Response');
    console.log('parsedAssistantResponse: ', parsedAssistantResponse);
    core.endGroup();
    // fallback to empty strings to avoid crashing in case parsing fails
    const { action = '', message = '' } = parsedAssistantResponse ?? {};
    const isNoAction = action.trim() === CONST_1.default.NO_ACTION;
    const isActionEdit = action.trim() === CONST_1.default.ACTION_EDIT;
    const isActionRequired = action.trim() === CONST_1.default.ACTION_REQUIRED;
    // If assistant response is NO_ACTION and there's no message, return early
    if (isNoAction && !message) {
        console.log('Detected NO_ACTION for comment, returning early.');
        return;
    }
    if (isCommentCreatedEvent(payload) && isActionRequired) {
        const formattedResponse = message
            // replace {user} from response template with @username
            .replaceAll('{user}', `@${payload.comment?.user.login}`);
        // Create a comment with the assistant's response
        console.log('ProposalPolice™ commenting on issue...');
        await GithubUtils_1.default.createComment(CONST_1.default.APP_REPO, issueNumber, formattedResponse);
        // edit comment if assistant detected substantial changes
    }
    else if (isActionEdit) {
        const formattedResponse = message.replace('{updated_timestamp}', formattedDate);
        console.log('ProposalPolice™ editing issue comment...', commentID);
        await GithubUtils_1.default.octokit.issues.updateComment({
            ...github_1.context.repo,
            /* eslint-disable @typescript-eslint/naming-convention */
            comment_id: commentID,
            body: `${formattedResponse}\n\n${payload.comment?.body}`,
        });
    }
}
run().catch((error) => {
    console.error(error);
    // Zero status ensures that the action is marked as successful regardless the outcome
    // which means that no failure notification is sent to issue's subscribers
    process.exit(0);
});
