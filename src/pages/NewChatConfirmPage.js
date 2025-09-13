"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AvatarWithImagePicker_1 = require("@components/AvatarWithImagePicker");
const Badge_1 = require("@components/Badge");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const InviteMemberListItem_1 = require("@components/SelectionList/InviteMemberListItem");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OptionsListUtils_1 = require("@libs/OptionsListUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function navigateBack() {
    Navigation_1.default.goBack(ROUTES_1.default.NEW_CHAT);
}
function navigateToEditChatName() {
    Navigation_1.default.navigate(ROUTES_1.default.NEW_CHAT_EDIT_NAME);
}
function NewChatConfirmPage() {
    const optimisticReportID = (0, react_1.useRef)((0, ReportUtils_1.generateReportID)());
    const [avatarFile, setAvatarFile] = (0, react_1.useState)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const personalData = (0, useCurrentUserPersonalDetails_1.default)();
    const [newGroupDraft, newGroupDraftMetaData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NEW_GROUP_CHAT_DRAFT, { canBeMissing: true });
    const [allPersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, { canBeMissing: false });
    const selectedOptions = (0, react_1.useMemo)(() => {
        if (!newGroupDraft?.participants) {
            return [];
        }
        const options = newGroupDraft.participants.map((participant) => (0, OptionsListUtils_1.getParticipantsOption)({ accountID: participant.accountID, login: participant?.login, reportID: '' }, allPersonalDetails));
        return options;
    }, [allPersonalDetails, newGroupDraft?.participants]);
    const groupName = newGroupDraft?.reportName ? newGroupDraft?.reportName : (0, ReportUtils_1.getGroupChatName)(newGroupDraft?.participants);
    const sections = (0, react_1.useMemo)(() => selectedOptions
        .map((selectedOption) => {
        const accountID = selectedOption.accountID;
        const isAdmin = personalData.accountID === accountID;
        const section = {
            login: selectedOption?.login ?? '',
            text: selectedOption?.text ?? '',
            keyForList: selectedOption?.keyForList ?? '',
            isSelected: !isAdmin,
            isDisabled: isAdmin,
            accountID,
            icons: selectedOption?.icons,
            alternateText: selectedOption?.login ?? '',
            rightElement: isAdmin ? <Badge_1.default text={translate('common.admin')}/> : undefined,
        };
        return section;
    })
        .sort((a, b) => localeCompare(a.text?.toLowerCase() ?? '', b.text?.toLowerCase() ?? '')), [selectedOptions, personalData.accountID, translate, localeCompare]);
    /**
     * Removes a selected option from list if already selected.
     */
    const unselectOption = (0, react_1.useCallback)((option) => {
        if (!newGroupDraft) {
            return;
        }
        const newSelectedParticipants = (newGroupDraft.participants ?? []).filter((participant) => participant?.login !== option.login);
        (0, Report_1.setGroupDraft)({ participants: newSelectedParticipants });
    }, [newGroupDraft]);
    const createGroup = (0, react_1.useCallback)(() => {
        if (!newGroupDraft) {
            return;
        }
        const logins = (newGroupDraft.participants ?? []).map((participant) => participant.login).filter((login) => !!login);
        (0, Report_1.navigateToAndOpenReport)(logins, true, newGroupDraft.reportName ?? '', newGroupDraft.avatarUri ?? '', avatarFile, optimisticReportID.current, true);
    }, [newGroupDraft, avatarFile]);
    const stashedLocalAvatarImage = newGroupDraft?.avatarUri;
    (0, react_1.useEffect)(() => {
        if (!stashedLocalAvatarImage || (0, isLoadingOnyxValue_1.default)(newGroupDraftMetaData)) {
            return;
        }
        const onSuccess = (file) => {
            setAvatarFile(file);
        };
        const onFailure = () => {
            setAvatarFile(undefined);
            (0, Report_1.setGroupDraft)({ avatarUri: null, avatarFileName: null, avatarFileType: null });
        };
        // If the user navigates back to the member selection page and then returns to the confirmation page, the component will re-mount, causing avatarFile to be null.
        // To handle this, we re-read the avatar image file from disk whenever the component re-mounts.
        (0, FileUtils_1.readFileAsync)(stashedLocalAvatarImage, newGroupDraft?.avatarFileName ?? '', onSuccess, onFailure, newGroupDraft?.avatarFileType ?? '');
        // we only need to run this when the component re-mounted and when the onyx is loaded completely
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [newGroupDraftMetaData]);
    return (<ScreenWrapper_1.default testID={NewChatConfirmPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('common.group')} onBackButtonPress={navigateBack}/>
            <react_native_1.View style={styles.avatarSectionWrapper}>
                <AvatarWithImagePicker_1.default isUsingDefaultAvatar={!stashedLocalAvatarImage} 
    // eslint-disable-next-line react-compiler/react-compiler
    source={stashedLocalAvatarImage ?? (0, ReportUtils_1.getDefaultGroupAvatar)(optimisticReportID.current)} onImageSelected={(image) => {
            setAvatarFile(image);
            (0, Report_1.setGroupDraft)({ avatarUri: image.uri ?? '', avatarFileName: image.name ?? '', avatarFileType: image.type });
        }} onImageRemoved={() => {
            setAvatarFile(undefined);
            (0, Report_1.setGroupDraft)({ avatarUri: null, avatarFileName: null, avatarFileType: null });
        }} size={CONST_1.default.AVATAR_SIZE.X_LARGE} avatarStyle={styles.avatarXLarge} shouldDisableViewPhoto editIcon={Expensicons.Camera} editIconStyle={styles.smallEditIconAccount} style={styles.w100}/>
            </react_native_1.View>
            <MenuItemWithTopDescription_1.default title={groupName} onPress={navigateToEditChatName} shouldShowRightIcon shouldCheckActionAllowedOnPress={false} description={translate('newRoomPage.groupName')} wrapperStyle={[styles.ph4]}/>
            <react_native_1.View style={[styles.flex1, styles.mt3]}>
                <SelectionList_1.default canSelectMultiple sections={[{ title: translate('common.members'), data: sections }]} ListItem={InviteMemberListItem_1.default} onSelectRow={unselectOption} showConfirmButton={!!selectedOptions.length} confirmButtonText={translate('newChatPage.startGroup')} onConfirm={createGroup} shouldHideListOnInitialRender={false}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
NewChatConfirmPage.displayName = 'NewChatConfirmPage';
exports.default = NewChatConfirmPage;
