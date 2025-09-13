"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarSkeleton_1 = require("@components/AvatarSkeleton");
const AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
const Button_1 = require("@components/Button");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemGroup_1 = require("@components/MenuItemGroup");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Section_1 = require("@components/Section");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useScrollEnabled_1 = require("@hooks/useScrollEnabled");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const UserUtils_1 = require("@libs/UserUtils");
const PersonalDetails_1 = require("@userActions/PersonalDetails");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ProfilePage() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { safeAreaPaddingBottomStyle } = (0, useSafeAreaPaddings_1.default)();
    const scrollEnabled = (0, useScrollEnabled_1.default)();
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const route = (0, native_1.useRoute)();
    const [isLoadingApp] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_LOADING_APP, { canBeMissing: false });
    const getPronouns = () => {
        const pronounsKey = currentUserPersonalDetails?.pronouns?.replace(CONST_1.default.PRONOUNS.PREFIX, '') ?? '';
        return pronounsKey ? translate(`pronouns.${pronounsKey}`) : translate('profilePage.selectYourPronouns');
    };
    const avatarURL = currentUserPersonalDetails?.avatar ?? '';
    const accountID = currentUserPersonalDetails?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const contactMethodBrickRoadIndicator = (0, UserUtils_1.getLoginListBrickRoadIndicator)(loginList, session?.email);
    const emojiCode = currentUserPersonalDetails?.status?.emojiCode ?? '';
    const privateDetails = privatePersonalDetails ?? {};
    const legalName = `${privateDetails.legalFirstName ?? ''} ${privateDetails.legalLastName ?? ''}`.trim();
    const [vacationDelegate] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_VACATION_DELEGATE, { canBeMissing: true });
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const publicOptions = [
        {
            description: translate('displayNamePage.headerTitle'),
            title: currentUserPersonalDetails?.displayName ?? '',
            pageRoute: ROUTES_1.default.SETTINGS_DISPLAY_NAME,
        },
        {
            description: translate('contacts.contactMethod'),
            title: formatPhoneNumber(currentUserPersonalDetails?.login ?? ''),
            pageRoute: ROUTES_1.default.SETTINGS_CONTACT_METHODS.route,
            brickRoadIndicator: contactMethodBrickRoadIndicator,
        },
        {
            description: translate('statusPage.status'),
            title: emojiCode ? `${emojiCode} ${currentUserPersonalDetails?.status?.text ?? ''}` : '',
            pageRoute: ROUTES_1.default.SETTINGS_STATUS,
            brickRoadIndicator: (0, EmptyObject_1.isEmptyObject)(vacationDelegate?.errors) ? undefined : CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR,
        },
        {
            description: translate('pronounsPage.pronouns'),
            title: getPronouns(),
            pageRoute: ROUTES_1.default.SETTINGS_PRONOUNS,
        },
        {
            description: translate('timezonePage.timezone'),
            title: currentUserPersonalDetails?.timezone?.selected ?? '',
            pageRoute: ROUTES_1.default.SETTINGS_TIMEZONE,
        },
    ];
    const privateOptions = [
        {
            description: translate('privatePersonalDetails.legalName'),
            title: legalName,
            action: () => {
                if (isActingAsDelegate) {
                    showDelegateNoAccessModal();
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_LEGAL_NAME);
            },
        },
        {
            description: translate('common.dob'),
            title: privateDetails.dob ?? '',
            action: () => {
                if (isActingAsDelegate) {
                    showDelegateNoAccessModal();
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_DATE_OF_BIRTH);
            },
        },
        {
            description: translate('common.phoneNumber'),
            title: privateDetails.phoneNumber ?? '',
            action: () => {
                if (isActingAsDelegate) {
                    showDelegateNoAccessModal();
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_PHONE_NUMBER);
            },
            brickRoadIndicator: privatePersonalDetails?.errorFields?.phoneNumber ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
        },
        {
            description: translate('privatePersonalDetails.address'),
            title: (0, PersonalDetailsUtils_1.getFormattedAddress)(privateDetails),
            action: () => {
                if (isActingAsDelegate) {
                    showDelegateNoAccessModal();
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADDRESS);
            },
        },
    ];
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={ProfilePage.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('common.profile')} onBackButtonPress={() => {
            if (Navigation_1.default.getShouldPopToSidebar()) {
                Navigation_1.default.popToSidebar();
                return;
            }
            Navigation_1.default.goBack(route.params?.backTo);
        }} shouldShowBackButton={shouldUseNarrowLayout} shouldDisplaySearchRouter icon={Illustrations.Profile} shouldUseHeadlineHeader/>
            <ScrollView_1.default style={styles.pt3} contentContainerStyle={safeAreaPaddingBottomStyle} scrollEnabled={scrollEnabled}>
                <MenuItemGroup_1.default>
                    <react_native_1.View style={[styles.flex1, shouldUseNarrowLayout ? styles.workspaceSectionMobile : styles.workspaceSection]}>
                        <Section_1.default title={translate('profilePage.publicSection.title')} subtitle={translate('profilePage.publicSection.subtitle')} isCentralPane subtitleMuted childrenStyles={styles.pt5} titleStyles={styles.accountSettingsSectionTitle}>
                            <react_native_1.View style={[styles.pt3, styles.pb6, styles.alignSelfStart, styles.w100]}>
                                {(0, EmptyObject_1.isEmptyObject)(currentUserPersonalDetails) || accountID === -1 || !avatarURL ? (<AvatarSkeleton_1.default size={CONST_1.default.AVATAR_SIZE.X_LARGE}/>) : (<MenuItemGroup_1.default shouldUseSingleExecution={false}>
                                        <AvatarWithImagePicker_1.default isUsingDefaultAvatar={(0, UserUtils_1.isDefaultAvatar)(currentUserPersonalDetails?.avatar ?? '')} source={avatarURL} avatarID={accountID} onImageSelected={(file) => {
                (0, PersonalDetails_1.updateAvatar)(file, { avatar: currentUserPersonalDetails?.avatar, avatarThumbnail: currentUserPersonalDetails?.avatarThumbnail });
            }} onImageRemoved={() => {
                (0, PersonalDetails_1.deleteAvatar)({ avatar: currentUserPersonalDetails?.avatar, fallbackIcon: currentUserPersonalDetails?.fallbackIcon });
            }} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={[styles.avatarXLarge, styles.alignSelfStart]} pendingAction={currentUserPersonalDetails?.pendingFields?.avatar ?? undefined} errors={currentUserPersonalDetails?.errorFields?.avatar ?? null} errorRowStyles={styles.mt6} onErrorClose={PersonalDetails_1.clearAvatarErrors} onViewPhotoPress={() => Navigation_1.default.navigate(ROUTES_1.default.PROFILE_AVATAR.getRoute(accountID))} previewSource={(0, UserUtils_1.getFullSizeAvatar)(avatarURL, accountID)} originalFileName={currentUserPersonalDetails.originalFileName} headerTitle={translate('profilePage.profileAvatar')} fallbackIcon={currentUserPersonalDetails?.fallbackIcon} editIconStyle={styles.profilePageAvatar}/>
                                    </MenuItemGroup_1.default>)}
                            </react_native_1.View>
                            {publicOptions.map((detail, index) => (<MenuItemWithTopDescription_1.default 
        // eslint-disable-next-line react/no-array-index-key
        key={`${detail.title}_${index}`} shouldShowRightIcon title={detail.title} description={detail.description} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={() => Navigation_1.default.navigate(detail.pageRoute)} brickRoadIndicator={detail.brickRoadIndicator}/>))}
                            <Button_1.default accessibilityLabel={translate('common.shareCode')} text={translate('common.share')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SHARE_CODE)} icon={Expensicons.QrCode} style={[styles.alignSelfStart, styles.mt6]}/>
                        </Section_1.default>
                        <Section_1.default title={translate('profilePage.privateSection.title')} subtitle={translate('profilePage.privateSection.subtitle')} isCentralPane subtitleMuted childrenStyles={styles.pt3} titleStyles={styles.accountSettingsSectionTitle}>
                            {isLoadingApp ? (<FullscreenLoadingIndicator_1.default style={[styles.flex1, styles.pRelative, StyleUtils.getBackgroundColorStyle(theme.cardBG)]}/>) : (<MenuItemGroup_1.default shouldUseSingleExecution={!isActingAsDelegate}>
                                    {privateOptions.map((detail, index) => (<MenuItemWithTopDescription_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`${detail.title}_${index}`} shouldShowRightIcon title={detail.title} description={detail.description} wrapperStyle={styles.sectionMenuItemTopDescription} onPress={detail.action} brickRoadIndicator={detail.brickRoadIndicator}/>))}
                                </MenuItemGroup_1.default>)}
                        </Section_1.default>
                    </react_native_1.View>
                </MenuItemGroup_1.default>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ProfilePage.displayName = 'ProfilePage';
exports.default = ProfilePage;
