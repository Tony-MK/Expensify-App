"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FeatureTrainingModal_1 = require("@components/FeatureTrainingModal");
const useLocalize_1 = require("@hooks/useLocalize");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const VIDEO_ASPECT_RATIO = 1560 / 1280;
function TrackTrainingPage() {
    const { translate } = (0, useLocalize_1.default)();
    const onHelp = (0, react_1.useCallback)(() => {
        (0, Link_1.openExternalLink)(CONST_1.default.FEATURE_TRAINING[CONST_1.default.FEATURE_TRAINING.CONTENT_TYPES.TRACK_EXPENSE]?.LEARN_MORE_LINK);
    }, []);
    return (<FeatureTrainingModal_1.default shouldShowDismissModalOption confirmText={translate('common.buttonConfirm')} helpText={translate('common.learnMore')} onHelp={onHelp} videoURL={CONST_1.default.FEATURE_TRAINING[CONST_1.default.FEATURE_TRAINING.CONTENT_TYPES.TRACK_EXPENSE]?.VIDEO_URL} illustrationAspectRatio={VIDEO_ASPECT_RATIO}/>);
}
TrackTrainingPage.displayName = 'TrackTrainingPage';
exports.default = TrackTrainingPage;
