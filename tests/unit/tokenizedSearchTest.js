"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokenizedSearch_1 = require("@libs/tokenizedSearch");
describe('tokenizedSearch', () => {
    it('WorkspaceMembersSelectionList & WorkspaceWorkflowsPayerPage & WorkspaceWorkflowsApprovalsApproverPage & WorkspaceWorkflowsApprovalsExpensesFromPage', () => {
        const tokenizeSearch = 'One Three';
        const items = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
            {
                alternateText: 'example2@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example2@test.com',
                login: 'example2@test.com',
                text: 'Example Test',
            },
        ];
        const searchResultList = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
        ];
        const tokenizeSearchResult = (0, tokenizedSearch_1.default)(items, tokenizeSearch, (option) => [option.text ?? '', option.login ?? '']);
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
    it('InviteReportParticipantsPage', () => {
        const tokenizeSearch = 'One Three';
        const items = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
            {
                alternateText: 'example2@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example2@test.com',
                login: 'example2@test.com',
                text: 'Example Test',
            },
        ];
        const searchResultList = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
        ];
        const tokenizeSearchResult = (0, tokenizedSearch_1.default)(items, tokenizeSearch, (option) => [option.text ?? '', option.login ?? '']);
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
    it('WorkspaceCompanyCardAccountSelectCardPage', () => {
        const tokenizeSearch = 'One Three';
        const items = [
            {
                brickRoadIndicator: undefined,
                icons: [],
                isBold: false,
                isPolicyAdmin: true,
                isSelected: false,
                keyForList: '390A7184965D8FAE',
                policyID: '390A7184965D8FAE',
                text: "One Two Three's Workspace",
            },
            {
                brickRoadIndicator: undefined,
                icons: [],
                isBold: false,
                isPolicyAdmin: true,
                isSelected: false,
                keyForList: '8AFC0DA9A57EF975',
                policyID: '8AFC0DA9A57EF975',
                text: "Test's Workspace",
            },
        ];
        const searchResultList = [
            {
                brickRoadIndicator: undefined,
                icons: [],
                isBold: false,
                isPolicyAdmin: true,
                isSelected: false,
                keyForList: '390A7184965D8FAE',
                policyID: '390A7184965D8FAE',
                text: "One Two Three's Workspace",
            },
        ];
        const tokenizeSearchResult = (0, tokenizedSearch_1.default)(items, tokenizeSearch, (option) => [option.text ?? '']);
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
    it('expensifyCard/issueNew/AssigneeStep', () => {
        const tokenizeSearch = 'One Three';
        const items = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
            {
                alternateText: 'example2@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example2@test.com',
                login: 'example2@test.com',
                text: 'Example Test',
            },
        ];
        const searchResultList = [
            {
                alternateText: 'example@test.com',
                icons: [],
                isSelected: false,
                keyForList: 'example@test.com',
                login: 'example@test.com',
                text: 'One Two Three',
            },
        ];
        const tokenizeSearchResult = (0, tokenizedSearch_1.default)(items, tokenizeSearch, (option) => [option.text ?? '', option.alternateText ?? '']);
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
    });
});
