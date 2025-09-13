"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSelectedCards = void 0;
exports.buildCardsData = buildCardsData;
exports.getCardFeedNamesWithType = getCardFeedNamesWithType;
exports.buildCardFeedsData = buildCardFeedsData;
exports.getSelectedCardsFromFeeds = getSelectedCardsFromFeeds;
exports.createCardFeedKey = createCardFeedKey;
exports.getCardFeedKey = getCardFeedKey;
exports.getWorkspaceCardFeedKey = getWorkspaceCardFeedKey;
exports.generateDomainFeedData = generateDomainFeedData;
exports.getDomainFeedData = getDomainFeedData;
exports.getCardFeedsForDisplay = getCardFeedsForDisplay;
exports.getCardFeedsForDisplayPerPolicy = getCardFeedsForDisplayPerPolicy;
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const CardUtils_1 = require("./CardUtils");
const PolicyUtils_1 = require("./PolicyUtils");
function getRepeatingBanks(workspaceCardFeedsKeys, domainFeedsData) {
    const bankFrequency = {};
    for (const key of workspaceCardFeedsKeys) {
        // Example: "cards_18755165_Expensify Card" -> "Expensify Card"
        const bankName = key.split('_').at(2);
        if (bankName) {
            bankFrequency[bankName] = (bankFrequency[bankName] || 0) + 1;
        }
    }
    for (const domainFeed of Object.values(domainFeedsData)) {
        bankFrequency[domainFeed.bank] = (bankFrequency[domainFeed.bank] || 0) + 1;
    }
    return Object.keys(bankFrequency).filter((bank) => bankFrequency[bank] > 1);
}
/**
 * @returns string with the 'cards_' part removed from the beginning
 */
function getCardFeedKey(workspaceCardFeeds, workspaceFeedKey) {
    const workspaceFeed = workspaceCardFeeds ? workspaceCardFeeds[workspaceFeedKey] : undefined;
    if (!workspaceFeed) {
        return;
    }
    const representativeCard = Object.values(workspaceFeed).find((cardFeedItem) => (0, CardUtils_1.isCard)(cardFeedItem));
    if (!representativeCard) {
        return;
    }
    const { fundID, bank } = representativeCard;
    return createCardFeedKey(fundID, bank);
}
/**
 * @returns string with added 'cards_' substring at the beginning
 */
function getWorkspaceCardFeedKey(cardFeedKey) {
    if (!cardFeedKey.startsWith(ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST)) {
        return `${ONYXKEYS_1.default.COLLECTION.WORKSPACE_CARDS_LIST}${cardFeedKey}`;
    }
    return cardFeedKey;
}
function createCardFilterItem(card, personalDetailsList, selectedCards, illustrations) {
    const personalDetails = personalDetailsList[card?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID];
    const isSelected = selectedCards.includes(card.cardID.toString());
    const icon = (0, CardUtils_1.getCardFeedIcon)(card?.bank, illustrations);
    const cardName = card?.nameValuePairs?.cardTitle;
    const text = personalDetails?.displayName ?? cardName;
    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(card?.bank);
    return {
        lastFourPAN: card.lastFourPAN,
        isVirtual: card?.nameValuePairs?.isVirtual,
        shouldShowOwnersAvatar: true,
        cardName,
        cardOwnerPersonalDetails: personalDetails ?? undefined,
        text,
        plaidUrl,
        keyForList: card.cardID.toString(),
        isSelected,
        bankIcon: {
            icon,
        },
        isCardFeed: false,
        cardFeedKey: '',
    };
}
function buildCardsData(workspaceCardFeeds, userCardList, personalDetailsList, selectedCards, illustrations, isClosedCards = false) {
    // Filter condition to build different cards data for closed cards and individual cards based on the isClosedCards flag, we don't want to show closed cards in the individual cards section
    const filterCondition = (card) => (isClosedCards ? (0, CardUtils_1.isCardClosed)(card) : !(0, CardUtils_1.isCardHiddenFromSearch)(card) && !(0, CardUtils_1.isCardClosed)(card) && (0, CardUtils_1.isCard)(card));
    const userAssignedCards = Object.values(userCardList ?? {})
        .filter((card) => filterCondition(card))
        .map((card) => createCardFilterItem(card, personalDetailsList, selectedCards, illustrations));
    // When user is admin of a workspace he sees all the cards of workspace under cards_ Onyx key
    const allWorkspaceCards = Object.values(workspaceCardFeeds)
        .filter((cardFeed) => !(0, EmptyObject_1.isEmptyObject)(cardFeed))
        .flatMap((cardFeed) => {
        return Object.values(cardFeed)
            .filter((card) => card && (0, CardUtils_1.isCard)(card) && !userCardList?.[card.cardID] && filterCondition(card))
            .map((card) => createCardFilterItem(card, personalDetailsList, selectedCards, illustrations));
    });
    const allCardItems = [...userAssignedCards, ...allWorkspaceCards];
    const selectedCardItems = [];
    const unselectedCardItems = [];
    allCardItems.forEach((card) => {
        if (card.isSelected) {
            selectedCardItems.push(card);
        }
        else {
            unselectedCardItems.push(card);
        }
    });
    return { selected: selectedCardItems, unselected: unselectedCardItems };
}
/**
 * @param cardList - The list of cards to process. Can be undefined.
 * @returns a record where keys are domain names and values contain domain feed data.
 */
