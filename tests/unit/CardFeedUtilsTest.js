"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var CardFeedUtils_1 = require("@libs/CardFeedUtils");
var Localize_1 = require("@libs/Localize");
var CONST_1 = require("@src/CONST");
var IntlStore_1 = require("@src/languages/IntlStore");
var waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
var fakeWorkspace = {
    'cards_11111111_Expensify Card': {
        '11111111': {
            accountID: 11111111,
            lastUpdated: '2024-11-29',
            bank: 'Expensify Card',
            cardID: 11111111,
            cardName: '111111XXXXXX1111',
            domainName: 'expensify-policy1234567891011121.exfy',
            fraud: 'none',
            fundID: '11111111',
            lastFourPAN: '1234',
            lastScrape: '',
            lastScrapeResult: 200,
            scrapeMinDate: '',
            state: 3,
        },
        '22222222': {
            accountID: 22222222,
            lastUpdated: '2024-11-29',
            bank: 'Expensify Card',
            cardID: 22222222,
            cardName: '222222XXXXXX2222',
            domainName: 'expensify-policy1234567891011121.exfy',
            fraud: 'none',
            fundID: '11111111',
            lastFourPAN: '5678',
            lastScrape: '',
            lastScrapeResult: 200,
            scrapeMinDate: '',
            state: 3,
        },
    },
    'cards_22222222_Expensify Card': {
        '33333333': {
            accountID: 33333333,
            lastUpdated: '2024-11-29',
            bank: 'Expensify Card',
            cardID: 33333333,
            cardName: '333333XXXXXX3333',
            domainName: 'expensify-policy1234567891011121.exfy',
            fraud: 'none',
            fundID: '22222222',
            lastFourPAN: '9101',
            lastScrape: '',
            lastScrapeResult: 200,
            scrapeMinDate: '',
            state: 3,
        },
    },
};
var cardListMock = {
    '11223344': {
        state: 1,
        bank: 'vcf',
        fundID: '5555',
        lastFourPAN: '1234',
    },
    '10203040': {
        state: 1,
        bank: CONST_1.default.EXPENSIFY_CARD.BANK,
        fundID: '5555',
        lastFourPAN: '1234',
    },
};
var cardFeedAmericaExpressMock = 'oauth.americanexpressfdx.com 1001';
var cardFeedVisaMock = 'vcf';
var cardFeedCitiBankMock = 'oauth.citibank.com';
var cardFeedStripeMock = 'stripe';
var cardFeedsMock = {
    sharedNVP_private_domain_member_1234: {
        settings: {
            companyCardNicknames: (_a = {},
                _a[cardFeedVisaMock] = 'Custom feed name',
                _a),
            companyCards: (_b = {},
                _b[cardFeedAmericaExpressMock] = {},
                _b[cardFeedVisaMock] = { preferredPolicy: 'AA1BB2CC3' },
                _b[cardFeedCitiBankMock] = { preferredPolicy: 'AA1BB2CC3' },
                _b[cardFeedStripeMock] = { preferredPolicy: 'XX1YY2ZZ3' },
                _b),
        },
    },
};
describe('Card Feed Utils', function () {
    beforeAll(function () {
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('returns display name of workspace & domain cards', function () {
        var cardFeedNamesWithType = (0, CardFeedUtils_1.getCardFeedNamesWithType)({ workspaceCardFeeds: fakeWorkspace, translate: Localize_1.translateLocal });
        expect(Object.keys(cardFeedNamesWithType).length).toBe(2);
        expect(Object.values(cardFeedNamesWithType).every(function (cardFeedName) { return cardFeedName.name === 'All Expensify'; })).toBe(true);
    });
    it('returns feeds to selected cards', function () {
        var feeds = ['22222222_Expensify Card'];
        var selected = (0, CardFeedUtils_1.getSelectedCardsFromFeeds)({}, fakeWorkspace, feeds);
        expect(selected.length).toBe(1);
        expect(selected.at(0)).toEqual('33333333');
    });
    it('returns empty object when workspaceCardFeeds is empty', function () {
        var names = (0, CardFeedUtils_1.getCardFeedNamesWithType)({ workspaceCardFeeds: { key: {} }, translate: Localize_1.translateLocal });
        expect(names).toEqual({});
    });
    it('returns empty array when selectedFeeds contains a non-existent feed', function () {
        var feeds = ['99999999_Expensify Card'];
        var selected = (0, CardFeedUtils_1.getSelectedCardsFromFeeds)({}, fakeWorkspace, feeds);
        expect(selected).toEqual([]);
    });
    it('returns card feeds for display with custom names', function () {
        var cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeedsMock, cardListMock);
        expect(cardFeedsForDisplay).toEqual({
            '5555_Expensify Card': { id: '5555_Expensify Card', fundID: '5555', feed: 'Expensify Card', name: 'Expensify Card' },
            '1234_oauth.americanexpressfdx.com 1001': { id: '1234_oauth.americanexpressfdx.com 1001', fundID: '1234', feed: 'oauth.americanexpressfdx.com 1001', name: 'American Express' },
            '1234_vcf': { id: '1234_vcf', fundID: '1234', feed: 'vcf', name: 'Custom feed name' },
            '1234_oauth.citibank.com': { id: '1234_oauth.citibank.com', fundID: '1234', feed: 'oauth.citibank.com', name: 'Citibank' },
            '1234_stripe': { id: '1234_stripe', fundID: '1234', feed: 'stripe', name: 'Stripe' },
        });
    });
    it('returns card feeds for display without Expensify Card', function () {
        var cardFeedsForDisplay = (0, CardFeedUtils_1.getCardFeedsForDisplay)(cardFeedsMock, {});
        expect(cardFeedsForDisplay).toEqual({
            '1234_oauth.americanexpressfdx.com 1001': { id: '1234_oauth.americanexpressfdx.com 1001', fundID: '1234', feed: 'oauth.americanexpressfdx.com 1001', name: 'American Express' },
            '1234_vcf': { id: '1234_vcf', fundID: '1234', feed: 'vcf', name: 'Custom feed name' },
            '1234_oauth.citibank.com': { id: '1234_oauth.citibank.com', fundID: '1234', feed: 'oauth.citibank.com', name: 'Citibank' },
            '1234_stripe': { id: '1234_stripe', fundID: '1234', feed: 'stripe', name: 'Stripe' },
        });
    });
    it('returns card feeds grouped per policy', function () {
        var cardFeedsForDisplayPerPolicy = (0, CardFeedUtils_1.getCardFeedsForDisplayPerPolicy)(cardFeedsMock);
        expect(cardFeedsForDisplayPerPolicy).toEqual({
            '': [{ id: '1234_oauth.americanexpressfdx.com 1001', fundID: '1234', feed: 'oauth.americanexpressfdx.com 1001', name: 'American Express' }],
            AA1BB2CC3: [
                { id: '1234_vcf', fundID: '1234', feed: 'vcf', name: 'Custom feed name' },
                { id: '1234_oauth.citibank.com', fundID: '1234', feed: 'oauth.citibank.com', name: 'Citibank' },
            ],
            XX1YY2ZZ3: [{ id: '1234_stripe', fundID: '1234', feed: 'stripe', name: 'Stripe' }],
        });
    });
});
