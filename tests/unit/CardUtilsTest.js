"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortBy_1 = require("lodash/sortBy");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const CardUtils_1 = require("@src/libs/CardUtils");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const shortDate = '0924';
const shortDateSlashed = '09/24';
const shortDateHyphen = '09-24';
const longDate = '092024';
const longDateSlashed = '09/2024';
const longDateHyphen = '09-2024';
const expectedMonth = '09';
const expectedYear = '2024';
const directFeedBanks = [
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_DIRECT,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BANK_OF_AMERICA,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.BREX,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CITIBANK,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.STRIPE,
    CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.WELLS_FARGO,
];
const companyCardsCustomFeedSettings = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: {
        pending: true,
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: {
        liabilityType: 'personal',
    },
    [CONST_1.default.EXPENSIFY_CARD.BANK]: {
        liabilityType: 'personal',
    },
};
const companyCardsCustomFeedSettingsWithNumbers = {
    [`${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD}1`]: {
        pending: true,
    },
    [`${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA}1`]: {
        liabilityType: 'personal',
    },
};
const companyCardsCustomVisaFeedSettingsWithNumbers = {
    [`${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA}1`]: {
        pending: false,
    },
    [`${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA}3`]: {
        pending: false,
    },
};
const companyCardsCustomFeedSettingsWithoutExpensifyBank = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: {
        pending: true,
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: {
        liabilityType: 'personal',
    },
};
const companyCardsDirectFeedSettings = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE]: {
        liabilityType: 'personal',
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE]: {
        liabilityType: 'personal',
    },
};
const companyCardsSettingsWithoutExpensifyBank = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: {
        pending: true,
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: {
        liabilityType: 'personal',
    },
    ...companyCardsDirectFeedSettings,
};
const companyCardsSettingsWithOnePendingFeed = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD]: {
        pending: true,
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: {
        pending: false,
    },
};
const oAuthAccountDetails = {
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE]: {
        accountList: ['CREDIT CARD...6607', 'CREDIT CARD...5501'],
        credentials: 'xxxxx',
        expiration: 1730998958,
    },
    [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE]: {
        accountList: ['CREDIT CARD...1233', 'CREDIT CARD...5678', 'CREDIT CARD...4444', 'CREDIT CARD...3333', 'CREDIT CARD...7788'],
        credentials: 'xxxxx',
        expiration: 1730998959,
    },
};
const directFeedCardsSingleList = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '21570652': {
        accountID: 18439984,
        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE,
        cardID: 21570652,
        cardName: 'CREDIT CARD...5501',
        domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
        fraud: 'none',
        lastFourPAN: '5501',
        lastScrape: '',
        lastUpdated: '',
        lastScrapeResult: 200,
        scrapeMinDate: '2024-08-27',
        state: 3,
    },
};
const commercialFeedCardsSingleList = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '21570652': {
        accountID: 18439984,
        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE,
        cardID: 21570652,
        cardName: 'CREDIT CARD...5501',
        domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
        fraud: 'none',
        lastFourPAN: '5501',
        lastScrape: '',
        lastUpdated: '',
        lastScrapeResult: 531,
        scrapeMinDate: '2024-08-27',
        state: 3,
    },
};
const directFeedCardsMultipleList = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '21570655': {
        accountID: 18439984,
        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE,
        cardID: 21570655,
        cardName: 'CREDIT CARD...5678',
        domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
        fraud: 'none',
        lastFourPAN: '5678',
        lastScrape: '',
        lastUpdated: '',
        lastScrapeResult: 200,
        scrapeMinDate: '2024-08-27',
        state: 3,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '21570656': {
        accountID: 18439984,
        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE,
        cardID: 21570656,
        cardName: 'CREDIT CARD...4444',
        domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
        fraud: 'none',
        lastFourPAN: '5678',
        lastScrape: '',
        lastUpdated: '',
        lastScrapeResult: 403,
        scrapeMinDate: '2024-08-27',
        state: 3,
    },
};
const customFeedCardsList = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '21310091': {
        accountID: 18439984,
        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
        cardID: 21310091,
        cardName: '480801XXXXXX2554',
        domainName: 'expensify-policy41314f4dc5ce25af.exfy',
        fraud: 'none',
        lastFourPAN: '2554',
        lastUpdated: '',
        lastScrape: '2024-11-27 11:00:53',
        scrapeMinDate: '2024-10-17',
        state: 3,
    },
    cardList: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '480801XXXXXX2111': 'ENCRYPTED_CARD_NUMBER',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '480801XXXXXX2554': 'ENCRYPTED_CARD_NUMBER',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '480801XXXXXX2566': 'ENCRYPTED_CARD_NUMBER',
    },
};
const customFeedName = 'Custom feed name';
const policyWithCardsEnabled = {
    areExpensifyCardsEnabled: true,
};
const policyWithCardsDisabled = {
    areExpensifyCardsEnabled: false,
};
const cardSettingsWithPaymentBankAccountID = {
    paymentBankAccountID: '12345',
};
const cardSettingsWithoutPaymentBankAccountID = {
    paymentBankAccountID: undefined,
};
const cardFeedsCollection = {
    // Policy with both custom and direct feeds
    FAKE_ID_1: {
        settings: {
            companyCardNicknames: {
                [CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA]: customFeedName,
            },
            companyCards: { ...companyCardsCustomFeedSettings, ...companyCardsDirectFeedSettings },
            oAuthAccountDetails,
        },
    },
    // Policy with direct feeds only
    FAKE_ID_2: {
        settings: {
            companyCards: companyCardsDirectFeedSettings,
            oAuthAccountDetails,
        },
    },
    // Policy with custom feeds only
    FAKE_ID_3: {
        settings: {
            companyCards: companyCardsCustomFeedSettings,
        },
    },
    // Policy with custom feeds only, feed names with numbers
    FAKE_ID_4: {
        settings: {
            companyCards: companyCardsCustomFeedSettingsWithNumbers,
        },
    },
    // Policy with several Visa feeds
    FAKE_ID_5: {
        settings: {
            companyCards: companyCardsCustomVisaFeedSettingsWithNumbers,
        },
    },
    // Policy with one pending feed
    FAKE_ID_6: {
        settings: {
            companyCards: companyCardsSettingsWithOnePendingFeed,
        },
    },
};
/* eslint-disable @typescript-eslint/naming-convention */
const allCardsList = {
    'cards_11111111_oauth.capitalone.com': directFeedCardsMultipleList,
    cards_11111111_vcf1: customFeedCardsList,
    'cards_22222222_oauth.chase.com': directFeedCardsSingleList,
    'cards_11111111_Expensify Card': {
        '21570657': {
            accountID: 18439984,
            bank: CONST_1.default.EXPENSIFY_CARD.BANK,
            cardID: 21570657,
            cardName: 'CREDIT CARD...5644',
            domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
            fraud: 'none',
            lastFourPAN: '',
            lastScrape: '',
            lastUpdated: '',
            state: 2,
        },
    },
    'cards_10101_Expensify Card': {
        '21570657': {
            accountID: 18439984,
            bank: CONST_1.default.EXPENSIFY_CARD.BANK,
            cardID: 21570657,
            cardName: 'CREDIT CARD...5644',
            domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
            fraud: 'none',
            lastFourPAN: '',
            lastScrape: '',
            lastUpdated: '',
            state: 2,
        },
    },
};
const mockIllustrations = {
    EmptyStateBackgroundImage: 'EmptyStateBackgroundImage',
    ExampleCheckES: 'ExampleCheckES',
    ExampleCheckEN: 'ExampleCheckEN',
    WorkspaceProfile: 'WorkspaceProfile',
    ExpensifyApprovedLogo: 'ExpensifyApprovedLogo',
    GenericCompanyCard: 'GenericCompanyCard',
    GenericCSVCompanyCardLarge: 'GenericCSVCompanyCardLarge',
    GenericCompanyCardLarge: 'GenericCompanyCardLarge',
};
jest.mock('@src/components/Icon/Illustrations', () => require('../../__mocks__/Illustrations'));
describe('CardUtils', () => {
    describe('Expiration date formatting', () => {
        it('Should format expirationDate month and year to MM/YYYY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(longDateSlashed)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(longDateSlashed)).toBe(expectedYear);
        });
        it('Should format expirationDate month and year to MM-YYYY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(longDateHyphen)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(longDateHyphen)).toBe(expectedYear);
        });
        it('Should format expirationDate month and year to MMYYYY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(longDate)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(longDate)).toBe(expectedYear);
        });
        it('Should format expirationDate month and year to MM/YY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(shortDateSlashed)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(shortDateSlashed)).toBe(expectedYear);
        });
        it('Should format expirationDate month and year to MM-YY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(shortDateHyphen)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(shortDateHyphen)).toBe(expectedYear);
        });
        it('Should format expirationDate month and year to MMYY', () => {
            expect((0, CardUtils_1.getMonthFromExpirationDateString)(shortDate)).toBe(expectedMonth);
            expect((0, CardUtils_1.getYearFromExpirationDateString)(shortDate)).toBe(expectedYear);
        });
        it('Should format to MM/YYYY given MM/YY', () => {
            expect((0, CardUtils_1.formatCardExpiration)(shortDateSlashed)).toBe(longDateSlashed);
            expect((0, CardUtils_1.formatCardExpiration)(shortDateSlashed)).toBe(longDateSlashed);
        });
        it('Should format to  MM/YYYY given MMYY', () => {
            expect((0, CardUtils_1.formatCardExpiration)(shortDate)).toBe(longDateSlashed);
            expect((0, CardUtils_1.formatCardExpiration)(shortDate)).toBe(longDateSlashed);
        });
    });
    describe('isCustomFeed', () => {
        it('Should return true for the custom visa feed with no number', () => {
            const customFeed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        it('Should return true for the custom visa feed with a number', () => {
            const customFeed = `${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA}1`;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        it('Should return true for the custom mastercard feed with no number', () => {
            const customFeed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        it('Should return true for the custom mastercard feed with a number', () => {
            const customFeed = `${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD}3`;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        it('Should return true for the custom amex feed with no number', () => {
            const customFeed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        it('Should return true for the custom amex feed with a number', () => {
            const customFeed = `${CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX}2`;
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(customFeed);
            expect(isCustomFeed).toBe(true);
        });
        test.each(directFeedBanks)('Should return false for the direct feed %s', (directFeed) => {
            const isCustomFeed = (0, CardUtils_1.isCustomFeed)(directFeed);
            expect(isCustomFeed).toBe(false);
        });
    });
    describe('getCompanyFeeds', () => {
        it('Should return both custom and direct feeds with filtered out "Expensify Card" bank', () => {
            const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeedsCollection.FAKE_ID_1);
            expect(companyFeeds).toStrictEqual(companyCardsSettingsWithoutExpensifyBank);
        });
        it('Should return direct feeds only since custom feeds are not exist', () => {
            const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeedsCollection.FAKE_ID_2);
            expect(companyFeeds).toStrictEqual(companyCardsDirectFeedSettings);
        });
        it('Should return custom feeds only with filtered out "Expensify Card" bank since direct feeds are not exist', () => {
            const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeedsCollection.FAKE_ID_3);
            expect(companyFeeds).toStrictEqual(companyCardsCustomFeedSettingsWithoutExpensifyBank);
        });
        it('Should return empty object if undefined is passed', () => {
            const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(undefined);
            expect(companyFeeds).toStrictEqual({});
        });
        it('Should return only feeds that are not pending', () => {
            const companyFeeds = (0, CardUtils_1.getCompanyFeeds)(cardFeedsCollection.FAKE_ID_6, false, true);
            expect(Object.keys(companyFeeds).length).toStrictEqual(1);
        });
    });
    describe('getSelectedFeed', () => {
        it('Should return last selected custom feed', () => {
            const lastSelectedCustomFeed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA;
            const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedCustomFeed, cardFeedsCollection.FAKE_ID_1);
            expect(selectedFeed).toBe(lastSelectedCustomFeed);
        });
        it('Should return last selected direct feed', () => {
            const lastSelectedDirectFeed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE;
            const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedDirectFeed, cardFeedsCollection.FAKE_ID_1);
            expect(selectedFeed).toBe(lastSelectedDirectFeed);
        });
        it('Should return the first available custom feed if lastSelectedFeed is undefined', () => {
            const lastSelectedFeed = undefined;
            const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeedsCollection.FAKE_ID_3);
            expect(selectedFeed).toBe(CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD);
        });
        it('Should return the first available direct feed if lastSelectedFeed is undefined', () => {
            const lastSelectedFeed = undefined;
            const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeedsCollection.FAKE_ID_2);
            expect(selectedFeed).toBe(CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE);
        });
        it('Should return undefined if lastSelectedFeed is undefined and there is no card feeds', () => {
            const lastSelectedFeed = undefined;
            const cardFeeds = undefined;
            const selectedFeed = (0, CardUtils_1.getSelectedFeed)(lastSelectedFeed, cardFeeds);
            expect(selectedFeed).toBe(undefined);
        });
    });
    describe('getCustomOrFormattedFeedName', () => {
        beforeAll(() => {
            IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
            return (0, waitForBatchedUpdates_1.default)();
        });
        it('Should return custom name if exists', () => {
            const feed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA;
            const companyCardNicknames = cardFeedsCollection.FAKE_ID_1?.settings?.companyCardNicknames;
            const feedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, companyCardNicknames);
            expect(feedName).toBe(customFeedName);
        });
        it('Should return formatted name if there is no custom name', () => {
            const feed = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA;
            const companyCardNicknames = cardFeedsCollection.FAKE_ID_3?.settings?.companyCardNicknames;
            const feedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, companyCardNicknames);
            expect(feedName).toBe('Visa cards');
        });
        it('Should return undefined if no feed provided', () => {
            const feed = undefined;
            const companyCardNicknames = cardFeedsCollection.FAKE_ID_1?.settings?.companyCardNicknames;
            const feedName = (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, companyCardNicknames);
            expect(feedName).toBe(undefined);
        });
    });
    describe('lastFourNumbersFromCardName', () => {
        it('Should return last 4 numbers from the card name', () => {
            const lastFour = (0, CardUtils_1.lastFourNumbersFromCardName)('Business Card Cash - 3001');
            expect(lastFour).toBe('3001');
        });
        it('Should return empty string if card number does not have space', () => {
            const lastFour = (0, CardUtils_1.lastFourNumbersFromCardName)('480801XXXXXX2554');
            expect(lastFour).toBe('');
        });
        it('Should return empty string if card number does not have number in the end with dash', () => {
            const lastFour = (0, CardUtils_1.lastFourNumbersFromCardName)('Business Card Cash - Business');
            expect(lastFour).toBe('');
        });
    });
    describe('maskCardNumber', () => {
        it("Should return the card number divided into chunks of 4, with 'X' replaced by '•' if it's provided in the '480801XXXXXX2554' format", () => {
            const cardNumber = '480801XXXXXX2554';
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)(cardNumber, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD);
            expect(maskedCardNumber).toBe('4808 01•• •••• 2554');
        });
        it('Should return card number without changes if it has empty space', () => {
            const cardNumber = 'CREDIT CARD...6607';
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)(cardNumber, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE);
            expect(maskedCardNumber).toBe(cardNumber);
        });
        it("Should return the Amex direct feed card number divided into 4/6/5 chunks, with 'X' replaced by '•' if it's provided in '211944XXXXX6557' format", () => {
            const cardNumber = '211944XXXXX6557';
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)(cardNumber, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX_DIRECT);
            expect(maskedCardNumber).toBe('2119 44•••• •6557');
        });
        it("Should return the Amex custom feed card number divided into 4/6/5 chunks, with 'X' replaced by '•' if it's provided in '211944XXXXX6557' format", () => {
            const cardNumber = '211944XXXXX6557';
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)(cardNumber, CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.AMEX);
            expect(maskedCardNumber).toBe('2119 44•••• •6557');
        });
        it('Should return masked card number even if undefined feed was provided', () => {
            const cardNumber = '480801XXXXXX2554';
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)(cardNumber, undefined);
            expect(maskedCardNumber).toBe('4808 01•• •••• 2554');
        });
        it('Should return empty string if invalid card name was provided', () => {
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)('', CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.MASTER_CARD);
            expect(maskedCardNumber).toBe('');
        });
        it('Should return card name without last 4 numbers', () => {
            const maskedCardNumber = (0, CardUtils_1.maskCardNumber)('Business Card Cash - 3001', undefined);
            expect(maskedCardNumber).toBe('Business Card Cash');
        });
    });
    describe('getCardFeedName', () => {
        it('Should return a valid name if a valid feed was provided', () => {
            const feed = 'vcf';
            const feedName = (0, CardUtils_1.getBankName)(feed);
            expect(feedName).toBe('Visa');
        });
        it('Should return a valid name if an OldDot feed variation was provided', () => {
            const feed = 'oauth.americanexpressfdx.com 2003';
            const feedName = (0, CardUtils_1.getBankName)(feed);
            expect(feedName).toBe('American Express');
        });
        it('Should return a valid name if a CSV imported feed variation was provided', () => {
            const feed = 'cards_2267989_ccupload666';
            const feedName = (0, CardUtils_1.getBankName)(feed);
            expect(feedName).toBe('CSV');
        });
        it('Should return empty string if invalid feed was provided', () => {
            const feed = 'vvcf';
            const feedName = (0, CardUtils_1.getBankName)(feed);
            expect(feedName).toBe('');
        });
    });
    describe('getCardFeedIcon', () => {
        it('Should return a valid illustration if a valid feed was provided', () => {
            const feed = 'vcf';
            const illustration = (0, CardUtils_1.getCardFeedIcon)(feed, mockIllustrations);
            expect(illustration).toBe('VisaCompanyCardDetailLarge');
        });
        it('Should return a valid illustration if an OldDot feed variation was provided', () => {
            const feed = 'oauth.americanexpressfdx.com 2003';
            const illustration = (0, CardUtils_1.getCardFeedIcon)(feed, mockIllustrations);
            expect(illustration).toBe('AmexCardCompanyCardDetailLarge');
        });
        it('Should return a valid illustration if a CSV imported feed variation was provided', () => {
            const feed = 'cards_2267989_ccupload666';
            const illustration = (0, CardUtils_1.getCardFeedIcon)(feed, mockIllustrations);
            expect(illustration).toBe('GenericCSVCompanyCardLarge');
        });
        it('Should return valid illustration if a non-matching feed was provided', () => {
            const feed = '666';
            const illustration = (0, CardUtils_1.getCardFeedIcon)(feed, mockIllustrations);
            expect(illustration).toBe('GenericCompanyCardLarge');
        });
    });
    describe('getBankCardDetailsImage', () => {
        it('Should return a valid illustration if a valid bank name was provided', () => {
            const bank = 'American Express';
            const illustration = (0, CardUtils_1.getBankCardDetailsImage)(bank, mockIllustrations);
            expect(illustration).toBe('AmexCardCompanyCardDetail');
        });
        it('Should return a valid illustration if Other bank name was provided', () => {
            const bank = 'Other';
            const illustration = (0, CardUtils_1.getBankCardDetailsImage)(bank, mockIllustrations);
            expect(illustration).toBe('GenericCompanyCard');
        });
    });
    describe('getFilteredCardList', () => {
        it('Should return filtered custom feed cards list', () => {
            const cardsList = (0, CardUtils_1.getFilteredCardList)(customFeedCardsList, undefined, undefined);
            expect(cardsList).toStrictEqual({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '480801XXXXXX2111': 'ENCRYPTED_CARD_NUMBER',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '480801XXXXXX2566': 'ENCRYPTED_CARD_NUMBER',
            });
        });
        it('Should return filtered direct feed cards list with a single card', () => {
            const cardsList = (0, CardUtils_1.getFilteredCardList)(directFeedCardsSingleList, oAuthAccountDetails[CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE], undefined);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expect(cardsList).toStrictEqual({ 'CREDIT CARD...6607': 'CREDIT CARD...6607' });
        });
        it('Should return filtered direct feed cards list with multiple cards', () => {
            const cardsList = (0, CardUtils_1.getFilteredCardList)(directFeedCardsMultipleList, oAuthAccountDetails[CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE], undefined);
            expect(cardsList).toStrictEqual({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'CREDIT CARD...1233': 'CREDIT CARD...1233',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'CREDIT CARD...3333': 'CREDIT CARD...3333',
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'CREDIT CARD...7788': 'CREDIT CARD...7788',
            });
        });
        it('Should return empty object if no data was provided', () => {
            const cardsList = (0, CardUtils_1.getFilteredCardList)(undefined, undefined, undefined);
            expect(cardsList).toStrictEqual({});
        });
        it('Should handle the case when all cards are already assigned in other workspaces', () => {
            const assignedCard1 = 'CREDIT CARD...5566';
            const assignedCard2 = 'CREDIT CARD...6677';
            const mockAllWorkspaceCards = {
                cards_888888_feed: {
                    '11111': {
                        accountID: 999999,
                        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE,
                        cardID: 11111,
                        cardName: assignedCard1,
                        domainName: 'other-workspace.exfy',
                        state: 3,
                    },
                    '22222': {
                        accountID: 999999,
                        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CHASE,
                        cardID: 22222,
                        cardName: assignedCard2,
                        domainName: 'other-workspace.exfy',
                        state: 3,
                    },
                },
            };
            const customFeedWithAllAssignedCards = {
                cardList: {
                    [assignedCard1]: 'ENCRYPTED_DATA',
                    [assignedCard2]: 'ENCRYPTED_DATA',
                },
            };
            const filteredCards = (0, CardUtils_1.getFilteredCardList)(customFeedWithAllAssignedCards, undefined, mockAllWorkspaceCards);
            expect(filteredCards).toStrictEqual({});
        });
        it('Should filter out cards that are already assigned in another workspace (custom feed)', () => {
            const customFeedWorkspaceCardsList = {
                '21310091': {
                    accountID: 18439984,
                    bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
                    cardID: 21310091,
                    cardName: '480801XXXXXX2554',
                    domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                    fraud: 'none',
                    lastFourPAN: '2554',
                    lastUpdated: '',
                    lastScrape: '2024-11-27 11:00:53',
                    scrapeMinDate: '2024-10-17',
                    state: 3,
                },
                '21310092': {
                    accountID: 18439985,
                    bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
                    cardID: 21310092,
                    cardName: '480801XXXXXX2666',
                    domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                    fraud: 'none',
                    lastFourPAN: '2666',
                    lastUpdated: '',
                    lastScrape: '2024-11-27 11:00:53',
                    scrapeMinDate: '2024-10-17',
                    state: 3,
                },
                cardList: {
                    '480801XXXXXX2554': 'ENCRYPTED_CARD_NUMBER',
                    '480801XXXXXX2666': 'ENCRYPTED_CARD_NUMBER',
                },
            };
            const filteredCards = (0, CardUtils_1.getFilteredCardList)(customFeedWorkspaceCardsList, undefined, undefined);
            expect(filteredCards).toStrictEqual({});
        });
        it('Should filter out cards that are already assigned in another workspace (direct feed)', () => {
            const assignedCard1 = 'CREDIT CARD...3344';
            const assignedCard2 = 'CREDIT CARD...3355';
            const unassignedCard = 'CREDIT CARD...6666';
            const mockAllWorkspaceCards = {
                cards_888888_feed: {
                    '67889': {
                        accountID: 999998,
                        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE,
                        cardID: 67889,
                        cardName: assignedCard1,
                        domainName: 'other-workspace.exfy',
                        state: 3,
                    },
                    '67890': {
                        accountID: 999999,
                        bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE,
                        cardID: 67890,
                        cardName: assignedCard2,
                        domainName: 'other-workspace.exfy',
                        state: 3,
                    },
                },
            };
            const directFeedWithAssignedCard = {
                accountList: [assignedCard1, assignedCard2, unassignedCard],
            };
            const filteredCards = (0, CardUtils_1.getFilteredCardList)(undefined, directFeedWithAssignedCard, mockAllWorkspaceCards);
            expect(filteredCards).toStrictEqual({ [`${unassignedCard}`]: unassignedCard });
        });
    });
    describe('getFeedType', () => {
        it('should return the feed name with a consecutive number, if there is already a feed with a number', () => {
            const feedType = (0, CardUtils_1.getFeedType)('vcf', cardFeedsCollection.FAKE_ID_4);
            expect(feedType).toBe('vcf2');
        });
        it('should return the feed name with 1, if there is already a feed without a number', () => {
            const feedType = (0, CardUtils_1.getFeedType)('vcf', cardFeedsCollection.FAKE_ID_3);
            expect(feedType).toBe('vcf1');
        });
        it('should return the feed name with with the first smallest available number', () => {
            const feedType = (0, CardUtils_1.getFeedType)('vcf', cardFeedsCollection.FAKE_ID_5);
            expect(feedType).toBe('vcf2');
        });
    });
    describe('flatAllCardsList', () => {
        it('should return the flattened list of non-Expensify cards related to the provided workspaceAccountID', () => {
            const workspaceAccountID = 11111111;
            const flattenedCardsList = (0, CardUtils_1.flatAllCardsList)(allCardsList, workspaceAccountID);
            const { cardList, ...customCards } = customFeedCardsList;
            expect(flattenedCardsList).toStrictEqual({
                ...directFeedCardsMultipleList,
                ...customCards,
            });
        });
        it('should return undefined if not defined cards list was provided', () => {
            const workspaceAccountID = 11111111;
            const flattenedCardsList = (0, CardUtils_1.flatAllCardsList)(undefined, workspaceAccountID);
            expect(flattenedCardsList).toBeUndefined();
        });
    });
    describe('checkIfFeedConnectionIsBroken', () => {
        it('should return true if at least one of the feed(s) cards has the lastScrapeResult not equal to 200', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(directFeedCardsMultipleList)).toBeTruthy();
        });
        it('should return false if all of the feed(s) cards has the lastScrapeResult equal to 200', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(directFeedCardsSingleList)).toBeFalsy();
        });
        it('should return false if all of the feed(s) cards has the lastScrapeResult equal to 531', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(commercialFeedCardsSingleList)).toBeFalsy();
        });
        it('should return false if no feed(s) cards are provided', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)({})).toBeFalsy();
        });
        it('should not take into consideration cards related to feed which is provided as feedToExclude', () => {
            const cards = { ...directFeedCardsMultipleList, ...directFeedCardsSingleList };
            const feedToExclude = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE;
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(cards, feedToExclude)).toBeFalsy();
        });
    });
    describe('checkIfFeedConnectionIsBroken', () => {
        it('should return true if at least one of the feed(s) cards has the lastScrapeResult not equal to 200', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(directFeedCardsMultipleList)).toBeTruthy();
        });
        it('should return false if all of the feed(s) cards has the lastScrapeResult equal to 200', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(directFeedCardsSingleList)).toBeFalsy();
        });
        it('should return false if no feed(s) cards are provided', () => {
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)({})).toBeFalsy();
        });
        it('should not take into consideration cards related to feed which is provided as feedToExclude', () => {
            const cards = { ...directFeedCardsMultipleList, ...directFeedCardsSingleList };
            const feedToExclude = CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.CAPITAL_ONE;
            expect((0, CardUtils_1.checkIfFeedConnectionIsBroken)(cards, feedToExclude)).toBeFalsy();
        });
    });
    describe('hasIssuedExpensifyCard', () => {
        it('should return true when Expensify Card was issued for given workspace', () => {
            const workspaceAccountID = 11111111;
            expect((0, CardUtils_1.hasIssuedExpensifyCard)(workspaceAccountID, allCardsList)).toBe(true);
        });
        it('should return false when Expensify Card was not issued for given workspace', () => {
            const workspaceAccountID = 11111111;
            expect((0, CardUtils_1.hasIssuedExpensifyCard)(workspaceAccountID, {})).toBe(false);
        });
        it('should not erroneously return true when workspaceAccountID is 0', () => {
            const workspaceAccountID = 0;
            expect((0, CardUtils_1.hasIssuedExpensifyCard)(workspaceAccountID, allCardsList)).toBe(false);
        });
    });
    describe('getAllCardsForWorkspace', () => {
        it('should return all cards for a given workspace', () => {
            const workspaceAccountID = 11111111;
            expect((0, CardUtils_1.getAllCardsForWorkspace)(workspaceAccountID, allCardsList)).toEqual({
                '21310091': {
                    accountID: 18439984,
                    bank: 'vcf',
                    cardID: 21310091,
                    cardName: '480801XXXXXX2554',
                    domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                    fraud: 'none',
                    lastFourPAN: '2554',
                    lastScrape: '2024-11-27 11:00:53',
                    lastUpdated: '',
                    scrapeMinDate: '2024-10-17',
                    state: 3,
                },
                '21570655': {
                    accountID: 18439984,
                    bank: 'oauth.capitalone.com',
                    cardID: 21570655,
                    cardName: 'CREDIT CARD...5678',
                    domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                    fraud: 'none',
                    lastFourPAN: '5678',
                    lastScrape: '',
                    lastScrapeResult: 200,
                    lastUpdated: '',
                    scrapeMinDate: '2024-08-27',
                    state: 3,
                },
                '21570656': {
                    accountID: 18439984,
                    bank: 'oauth.capitalone.com',
                    cardID: 21570656,
                    cardName: 'CREDIT CARD...4444',
                    domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                    fraud: 'none',
                    lastFourPAN: '5678',
                    lastScrape: '',
                    lastScrapeResult: 403,
                    lastUpdated: '',
                    scrapeMinDate: '2024-08-27',
                    state: 3,
                },
                '21570657': {
                    accountID: 18439984,
                    bank: 'Expensify Card',
                    cardID: 21570657,
                    cardName: 'CREDIT CARD...5644',
                    domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                    fraud: 'none',
                    lastFourPAN: '',
                    lastScrape: '',
                    lastUpdated: '',
                    state: 2,
                },
            });
        });
    });
    describe('isExpensifyCardFullySetUp', () => {
        it('should return true when policy has enabled cards and cardSettings has payment bank account ID', () => {
            const result = (0, CardUtils_1.isExpensifyCardFullySetUp)(policyWithCardsEnabled, cardSettingsWithPaymentBankAccountID);
            expect(result).toBe(true);
        });
        it('should return false when policy has disabled cards', () => {
            const result = (0, CardUtils_1.isExpensifyCardFullySetUp)(policyWithCardsDisabled, cardSettingsWithoutPaymentBankAccountID);
            expect(result).toBe(false);
        });
        it('should return false when cardSettings has no payment bank account ID', () => {
            const result = (0, CardUtils_1.isExpensifyCardFullySetUp)(policyWithCardsEnabled, cardSettingsWithoutPaymentBankAccountID);
            expect(result).toBe(false);
        });
        it('should return false when cardSettings is undefined', () => {
            const result = (0, CardUtils_1.isExpensifyCardFullySetUp)(policyWithCardsEnabled, undefined);
            expect(result).toBe(false);
        });
        it('should return false when both policy and cardSettings are undefined', () => {
            const result = (0, CardUtils_1.isExpensifyCardFullySetUp)(undefined, undefined);
            expect(result).toBe(false);
        });
    });
    describe('filterInactiveCards', () => {
        it('should filter out closed, deactivated and suspended cards', () => {
            const activeCards = { card1: { cardID: 1, state: CONST_1.default.EXPENSIFY_CARD.STATE.OPEN } };
            const closedCards = {
                card2: { cardID: 2, state: CONST_1.default.EXPENSIFY_CARD.STATE.CLOSED },
                card3: { cardID: 3, state: CONST_1.default.EXPENSIFY_CARD.STATE.STATE_DEACTIVATED },
                card4: { cardID: 4, state: CONST_1.default.EXPENSIFY_CARD.STATE.STATE_SUSPENDED },
            };
            const cardList = { ...activeCards, ...closedCards };
            const filteredList = (0, CardUtils_1.filterInactiveCards)(cardList);
            expect(filteredList).toEqual(activeCards);
        });
        it('should return an empty object if undefined card list is passed', () => {
            const cards = (0, CardUtils_1.filterInactiveCards)(undefined);
            expect(cards).toEqual({});
        });
    });
    describe('sortCardsByCardholderName', () => {
        const mockPersonalDetails = {
            1: {
                accountID: 1,
                login: 'john@example.com',
                displayName: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
            },
            2: {
                accountID: 2,
                login: 'jane@example.com',
                displayName: 'Jane Smith',
                firstName: 'Jane',
                lastName: 'Smith',
            },
            3: {
                accountID: 3,
                login: 'unknown@example.com',
                // No displayName or firstName/lastName
            },
        };
        const mockCards = {
            '1': {
                cardID: 1,
                accountID: 1,
                cardName: 'Card 1',
                bank: 'expensify',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            },
            '2': {
                cardID: 2,
                accountID: 2,
                bank: 'expensify',
                cardName: 'Card 2',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            },
            '3': {
                cardID: 3,
                accountID: 3,
                bank: 'expensify',
                cardName: 'Card 3',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            },
        };
        it('should sort cards by cardholder name in ascending order', () => {
            const policyMembersAccountIDs = [1, 2, 3];
            const cards = (0, CardUtils_1.getCardsByCardholderName)(mockCards, policyMembersAccountIDs);
            const sortedCards = (0, CardUtils_1.sortCardsByCardholderName)(cards, mockPersonalDetails, TestHelper_1.localeCompare);
            expect(sortedCards).toHaveLength(3);
            expect(sortedCards.at(0)?.cardID).toBe(2);
            expect(sortedCards.at(1)?.cardID).toBe(1);
            expect(sortedCards.at(2)?.cardID).toBe(3);
        });
        it('should filter out cards that are not associated with policy members', () => {
            const policyMembersAccountIDs = [1, 2]; // Exclude accountID 3
            const cards = (0, CardUtils_1.getCardsByCardholderName)(mockCards, policyMembersAccountIDs);
            const sortedCards = (0, CardUtils_1.sortCardsByCardholderName)(cards, mockPersonalDetails, TestHelper_1.localeCompare);
            expect(sortedCards).toHaveLength(2);
            expect(sortedCards.at(0)?.cardID).toBe(2);
            expect(sortedCards.at(1)?.cardID).toBe(1);
        });
        it('should handle undefined cardsList', () => {
            const policyMembersAccountIDs = [1, 2, 3];
            const cards = (0, CardUtils_1.getCardsByCardholderName)(undefined, policyMembersAccountIDs);
            const sortedCards = (0, CardUtils_1.sortCardsByCardholderName)(cards, mockPersonalDetails, TestHelper_1.localeCompare);
            expect(sortedCards).toHaveLength(0);
        });
        it('should handle undefined personalDetails', () => {
            const policyMembersAccountIDs = [1, 2, 3];
            const cards = (0, CardUtils_1.getCardsByCardholderName)(mockCards, policyMembersAccountIDs);
            const sortedCards = (0, CardUtils_1.sortCardsByCardholderName)(cards, undefined, TestHelper_1.localeCompare);
            expect(sortedCards).toHaveLength(3);
            // All cards should be sorted with default names
            expect(sortedCards.at(0)?.cardID).toBe(1);
            expect(sortedCards.at(1)?.cardID).toBe(2);
            expect(sortedCards.at(2)?.cardID).toBe(3);
        });
        it('should handle cards with missing accountID', () => {
            const cardsWithMissingAccountID = {
                '1': {
                    cardID: 1,
                    accountID: 1,
                    cardName: 'Card 1',
                    bank: 'expensify',
                    domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                    fraud: 'none',
                    lastFourPAN: '',
                    lastScrape: '',
                    lastUpdated: '',
                    state: 2,
                },
                '2': {
                    cardID: 2,
                    cardName: 'Card 2',
                    bank: 'expensify',
                    domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                    fraud: 'none',
                    lastFourPAN: '',
                    lastScrape: '',
                    lastUpdated: '',
                    state: 2,
                },
            };
            const policyMembersAccountIDs = [1, 2];
            const cards = (0, CardUtils_1.getCardsByCardholderName)(cardsWithMissingAccountID, policyMembersAccountIDs);
            const sortedCards = (0, CardUtils_1.sortCardsByCardholderName)(cards, mockPersonalDetails, TestHelper_1.localeCompare);
            expect(sortedCards).toHaveLength(1);
            expect(sortedCards.at(0)?.cardID).toBe(1);
        });
    });
    describe('getCardDescription', () => {
        it('should return the correct card description for company card', () => {
            const card = {
                accountID: 18439984,
                bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
                cardID: 21310091,
                cardName: '480801XXXXXX2554',
                domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                fraud: 'none',
                lastFourPAN: '2554',
                lastUpdated: '',
                lastScrape: '2024-11-27 11:00:53',
                scrapeMinDate: '2024-10-17',
                state: 3,
            };
            const description = (0, CardUtils_1.getCardDescription)(card);
            expect(description).toBe('Visa - 2554');
        });
        it('should return the correct card description for Expensify card', () => {
            const card = {
                accountID: 18439984,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                cardID: 21570657,
                cardName: 'CREDIT CARD...5644',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            };
            const description = (0, CardUtils_1.getCardDescription)(card);
            expect(description).toBe('Expensify Card');
        });
    });
    describe('isExpensifyCard', () => {
        it('should return true for Expensify Card', () => {
            const card = {
                accountID: 18439984,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                cardID: 21570657,
                cardName: 'CREDIT CARD...5644',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            };
            expect((0, CardUtils_1.isExpensifyCard)(card)).toBe(true);
        });
        it('should return false for non-Expensify Card', () => {
            const card = {
                accountID: 18439984,
                bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
                cardID: 21310091,
                cardName: '480801XXXXXX2554',
                domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                fraud: 'none',
                lastFourPAN: '2554',
                lastUpdated: '',
                lastScrape: '2024-11-27 11:00:53',
                scrapeMinDate: '2024-10-17',
                state: 3,
            };
            expect((0, CardUtils_1.isExpensifyCard)(card)).toBe(false);
        });
    });
    describe('getCompanyCardDescription', () => {
        const cardList = {
            '21310091': {
                accountID: 18439984,
                bank: CONST_1.default.COMPANY_CARD.FEED_BANK_NAME.VISA,
                cardID: 21310091,
                cardName: '480801XXXXXX2554',
                domainName: 'expensify-policy41314f4dc5ce25af.exfy',
                fraud: 'none',
                lastFourPAN: '2554',
                lastUpdated: '',
                lastScrape: '2024-11-27 11:00:53',
                scrapeMinDate: '2024-10-17',
                state: 3,
            },
            '21570657': {
                accountID: 18439984,
                bank: CONST_1.default.EXPENSIFY_CARD.BANK,
                cardID: 21570657,
                cardName: 'CREDIT CARD...5644',
                domainName: 'expensify-policy17f617b9fe23d2f1.exfy',
                fraud: 'none',
                lastFourPAN: '',
                lastScrape: '',
                lastUpdated: '',
                state: 2,
            },
        };
        it('should return the correct description for a company card', () => {
            const description = (0, CardUtils_1.getCompanyCardDescription)('Test', 21310091, cardList);
            expect(description).toBe('480801XXXXXX2554');
        });
        it('should return the correct description for an Expensify card', () => {
            const description = (0, CardUtils_1.getCompanyCardDescription)('Test', 21570657, cardList);
            expect(description).toBe('Test');
        });
    });
    describe('Expensify card sort comparator', () => {
        it('should not change the order of non-Expensify cards', () => {
            const cardList = {
                10: { cardID: 10, bank: 'chase' }, // non-Expensify
                11: { cardID: 11, bank: 'chase' }, // non-Expensify
            };
            const sorted = (0, sortBy_1.default)(Object.values(cardList), CardUtils_1.getAssignedCardSortKey);
            expect(sorted.map((r) => r.cardID)).toEqual([10, 11]);
        });
        it('places physical Expensify card before its virtual sibling', () => {
            const cardList = {
                10: { cardID: 10, bank: CONST_1.default.EXPENSIFY_CARD.BANK, nameValuePairs: { isVirtual: true } }, // Expensify virtual
                11: { cardID: 11, bank: CONST_1.default.EXPENSIFY_CARD.BANK }, // Expensify physical
                99: { cardID: 99, bank: 'chase' }, // non-Expensify
            };
            const sorted = (0, sortBy_1.default)(Object.values(cardList), CardUtils_1.getAssignedCardSortKey);
            expect(sorted.map((r) => r.cardID)).toEqual([11, 10, 99]);
        });
    });
});