function generateDomainFeedData(cardList) {
    return Object.values(cardList ?? {}).reduce((domainFeedData, currentCard) => {
        // Cards in cardList can also be domain cards, we use them to compute domain feed
        if (!currentCard?.domainName?.match(CONST_1.default.REGEX.EXPENSIFY_POLICY_DOMAIN_NAME) && !(0, CardUtils_1.isCardHiddenFromSearch)(currentCard) && currentCard.fundID) {
            if (domainFeedData[`${currentCard.fundID}_${currentCard.bank}`]) {
                domainFeedData[`${currentCard.fundID}_${currentCard.bank}`].correspondingCardIDs.push(currentCard.cardID.toString());
            }
            else {
                // if the cards belongs to the same domain, every card of it should have the same fundID
                // eslint-disable-next-line no-param-reassign
                domainFeedData[`${currentCard.fundID}_${currentCard.bank}`] = {
                    fundID: currentCard.fundID,
                    domainName: currentCard.domainName,
                    bank: currentCard?.bank,
                    correspondingCardIDs: [currentCard.cardID?.toString()],
                };
            }
        }
        return domainFeedData;
    }, {});
}
function getDomainFeedData(workspaceCardFeeds) {
    const flattenedWorkspaceCardFeeds = Object.values(workspaceCardFeeds ?? {}).reduce((result, domainCards) => {
        Object.assign(result, domainCards);
        return result;
    }, {});
    return generateDomainFeedData(flattenedWorkspaceCardFeeds);
}
function getWorkspaceCardFeedData(cardFeed, repeatingBanks, translate) {
    const cardFeedArray = Object.values(cardFeed ?? {});
    const representativeCard = cardFeedArray.find((cardFeedItem) => (0, CardUtils_1.isCard)(cardFeedItem));
    if (!representativeCard || !cardFeedArray.some((cardFeedItem) => (0, CardUtils_1.isCard)(cardFeedItem) && !(0, CardUtils_1.isCardHiddenFromSearch)(cardFeedItem))) {
        return;
    }
    const { domainName, bank, cardName } = representativeCard;
    const isBankRepeating = repeatingBanks.includes(bank);
    const policyID = domainName.match(CONST_1.default.REGEX.EXPENSIFY_POLICY_DOMAIN_NAME)?.[1] ?? '';
    // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
    // eslint-disable-next-line deprecation/deprecation
    const correspondingPolicy = (0, PolicyUtils_1.getPolicy)(policyID?.toUpperCase());
    const cardFeedLabel = isBankRepeating ? correspondingPolicy?.name : undefined;
    const isPlaid = !!(0, CardUtils_1.getPlaidInstitutionId)(bank);
    const companyCardBank = isPlaid && cardName ? cardName : (0, CardUtils_1.getBankName)(bank);
    const cardFeedBankName = bank === CONST_1.default.EXPENSIFY_CARD.BANK ? translate('search.filters.card.expensify') : companyCardBank;
    const fullCardName = cardFeedBankName === CONST_1.default.COMPANY_CARDS.CARD_TYPE.CSV
        ? translate('search.filters.card.cardFeedNameCSV', { cardFeedLabel })
        : translate('search.filters.card.cardFeedName', { cardFeedBankName, cardFeedLabel });
    return {
        cardName: fullCardName,
        bank,
        label: cardFeedLabel,
        type: 'workspace',
    };
}
function getDomainCardFeedData(domainFeed, repeatingBanks, translate) {
    const { domainName, bank } = domainFeed;
    const isBankRepeating = repeatingBanks.includes(bank);
    const cardFeedBankName = bank === CONST_1.default.EXPENSIFY_CARD.BANK ? translate('search.filters.card.expensify') : (0, CardUtils_1.getBankName)(bank);
    const cardFeedLabel = isBankRepeating ? (0, PolicyUtils_1.getDescriptionForPolicyDomainCard)(domainName) : undefined;
    const cardName = cardFeedBankName === CONST_1.default.COMPANY_CARDS.CARD_TYPE.CSV
        ? translate('search.filters.card.cardFeedNameCSV', { cardFeedLabel })
        : translate('search.filters.card.cardFeedName', { cardFeedBankName, cardFeedLabel });
    return {
        cardName,
        bank,
        label: cardFeedLabel,
        type: 'domain',
    };
}
function filterOutDomainCards(workspaceCardFeeds) {
    const domainFeedData = getDomainFeedData(workspaceCardFeeds);
    return Object.entries(workspaceCardFeeds ?? {}).filter(([, workspaceFeed]) => {
        const domainFeed = Object.values(workspaceFeed ?? {}).at(0) ?? {};
        if (Object.keys(domainFeedData).includes(`${domainFeed.fundID}_${domainFeed.bank}`)) {
            return false;
        }
        return !(0, EmptyObject_1.isEmptyObject)(workspaceFeed);
    });
}
function getCardFeedsData({ workspaceCardFeeds, translate }) {
    const domainFeedData = getDomainFeedData(workspaceCardFeeds);
    const repeatingBanks = getRepeatingBanks(Object.keys(workspaceCardFeeds ?? CONST_1.default.EMPTY_OBJECT), domainFeedData);
    const cardFeedData = {};
    filterOutDomainCards(workspaceCardFeeds).forEach(([cardFeedKey, cardFeed]) => {
        const workspaceData = getWorkspaceCardFeedData(cardFeed, repeatingBanks, translate);
        if (workspaceData) {
            cardFeedData[cardFeedKey] = workspaceData;
        }
    });
    Object.values(domainFeedData).forEach((domainFeed) => {
        const cardFeedKey = createCardFeedKey(`cards_${domainFeed.fundID}`, domainFeed.bank);
        cardFeedData[cardFeedKey] = getDomainCardFeedData(domainFeed, repeatingBanks, translate);
    });
    return cardFeedData;
}
function getCardFeedNamesWithType(params) {
    const cardFeedData = getCardFeedsData(params);
    return Object.keys(cardFeedData).reduce((cardFeedNamesWithType, cardFeedKey) => {
        /* eslint-disable-next-line no-param-reassign */
        cardFeedNamesWithType[cardFeedKey] = {
            name: cardFeedData[cardFeedKey].cardName,
            type: cardFeedData[cardFeedKey].type,
        };
        return cardFeedNamesWithType;
    }, {});
}
function createCardFeedKey(fundID, bank) {
    if (!fundID) {
        return bank;
    }
    return `${fundID}_${bank}`;
}
function createCardFeedItem({ cardName, bank, keyForList, cardFeedKey, correspondingCardIDs, selectedCards, illustrations, }) {
    const isSelected = correspondingCardIDs.every((card) => selectedCards.includes(card));
    const plaidUrl = (0, CardUtils_1.getPlaidInstitutionIconUrl)(bank);
    const icon = (0, CardUtils_1.getCardFeedIcon)(bank, illustrations);
    return {
        text: cardName,
        keyForList,
        isSelected,
        shouldShowOwnersAvatar: false,
        bankIcon: {
            icon,
        },
        plaidUrl,
        cardFeedKey,
        isCardFeed: true,
        correspondingCards: correspondingCardIDs,
    };
}
function buildCardFeedsData(workspaceCardFeeds, domainFeedsData, selectedCards, translate, illustrations) {
    const selectedFeeds = [];
    const unselectedFeeds = [];
    const repeatingBanks = getRepeatingBanks(Object.keys(workspaceCardFeeds), domainFeedsData);
    Object.values(domainFeedsData).forEach((domainFeed) => {
        const { domainName, bank, correspondingCardIDs } = domainFeed;
        const cardFeedKey = createCardFeedKey(domainFeed.fundID, bank);
        const { cardName } = getDomainCardFeedData(domainFeed, repeatingBanks, translate);
        const feedItem = createCardFeedItem({
            cardName,
            bank,
            correspondingCardIDs,
            keyForList: `${domainName}-${bank}`,
            cardFeedKey,
            selectedCards,
            illustrations,
        });
        if (feedItem.isSelected) {
            selectedFeeds.push(feedItem);
        }
        else {
            unselectedFeeds.push(feedItem);
        }
    });
    filterOutDomainCards(workspaceCardFeeds).forEach(([workspaceFeedKey, workspaceFeed]) => {
        const correspondingCardIDs = Object.entries(workspaceFeed ?? {})
            .filter(([cardKey, card]) => cardKey !== 'cardList' && (0, CardUtils_1.isCard)(card) && !(0, CardUtils_1.isCardHiddenFromSearch)(card))
            .map(([cardKey]) => cardKey);
        const cardFeedData = getWorkspaceCardFeedData(workspaceFeed, repeatingBanks, translate);
        if (!cardFeedData) {
            return;
        }
        const { cardName, bank } = cardFeedData;
        const cardFeedKey = getCardFeedKey(workspaceCardFeeds, workspaceFeedKey);
        const feedItem = createCardFeedItem({
            cardName,
            bank,
            correspondingCardIDs,
            cardFeedKey: cardFeedKey ?? '',
            keyForList: workspaceFeedKey,
            selectedCards,
            illustrations,
        });
        if (feedItem.isSelected) {
            selectedFeeds.push(feedItem);
        }
        else {
            unselectedFeeds.push(feedItem);
        }
    });
    return { selected: selectedFeeds, unselected: unselectedFeeds };
}
function getSelectedCardsFromFeeds(cards, workspaceCardFeeds, selectedFeeds) {
    const domainFeedsData = generateDomainFeedData(cards);
    const domainFeedCards = Object.fromEntries(Object.values(domainFeedsData).map((domainFeedData) => [createCardFeedKey(domainFeedData.fundID, domainFeedData.bank), domainFeedData.correspondingCardIDs]));
    if (!workspaceCardFeeds || !selectedFeeds) {
        return [];
    }
    const selectedCards = selectedFeeds.flatMap((cardFeedKey) => {
        const workspaceCardFeed = workspaceCardFeeds[getWorkspaceCardFeedKey(cardFeedKey)];
        if (!workspaceCardFeed) {
            if (!cards || Object.keys(domainFeedCards).length === 0) {
                return [];
            }
            return domainFeedCards[cardFeedKey].filter((cardNumber) => cards[cardNumber].state !== CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED);
        }
        return Object.keys(workspaceCardFeed).filter((cardNumber) => workspaceCardFeed[cardNumber].state !== CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED);
    });
    return [...new Set(selectedCards)];
}
const generateSelectedCards = (cardList, workspaceCardFeeds, feeds, cards) => {
    const selectedCards = getSelectedCardsFromFeeds(cardList, workspaceCardFeeds, feeds);
    return [...new Set([...selectedCards, ...(cards ?? [])])];
};
exports.generateSelectedCards = generateSelectedCards;
/**
 * Given a collection of card feeds, return formatted card feeds.
 *
 * The `allCards` parameter is only used to determine if we should add the "Expensify Card" feeds.
 */
