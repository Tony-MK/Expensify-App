"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const useSubStep_1 = require("@hooks/useSubStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Connections = require("@libs/actions/connections/NetSuiteCommands");
const FormActions = require("@libs/actions/FormActions");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const NetSuiteCustomFieldForm_1 = require("@src/types/form/NetSuiteCustomFieldForm");
const customUtils_1 = require("./customUtils");
const ChooseCustomListStep_1 = require("./substeps/ChooseCustomListStep");
const ConfirmCustomListStep_1 = require("./substeps/ConfirmCustomListStep");
const CustomListMappingStep_1 = require("./substeps/CustomListMappingStep");
const TransactionFieldIDStep_1 = require("./substeps/TransactionFieldIDStep");
const formSteps = [ChooseCustomListStep_1.default, TransactionFieldIDStep_1.default, CustomListMappingStep_1.default, ConfirmCustomListStep_1.default];
function NetSuiteImportAddCustomListContent({ policy, draftValues }) {
    const policyID = policy?.id ?? '-1';
    const styles = (0, useThemeStyles_1.default)();
    const ref = (0, react_1.useRef)(null);
    const formRef = (0, react_1.useRef)(null);
    const values = (0, react_1.useMemo)(() => (0, customUtils_1.getSubstepValues)(draftValues), [draftValues]);
    const startFrom = (0, react_1.useMemo)(() => (0, customUtils_1.getCustomListInitialSubstep)(values), [values]);
    const config = policy?.connections?.netsuite?.options?.config;
    const customLists = (0, react_1.useMemo)(() => config?.syncOptions?.customLists ?? [], [config?.syncOptions]);
    const handleFinishStep = (0, react_1.useCallback)(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            const updatedCustomLists = customLists.concat([
                {
                    listName: values[NetSuiteCustomFieldForm_1.default.LIST_NAME],
                    internalID: values[NetSuiteCustomFieldForm_1.default.INTERNAL_ID],
                    transactionFieldID: values[NetSuiteCustomFieldForm_1.default.TRANSACTION_FIELD_ID],
                    mapping: values[NetSuiteCustomFieldForm_1.default.MAPPING] ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
                },
            ]);
            Connections.updateNetSuiteCustomLists(policyID, updatedCustomLists, customLists, `${CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS}_${customLists.length}`, CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD);
            FormActions.clearDraftValues(ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_LIST_ADD_FORM);
            Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS));
        });
    }, [values, customLists, policyID]);
    const { componentToRender: SubStep, isEditing, nextScreen, prevScreen, screenIndex, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({
        bodyContent: formSteps,
        startFrom,
        onFinished: handleFinishStep,
    });
    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        // Clicking back on the first screen should go back to listing
        if (screenIndex === CONST_1.default.NETSUITE_CUSTOM_FIELD_SUBSTEP_INDEXES.CUSTOM_LISTS.CUSTOM_LIST_PICKER) {
            FormActions.clearDraftValues(ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_LIST_ADD_FORM);
            Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS));
            return;
        }
        ref.current?.movePrevious();
        formRef.current?.resetErrors();
        prevScreen();
    };
    const handleNextScreen = (0, react_1.useCallback)(() => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        ref.current?.moveNext();
        nextScreen();
    }, [goToTheLastStep, isEditing, nextScreen]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportAddCustomListContent.displayName} headerTitle="workspace.netsuite.import.importCustomFields.customLists.addText" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onBackButtonPress={handleBackButtonPress} shouldUseScrollView={false}>
            <react_native_1.View style={[styles.ph5, styles.mb3, styles.mt3, { height: CONST_1.default.NETSUITE_FORM_STEPS_HEADER_HEIGHT }]}>
                <InteractiveStepSubHeader_1.default ref={ref} startStepIndex={startFrom} stepNames={CONST_1.default.NETSUITE_CONFIG.NETSUITE_ADD_CUSTOM_LIST_STEP_NAMES}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexGrow1, styles.mt3]}>
                <SubStep isEditing={isEditing} onNext={handleNextScreen} onMove={moveTo} screenIndex={screenIndex} policyID={policyID} policy={policy} importCustomField={CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS} netSuiteCustomFieldFormValues={values} customLists={customLists}/>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
NetSuiteImportAddCustomListContent.displayName = 'NetSuiteImportAddCustomListContent';
exports.default = NetSuiteImportAddCustomListContent;
