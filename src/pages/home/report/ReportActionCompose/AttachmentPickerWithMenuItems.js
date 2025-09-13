"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AttachmentPicker_1 = require("@components/AttachmentPicker");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const FullScreenLoaderContext_1 = require("@components/FullScreenLoaderContext");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PopoverMenu_1 = require("@components/PopoverMenu");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const PopoverAnchorTooltip_1 = require("@components/Tooltip/PopoverAnchorTooltip");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const usePrevious_1 = require("@hooks/usePrevious");
const useReportIsArchived_1 = require("@hooks/useReportIsArchived");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const getIconForAction_1 = require("@libs/getIconForAction");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const IOU_1 = require("@userActions/IOU");
const Modal_1 = require("@userActions/Modal");
const Report_1 = require("@userActions/Report");
const Task_1 = require("@userActions/Task");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
/**
 * This includes the popover of options you see when pressing the + button in the composer.
 * It also contains the attachment picker, as the menu items need to be able to open it.
 */
function AttachmentPickerWithMenuItems({ report, currentUserPersonalDetails, reportParticipantIDs, displayFilesInModal, isFullComposerAvailable, isComposerFullSize, reportID, disabled, setMenuVisibility, isMenuVisible, onTriggerAttachmentPicker, onCanceledAttachmentPicker, onMenuClosed, onAddActionPressed, onItemSelected, actionButtonRef, raiseIsScrollLikelyLayoutTriggered, shouldDisableAttachmentItem, }) {
    const isFocused = (0, native_1.useIsFocused)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { windowHeight, windowWidth } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isDelegateAccessRestricted, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${report?.policyID}`, { canBeMissing: true });
    const [lastDistanceExpenseType] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DISTANCE_EXPENSE_TYPE, { canBeMissing: true });
    const { isProduction } = (0, useEnvironment_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const { setIsLoaderVisible } = (0, FullScreenLoaderContext_1.useFullScreenLoader)();
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const isManualDistanceTrackingEnabled = isBetaEnabled(CONST_1.default.BETAS.MANUAL_DISTANCE);
    const selectOption = (0, react_1.useCallback)((onSelected, shouldRestrictAction) => {
        if (shouldRestrictAction && policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
            Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
            return;
        }
        onSelected();
    }, [policy]);
    const teacherUnitePolicyID = isProduction ? CONST_1.default.TEACHERS_UNITE.PROD_POLICY_ID : CONST_1.default.TEACHERS_UNITE.TEST_POLICY_ID;
    const isTeachersUniteReport = report?.policyID === teacherUnitePolicyID;
    /**
     * Returns the list of IOU Options
     */
    const moneyRequestOptions = (0, react_1.useMemo)(() => {
        const options = {
            [CONST_1.default.IOU.TYPE.SPLIT]: [
                {
                    icon: Expensicons.Transfer,
                    text: translate('iou.splitExpense'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SPLIT, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID)), true),
                },
            ],
            [CONST_1.default.IOU.TYPE.SUBMIT]: [
                {
                    icon: (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.CREATE),
                    text: translate('iou.createExpense'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.SUBMIT, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID)), true),
                },
                ...(isManualDistanceTrackingEnabled
                    ? [
                        {
                            icon: Expensicons.Location,
                            text: translate('quickAction.recordDistance'),
                            shouldCallAfterModalHide: shouldUseNarrowLayout,
                            onSelected: () => selectOption(() => (0, IOU_1.startDistanceRequest)(CONST_1.default.IOU.TYPE.SUBMIT, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID), lastDistanceExpenseType), true),
                        },
                    ]
                    : []),
            ],
            [CONST_1.default.IOU.TYPE.PAY]: [
                {
                    icon: (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.SEND),
                    text: translate('iou.paySomeone', { name: (0, ReportUtils_1.getPayeeName)(report) }),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => {
                        if (isDelegateAccessRestricted) {
                            (0, Modal_1.close)(() => {
                                showDelegateNoAccessModal();
                            });
                            return;
                        }
                        selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.PAY, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID)), false);
                    },
                },
            ],
            [CONST_1.default.IOU.TYPE.TRACK]: [
                {
                    icon: (0, getIconForAction_1.default)(CONST_1.default.IOU.TYPE.CREATE),
                    text: translate('iou.createExpense'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.TRACK, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID)), true),
                },
                ...(isManualDistanceTrackingEnabled
                    ? [
                        {
                            icon: Expensicons.Location,
                            text: translate('iou.trackDistance'),
                            shouldCallAfterModalHide: shouldUseNarrowLayout,
                            onSelected: () => selectOption(() => (0, IOU_1.startDistanceRequest)(CONST_1.default.IOU.TYPE.TRACK, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID), lastDistanceExpenseType), true),
                        },
                    ]
                    : []),
            ],
            [CONST_1.default.IOU.TYPE.INVOICE]: [
                {
                    icon: Expensicons.InvoiceGeneric,
                    text: translate('workspace.invoices.sendInvoice'),
                    shouldCallAfterModalHide: shouldUseNarrowLayout,
                    onSelected: () => selectOption(() => (0, IOU_1.startMoneyRequest)(CONST_1.default.IOU.TYPE.INVOICE, report?.reportID ?? String(CONST_1.default.DEFAULT_NUMBER_ID)), false),
                },
            ],
        };
        const moneyRequestOptionsList = (0, ReportUtils_1.temporary_getMoneyRequestOptions)(report, policy, reportParticipantIDs ?? []).map((option) => options[option], isReportArchived);
        return moneyRequestOptionsList.flat().filter((item, index, self) => index === self.findIndex((t) => t.text === item.text));
    }, [
        translate,
        shouldUseNarrowLayout,
        report,
        policy,
        reportParticipantIDs,
        selectOption,
        isDelegateAccessRestricted,
        showDelegateNoAccessModal,
        isManualDistanceTrackingEnabled,
        isReportArchived,
        lastDistanceExpenseType,
    ]);
    const createReportOption = (0, react_1.useMemo)(() => {
        if (!(0, ReportUtils_1.isPolicyExpenseChat)(report) || !(0, ReportUtils_1.isPaidGroupPolicy)(report) || !(0, ReportUtils_1.isReportOwner)(report)) {
            return [];
        }
        return [
            {
                icon: Expensicons.Document,
                text: translate('report.newReport.createReport'),
                onSelected: () => selectOption(() => (0, Report_1.createNewReport)(currentUserPersonalDetails, report?.policyID, true), true),
            },
        ];
    }, [currentUserPersonalDetails, report, selectOption, translate]);
    /**
     * Determines if we can show the task option
     */
    const taskOption = (0, react_1.useMemo)(() => {
        if (!(0, ReportUtils_1.canCreateTaskInReport)(report)) {
            return [];
        }
        return [
            {
                icon: Expensicons.Task,
                text: translate('newTaskPage.assignTask'),
                shouldCallAfterModalHide: shouldUseNarrowLayout,
                onSelected: () => (0, Task_1.clearOutTaskInfoAndNavigate)(reportID, report),
            },
        ];
    }, [report, reportID, translate, shouldUseNarrowLayout]);
    const onPopoverMenuClose = () => {
        setMenuVisibility(false);
        onMenuClosed?.();
    };
    const prevIsFocused = (0, usePrevious_1.default)(isFocused);
    /**
     * Check if current screen is inactive and previous screen is active.
     * Used to close already opened popover menu when any other page is opened over current page.
     *
     * @return {Boolean}
     */
    const didScreenBecomeInactive = (0, react_1.useCallback)(() => !isFocused && prevIsFocused, [isFocused, prevIsFocused]);
    // When the navigation is focused, we want to close the popover menu.
    (0, react_1.useEffect)(() => {
        if (!didScreenBecomeInactive() || !isMenuVisible) {
            return;
        }
        setMenuVisibility(false);
    }, [didScreenBecomeInactive, isMenuVisible, setMenuVisibility]);
    // 1. Limit the container width to a single column.
    const outerContainerStyles = [{ flexBasis: styles.composerSizeButton.width + styles.composerSizeButton.marginHorizontal * 2 }, styles.flexGrow0, styles.flexShrink0];
    // 2. If there isn't enough height for two buttons, the Expand/Collapse button wraps to the next column so that it's intentionally hidden,
    //    and the Create button is centered vertically.
    const innerContainerStyles = [
        styles.dFlex,
        styles.flexColumnReverse,
        styles.flexWrap,
        styles.justifyContentCenter,
        styles.pAbsolute,
        styles.h100,
        styles.w100,
        styles.overflowHidden,
        { paddingVertical: styles.composerSizeButton.marginHorizontal },
    ];
    // 3. If there is enough height for two buttons, the Expand/Collapse button is at the top.
    const expandCollapseButtonContainerStyles = [styles.flexGrow1, styles.flexShrink0];
    // 4. And the Create button is at the bottom.
    const createButtonContainerStyles = [styles.flexGrow0, styles.flexShrink0];
    return (<AttachmentPicker_1.default allowMultiple onOpenPicker={() => setIsLoaderVisible(true)} fileLimit={CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_FILE_LIMIT} shouldValidateImage={false}>
            {({ openPicker }) => {
            const triggerAttachmentPicker = () => {
                onTriggerAttachmentPicker();
                openPicker({
                    onPicked: (data) => displayFilesInModal(data),
                    onCanceled: () => {
                        onCanceledAttachmentPicker?.();
                        setIsLoaderVisible(false);
                    },
                    onClosed: () => setIsLoaderVisible(false),
                });
            };
            const menuItems = [
                ...moneyRequestOptions,
                ...(!isTeachersUniteReport ? createReportOption : []),
                ...taskOption,
                {
                    icon: Expensicons.Paperclip,
                    text: translate('reportActionCompose.addAttachment'),
                    disabled: shouldDisableAttachmentItem,
                },
            ];
            return (<>
                        <react_native_1.View style={outerContainerStyles}>
                            <react_native_1.View style={innerContainerStyles}>
                                <react_native_1.View style={createButtonContainerStyles}>
                                    <PopoverAnchorTooltip_1.default text={translate('common.create')}>
                                        <PressableWithFeedback_1.default ref={actionButtonRef} onPress={(e) => {
                    e?.preventDefault();
                    if (!isFocused) {
                        return;
                    }
                    onAddActionPressed();
                    // Drop focus to avoid blue focus ring.
                    actionButtonRef.current?.blur();
                    setMenuVisibility(!isMenuVisible);
                }} style={styles.composerSizeButton} disabled={disabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.create')}>
                                            <Icon_1.default fill={theme.icon} src={Expensicons.Plus}/>
                                        </PressableWithFeedback_1.default>
                                    </PopoverAnchorTooltip_1.default>
                                </react_native_1.View>
                                {(isFullComposerAvailable || isComposerFullSize) && (<react_native_1.View style={expandCollapseButtonContainerStyles}>
                                        {isComposerFullSize ? (<PopoverAnchorTooltip_1.default text={translate('reportActionCompose.collapse')} key="composer-collapse">
                                                <PressableWithFeedback_1.default onPress={(e) => {
                            e?.preventDefault();
                            raiseIsScrollLikelyLayoutTriggered();
                            (0, Report_1.setIsComposerFullSize)(reportID, false);
                        }} 
                    // Keep focus on the composer when Collapse button is clicked.
                    onMouseDown={(e) => e.preventDefault()} style={styles.composerSizeButton} disabled={disabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('reportActionCompose.collapse')}>
                                                    <Icon_1.default fill={theme.icon} src={Expensicons.Collapse}/>
                                                </PressableWithFeedback_1.default>
                                            </PopoverAnchorTooltip_1.default>) : (<PopoverAnchorTooltip_1.default text={translate('reportActionCompose.expand')} key="composer-expand">
                                                <PressableWithFeedback_1.default onPress={(e) => {
                            e?.preventDefault();
                            raiseIsScrollLikelyLayoutTriggered();
                            (0, Report_1.setIsComposerFullSize)(reportID, true);
                        }} 
                    // Keep focus on the composer when Expand button is clicked.
                    onMouseDown={(e) => e.preventDefault()} style={styles.composerSizeButton} disabled={disabled} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('reportActionCompose.expand')}>
                                                    <Icon_1.default fill={theme.icon} src={Expensicons.Expand}/>
                                                </PressableWithFeedback_1.default>
                                            </PopoverAnchorTooltip_1.default>)}
                                    </react_native_1.View>)}
                            </react_native_1.View>
                        </react_native_1.View>
                        <PopoverMenu_1.default animationInTiming={menuItems.length * 50} 
            // The menu should close 2/3 of the time it took to open
            animationOutTiming={menuItems.length * 50 * 0.66} isVisible={isMenuVisible && isFocused} onClose={onPopoverMenuClose} onItemSelected={(item, index) => {
                    setMenuVisibility(false);
                    onItemSelected();
                    // In order for the file picker to open dynamically, the click
                    // function must be called from within a event handler that was initiated
                    // by the user on Safari.
                    if (index === menuItems.length - 1) {
                        if ((0, Browser_1.isSafari)()) {
                            triggerAttachmentPicker();
                            return;
                        }
                        (0, Modal_1.close)(() => {
                            triggerAttachmentPicker();
                        });
                    }
                }} anchorPosition={styles.createMenuPositionReportActionCompose(shouldUseNarrowLayout, windowHeight, windowWidth)} anchorAlignment={{
                    horizontal: CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                    vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
                }} menuItems={menuItems} anchorRef={actionButtonRef}/>
                    </>);
        }}
        </AttachmentPicker_1.default>);
}
AttachmentPickerWithMenuItems.displayName = 'AttachmentPickerWithMenuItems';
exports.default = AttachmentPickerWithMenuItems;
