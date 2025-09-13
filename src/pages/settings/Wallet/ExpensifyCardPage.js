"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const index_1 = require("@components/AddToWalletButton/index");
const Button_1 = require("@components/Button");
const CardPreview_1 = require("@components/CardPreview");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const LockedAccountModalProvider_1 = require("@components/LockedAccountModalProvider");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const ValidateCodeActionModal_1 = require("@components/ValidateCodeActionModal");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const Card_1 = require("@userActions/Card");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const RedDotCardSection_1 = require("./RedDotCardSection");
const CardDetails_1 = require("./WalletPage/CardDetails");
function getLimitTypeTranslationKeys(limitType) {
    switch (limitType) {
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.SMART:
            return { limitNameKey: 'cardPage.smartLimit.name', limitTitleKey: 'cardPage.smartLimit.title' };
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.MONTHLY:
            return { limitNameKey: 'cardPage.monthlyLimit.name', limitTitleKey: 'cardPage.monthlyLimit.title' };
        case CONST_1.default.EXPENSIFY_CARD.LIMIT_TYPES.FIXED:
            return { limitNameKey: 'cardPage.fixedLimit.name', limitTitleKey: 'cardPage.fixedLimit.title' };
        default:
            return { limitNameKey: undefined, limitTitleKey: undefined };
    }
}
function ExpensifyCardPage({ route: { params: { cardID = '' }, }, }) {
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [cardList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CARD_LIST, { canBeMissing: false });
    const [currencyList = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: true });
    const [pin] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACTIVATED_CARD_PIN, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isValidateCodeActionModalVisible, setIsValidateCodeActionModalVisible] = (0, react_1.useState)(false);
    const [currentCardID, setCurrentCardID] = (0, react_1.useState)(-1);
    const isTravelCard = cardList?.[cardID]?.nameValuePairs?.isTravelCard;
    const shouldDisplayCardDomain = !isTravelCard && (!cardList?.[cardID]?.nameValuePairs?.issuedBy || !cardList?.[cardID]?.nameValuePairs?.isVirtual);
    const domain = cardList?.[cardID]?.domainName ?? '';
    const expensifyCardTitle = isTravelCard ? translate('cardPage.expensifyTravelCard') : translate('cardPage.expensifyCard');
    const pageTitle = shouldDisplayCardDomain ? expensifyCardTitle : (cardList?.[cardID]?.nameValuePairs?.cardTitle ?? expensifyCardTitle);
    const { displayName } = (0, useCurrentUserPersonalDetails_1.default)();
    const [isNotFound, setIsNotFound] = (0, react_1.useState)(false);
    const cardsToShow = (0, react_1.useMemo)(() => {
        if (shouldDisplayCardDomain) {
            return (0, CardUtils_1.getDomainCards)(cardList)[domain]?.filter((card) => !card?.nameValuePairs?.issuedBy || !card?.nameValuePairs?.isVirtual) ?? [];
        }
        return [cardList?.[cardID]];
    }, [shouldDisplayCardDomain, cardList, cardID, domain]);
    (0, useBeforeRemove_1.default)(() => setIsValidateCodeActionModalVisible(false));
    (0, react_1.useEffect)(() => {
        return () => {
            if (!pin) {
                return;
            }
            (0, Card_1.clearActivatedCardPin)();
        };
    }, [pin]);
    (0, react_1.useEffect)(() => {
        setIsNotFound(!cardsToShow);
    }, [cardList, cardsToShow]);
    (0, react_1.useEffect)(() => {
        (0, User_1.resetValidateActionCodeSent)();
    }, []);
    const virtualCards = (0, react_1.useMemo)(() => cardsToShow?.filter((card) => card?.nameValuePairs?.isVirtual && !card?.nameValuePairs?.isTravelCard), [cardsToShow]);
    const travelCards = (0, react_1.useMemo)(() => cardsToShow?.filter((card) => card?.nameValuePairs?.isVirtual && card?.nameValuePairs?.isTravelCard), [cardsToShow]);
    const physicalCards = (0, react_1.useMemo)(() => cardsToShow?.filter((card) => !card?.nameValuePairs?.isVirtual), [cardsToShow]);
    const cardToAdd = (0, react_1.useMemo)(() => {
        return virtualCards?.at(0);
    }, [virtualCards]);
    const [cardsDetails, setCardsDetails] = (0, react_1.useState)({});
    const [isCardDetailsLoading, setIsCardDetailsLoading] = (0, react_1.useState)({});
    const [cardsDetailsErrors, setCardsDetailsErrors] = (0, react_1.useState)({});
    const [validateError, setValidateError] = (0, react_1.useState)({});
    const { isAccountLocked, showLockedAccountModal } = (0, react_1.useContext)(LockedAccountModalProvider_1.LockedAccountContext);
    const openValidateCodeModal = (revealedCardID) => {
        setCurrentCardID(revealedCardID);
        setIsValidateCodeActionModalVisible(true);
    };
    const handleRevealDetails = (validateCode) => {
        setIsCardDetailsLoading((prevState) => ({
            ...prevState,
            [currentCardID]: true,
        }));
        // We can't store the response in Onyx for security reasons.
        // That is why this action is handled manually and the response is stored in a local state
        // Hence eslint disable here.
        // eslint-disable-next-line rulesdir/no-thenable-actions-in-views
        (0, Card_1.revealVirtualCardDetails)(currentCardID, validateCode)
            .then((value) => {
            setCardsDetails((prevState) => ({ ...prevState, [currentCardID]: value }));
            setCardsDetailsErrors((prevState) => ({
                ...prevState,
                [currentCardID]: '',
            }));
            setIsValidateCodeActionModalVisible(false);
        })
            .catch((error) => {
            // Displaying magic code errors is handled in the modal, no need to set it on the card
            // TODO: remove setValidateError once backend deploys https://github.com/Expensify/Web-Expensify/pull/46007
            if (error === 'validateCodeForm.error.incorrectMagicCode') {
                setValidateError(() => (0, ErrorUtils_1.getMicroSecondOnyxErrorWithTranslationKey)('validateCodeForm.error.incorrectMagicCode'));
                return;
            }
            setCardsDetailsErrors((prevState) => ({
                ...prevState,
                [currentCardID]: error,
            }));
            setIsValidateCodeActionModalVisible(false);
        })
            .finally(() => {
            setIsCardDetailsLoading((prevState) => ({ ...prevState, [currentCardID]: false }));
        });
    };
    const hasDetectedDomainFraud = cardsToShow?.some((card) => card?.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.DOMAIN);
    const hasDetectedIndividualFraud = cardsToShow?.some((card) => card?.fraud === CONST_1.default.EXPENSIFY_CARD.FRAUD_TYPES.INDIVIDUAL);
    const currentPhysicalCard = physicalCards?.find((card) => String(card?.cardID) === cardID);
    // Cards that are already activated and working (OPEN) and cards shipped but not activated yet can be reported as missing or damaged
    const shouldShowReportLostCardButton = currentPhysicalCard?.state === CONST_1.default.EXPENSIFY_CARD.STATE.NOT_ACTIVATED || currentPhysicalCard?.state === CONST_1.default.EXPENSIFY_CARD.STATE.OPEN;
    const currency = (0, CurrencyUtils_1.getCurrencyKeyByCountryCode)(currencyList, cardsToShow?.at(0)?.nameValuePairs?.feedCountry);
    const formattedAvailableSpendAmount = (0, CurrencyUtils_1.convertToDisplayString)(cardsToShow?.at(0)?.availableSpend, currency);
    const { limitNameKey, limitTitleKey } = getLimitTypeTranslationKeys(cardsToShow?.at(0)?.nameValuePairs?.limitType);
    const primaryLogin = account?.primaryLogin ?? '';
    const isSignedInAsDelegate = !!account?.delegatedAccess?.delegate || false;
    if (isNotFound) {
        return <NotFoundPage_1.default onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET)}/>;
    }
    return (<ScreenWrapper_1.default testID={ExpensifyCardPage.displayName}>
            <HeaderWithBackButton_1.default title={pageTitle} onBackButtonPress={() => Navigation_1.default.closeRHPFlow()}/>
            <ScrollView_1.default>
                <react_native_1.View style={[styles.flex1, styles.mb9, styles.mt9]}>
                    <CardPreview_1.default />
                </react_native_1.View>

                {hasDetectedDomainFraud && (<DotIndicatorMessage_1.default style={styles.pageWrapper} textStyles={styles.walletLockedMessage} messages={{ error: translate('cardPage.cardLocked') }} type="error"/>)}

                {hasDetectedIndividualFraud && !hasDetectedDomainFraud && (<>
                        <RedDotCardSection_1.default title={translate('cardPage.suspiciousBannerTitle')} description={translate('cardPage.suspiciousBannerDescription')}/>

                        <Button_1.default style={[styles.mh5, styles.mb5]} text={translate('cardPage.reviewTransaction')} onPress={() => (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX)}/>
                    </>)}

                {!hasDetectedDomainFraud && (<>
                        <MenuItemWithTopDescription_1.default description={translate('cardPage.availableSpend')} title={formattedAvailableSpendAmount} interactive={false} titleStyle={styles.newKansasLarge}/>
                        {!!limitNameKey && !!limitTitleKey && (<MenuItemWithTopDescription_1.default description={translate(limitNameKey)} title={translate(limitTitleKey, { formattedLimit: formattedAvailableSpendAmount })} interactive={false} titleStyle={styles.walletCardLimit} numberOfLinesTitle={3}/>)}
                        {virtualCards.map((card) => (<>
                                {!!cardsDetails[card.cardID] && cardsDetails[card.cardID]?.pan ? (<CardDetails_1.default pan={cardsDetails[card.cardID]?.pan} expiration={(0, CardUtils_1.formatCardExpiration)(cardsDetails[card.cardID]?.expiration ?? '')} cvv={cardsDetails[card.cardID]?.cvv} domain={domain}/>) : (<>
                                        <MenuItemWithTopDescription_1.default description={translate('cardPage.virtualCardNumber')} title={(0, CardUtils_1.maskCard)('')} interactive={false} titleStyle={styles.walletCardNumber} shouldShowRightComponent rightComponent={!isSignedInAsDelegate ? (<Button_1.default text={translate('cardPage.cardDetails.revealDetails')} onPress={() => {
                            if (isAccountLocked) {
                                showLockedAccountModal();
                                return;
                            }
                            openValidateCodeModal(card.cardID);
                        }} isDisabled={isCardDetailsLoading[card.cardID] || isOffline} isLoading={isCardDetailsLoading[card.cardID]}/>) : undefined}/>
                                        <DotIndicatorMessage_1.default messages={cardsDetailsErrors[card.cardID] ? { error: translate(cardsDetailsErrors[card.cardID]) } : {}} type="error" style={[styles.ph5]}/>
                                    </>)}
                                {!isSignedInAsDelegate && (<MenuItemWithTopDescription_1.default title={translate('cardPage.reportFraud')} titleStyle={styles.walletCardMenuItem} icon={Expensicons.Flag} shouldShowRightIcon onPress={() => {
                        if (isAccountLocked) {
                            showLockedAccountModal();
                            return;
                        }
                        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_REPORT_FRAUD.getRoute(String(card.cardID), Navigation_1.default.getActiveRoute()));
                    }}/>)}
                            </>))}
                        {isTravelCard &&
                travelCards.map((card) => (<>
                                    {!!cardsDetails[card.cardID] && cardsDetails[card.cardID]?.cvv ? (<CardDetails_1.default cvv={cardsDetails[card.cardID]?.cvv} domain={domain}/>) : (<>
                                            <MenuItemWithTopDescription_1.default description={translate('cardPage.travelCardCvv')} title="•••" interactive={false} titleStyle={styles.walletCardNumber} shouldShowRightComponent rightComponent={!isSignedInAsDelegate ? (<Button_1.default text={translate('cardPage.cardDetails.revealCvv')} onPress={() => openValidateCodeModal(card.cardID)} isDisabled={isCardDetailsLoading[card.cardID] || isOffline} isLoading={isCardDetailsLoading[card.cardID]}/>) : undefined}/>
                                            <DotIndicatorMessage_1.default messages={cardsDetailsErrors[card.cardID] ? { error: translate(cardsDetailsErrors[card.cardID]) } : {}} type="error" style={[styles.ph5]}/>
                                        </>)}
                                    {!isSignedInAsDelegate && (<MenuItemWithTopDescription_1.default title={translate('cardPage.reportTravelFraud')} titleStyle={styles.walletCardMenuItem} icon={Expensicons.Flag} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_REPORT_FRAUD.getRoute(String(card.cardID), Navigation_1.default.getActiveRoute()))}/>)}
                                </>))}
                        {shouldShowReportLostCardButton && (<>
                                <MenuItemWithTopDescription_1.default description={translate('cardPage.physicalCardNumber')} title={(0, CardUtils_1.maskCard)(currentPhysicalCard?.lastFourPAN)} interactive={false} titleStyle={styles.walletCardNumber}/>
                                <MenuItemWithTopDescription_1.default description={translate('cardPage.physicalCardPin')} title={(0, CardUtils_1.maskPin)(pin)} interactive={false} titleStyle={styles.walletCardNumber}/>
                                <MenuItem_1.default title={translate('reportCardLostOrDamaged.screenTitle')} icon={Expensicons.Flag} shouldShowRightIcon onPress={() => {
                    if (isAccountLocked) {
                        showLockedAccountModal();
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_REPORT_CARD_LOST_OR_DAMAGED.getRoute(String(currentPhysicalCard?.cardID)));
                }}/>
                            </>)}
                        <MenuItem_1.default icon={Expensicons.MoneySearch} title={translate('workspace.common.viewTransactions')} style={styles.mt3} onPress={() => {
                Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                    query: (0, SearchQueryUtils_1.buildCannedSearchQuery)({ type: CONST_1.default.SEARCH.DATA_TYPES.EXPENSE, status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL, cardID }),
                }));
            }}/>
                    </>)}
                {cardToAdd !== undefined && (<index_1.default card={cardToAdd} buttonStyle={styles.alignSelfCenter} cardHolderName={displayName ?? ''} cardDescription={expensifyCardTitle}/>)}
            </ScrollView_1.default>
            {currentPhysicalCard?.state === CONST_1.default.EXPENSIFY_CARD.STATE.NOT_ACTIVATED && (<Button_1.default success large style={[styles.w100, styles.p5]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_CARD_ACTIVATE.getRoute(String(currentPhysicalCard?.cardID)))} text={translate('activateCardPage.activatePhysicalCard')}/>)}
            {currentPhysicalCard?.state === CONST_1.default.EXPENSIFY_CARD.STATE.STATE_NOT_ISSUED && (<Button_1.default success large text={translate('cardPage.getPhysicalCard')} pressOnEnter onPress={() => Navigation_1.default.navigate(ROUTES_1.default.MISSING_PERSONAL_DETAILS)} style={[styles.mh5, styles.mb5]}/>)}
            <ValidateCodeActionModal_1.default handleSubmitForm={handleRevealDetails} clearError={() => setValidateError({})} validateError={validateError} validateCodeActionErrorField="revealExpensifyCardDetails" sendValidateCode={() => (0, User_1.requestValidateCodeAction)()} onClose={() => {
            setIsValidateCodeActionModalVisible(false);
            (0, User_1.resetValidateActionCodeSent)();
        }} isVisible={isValidateCodeActionModalVisible} title={translate('cardPage.validateCardTitle')} descriptionPrimary={translate('cardPage.enterMagicCode', { contactMethod: primaryLogin })}/>
        </ScreenWrapper_1.default>);
}
ExpensifyCardPage.displayName = 'ExpensifyCardPage';
exports.default = ExpensifyCardPage;