function getCardFeedsForDisplay(allCardFeeds, allCards) {
    const cardFeedsForDisplay = {};
    Object.entries(allCardFeeds ?? {}).forEach(([domainKey, cardFeeds]) => {
        // sharedNVP_private_domain_member_123456 -> 123456
        const fundID = domainKey.split('_').at(-1);
        if (!fundID) {
            return;
        }
        Object.keys((0, CardUtils_1.getCompanyFeeds)(cardFeeds, true, true)).forEach((key) => {
            const feed = key;
            const id = `${fundID}_${feed}`;
            if (cardFeedsForDisplay[id]) {
                return;
            }
            cardFeedsForDisplay[id] = {
                id,
                feed,
                fundID,
                name: (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, cardFeeds?.settings?.companyCardNicknames, false) ?? feed,
            };
        });
    });
    Object.values(allCards).forEach((card) => {
        if (card.bank !== CONST_1.default.EXPENSIFY_CARD.BANK || !card.fundID) {
            return;
        }
        const id = `${card.fundID}_${CONST_1.default.EXPENSIFY_CARD.BANK}`;
        if (cardFeedsForDisplay[id]) {
            return;
        }
        cardFeedsForDisplay[id] = {
            id,
            feed: CONST_1.default.EXPENSIFY_CARD.BANK,
            fundID: card.fundID,
            name: CONST_1.default.EXPENSIFY_CARD.BANK,
        };
    });
    return cardFeedsForDisplay;
}
/**
 * Given a collection of card feeds, return formatted card feeds grouped per policy.
 *
 * Note: "Expensify Card" feeds are not included.
 */
function getCardFeedsForDisplayPerPolicy(allCardFeeds) {
    const cardFeedsForDisplayPerPolicy = {};
    Object.entries(allCardFeeds ?? {}).forEach(([domainKey, cardFeeds]) => {
        // sharedNVP_private_domain_member_123456 -> 123456
        const fundID = domainKey.split('_').at(-1);
        if (!fundID) {
            return;
        }
        Object.entries((0, CardUtils_1.getCompanyFeeds)(cardFeeds, true, true)).forEach(([key, feedData]) => {
            const preferredPolicy = 'preferredPolicy' in feedData ? (feedData.preferredPolicy ?? '') : '';
            const feed = key;
            const id = `${fundID}_${feed}`;
            (cardFeedsForDisplayPerPolicy[preferredPolicy] || (cardFeedsForDisplayPerPolicy[preferredPolicy] = [])).push({
                id,
                feed,
                fundID,
                name: (0, CardUtils_1.getCustomOrFormattedFeedName)(feed, cardFeeds?.settings?.companyCardNicknames, false) ?? feed,
            });
        });
    });
    return cardFeedsForDisplayPerPolicy;
}
