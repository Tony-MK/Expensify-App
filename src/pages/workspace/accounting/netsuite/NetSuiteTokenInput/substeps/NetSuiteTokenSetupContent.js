"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Parser_1 = require("@libs/Parser");
const CONST_1 = require("@src/CONST");
function NetSuiteTokenSetupContent({ onNext, screenIndex }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const stepKeys = CONST_1.default.NETSUITE_CONFIG.TOKEN_INPUT_STEP_KEYS;
    const currentStepKey = stepKeys[(screenIndex ?? 0)];
    const titleKey = `workspace.netsuite.tokenInput.formSteps.${currentStepKey}.title`;
    const description = `workspace.netsuite.tokenInput.formSteps.${currentStepKey}.description`;
    return (<react_native_1.View style={styles.flex1}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate(titleKey)}</Text_1.default>
            <react_native_1.View style={[styles.flex1, styles.mb3, styles.ph5]}>
                <RenderHTML_1.default html={`<comment><muted-text>${Parser_1.default.replace(translate(description))}</muted-text></comment>`}/>
            </react_native_1.View>
            <FixedFooter_1.default style={[styles.mtAuto]}>
                <Button_1.default success large style={[styles.w100]} onPress={onNext} text={translate('common.next')}/>
            </FixedFooter_1.default>
        </react_native_1.View>);
}
NetSuiteTokenSetupContent.displayName = 'NetSuiteTokenSetupContent';
exports.default = NetSuiteTokenSetupContent;
