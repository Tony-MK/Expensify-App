"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const Welcome = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const FeatureTrainingModal_1 = require("./FeatureTrainingModal");
function ExplanationModal() {
    const { translate } = (0, useLocalize_1.default)();
    return (<FeatureTrainingModal_1.default title={translate('onboarding.explanationModal.title')} description={translate('onboarding.explanationModal.description')} secondaryDescription={translate('onboarding.explanationModal.secondaryDescription')} confirmText={translate('footer.getStarted')} videoURL={CONST_1.default.WELCOME_VIDEO_URL} onClose={Welcome.completeHybridAppOnboarding}/>);
}
ExplanationModal.displayName = 'ExplanationModal';
exports.default = ExplanationModal;
