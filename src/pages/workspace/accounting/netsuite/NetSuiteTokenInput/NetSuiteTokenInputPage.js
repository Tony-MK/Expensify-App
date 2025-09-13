"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const InteractiveStepSubHeader_1 = require("@components/InteractiveStepSubHeader");
const useSubStep_1 = require("@hooks/useSubStep");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const Navigation_1 = require("@libs/Navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const NetSuiteTokenInputForm_1 = require("./substeps/NetSuiteTokenInputForm");
const NetSuiteTokenSetupContent_1 = require("./substeps/NetSuiteTokenSetupContent");
const staticContentSteps = Array(4).fill(NetSuiteTokenSetupContent_1.default);
const tokenInputSteps = [...staticContentSteps, NetSuiteTokenInputForm_1.default];
function NetSuiteTokenInputPage({ policy }) {
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const ref = (0, react_1.useRef)(null);
    const submit = () => {
        Navigation_1.default.dismissModal();
    };
    const { componentToRender: SubStep, isEditing, nextScreen, prevScreen, screenIndex, moveTo, } = (0, useSubStep_1.default)({ bodyContent: tokenInputSteps, startFrom: 0, onFinished: submit });
    const handleBackButtonPress = () => {
        if (screenIndex === 0) {
            Navigation_1.default.goBack();
            return;
        }
        ref.current?.movePrevious();
        prevScreen();
    };
    const handleNextScreen = () => {
        ref.current?.moveNext();
        nextScreen();
    };
    const shouldPageBeBlocked = !(0, EmptyObject_1.isEmptyObject)(policy?.connections?.[CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE]) && !(0, connections_1.isAuthenticationError)(policy, CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE);
    return (<ConnectionLayout_1.default displayName={NetSuiteTokenInputPage.displayName} headerTitle="workspace.netsuite.tokenInput.title" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onBackButtonPress={handleBackButtonPress} shouldLoadForEmptyConnection={(0, EmptyObject_1.isEmptyObject)(policy?.connections?.[CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE])} shouldBeBlocked={shouldPageBeBlocked}>
            <react_native_1.View style={[styles.ph5, styles.mb3, styles.mt3, { height: CONST_1.default.BANK_ACCOUNT.STEPS_HEADER_HEIGHT }]}>
                <InteractiveStepSubHeader_1.default ref={ref} startStepIndex={0} stepNames={CONST_1.default.NETSUITE_CONFIG.TOKEN_INPUT_STEP_NAMES}/>
            </react_native_1.View>
            <react_native_1.View style={[styles.flexGrow1, styles.mt3]}>
                <SubStep isEditing={isEditing} onNext={handleNextScreen} onMove={moveTo} screenIndex={screenIndex} policyID={policyID}/>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
NetSuiteTokenInputPage.displayName = 'NetSuiteTokenInputPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteTokenInputPage);
