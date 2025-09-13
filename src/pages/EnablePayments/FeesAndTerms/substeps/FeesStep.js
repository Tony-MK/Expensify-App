"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const LongTermsForm_1 = require("@pages/EnablePayments/TermsPage/LongTermsForm");
const ShortTermsForm_1 = require("@pages/EnablePayments/TermsPage/ShortTermsForm");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function FeesStep({ onNext }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET);
    return (<ScrollView_1.default style={styles.flex1}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('termsStep.reviewTheFees')}</Text_1.default>
            <react_native_1.View style={[styles.ph5]}>
                <ShortTermsForm_1.default userWallet={userWallet}/>
                <LongTermsForm_1.default />
                <Button_1.default success large style={[styles.w100, styles.mv5]} onPress={onNext} text={translate('common.next')}/>
            </react_native_1.View>
        </ScrollView_1.default>);
}
exports.default = FeesStep;
