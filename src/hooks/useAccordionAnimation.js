"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
/**
 * @returns two values: isExpanded, which manages the expansion of the accordion component,
 * and shouldAnimateAccordionSection, which determines whether we should animate
 * the expanding and collapsing of the accordion based on changes in isExpanded.
 */
function useAccordionAnimation(isExpanded) {
    const isAccordionExpanded = (0, react_native_reanimated_1.useSharedValue)(isExpanded);
    const shouldAnimateAccordionSection = (0, react_native_reanimated_1.useSharedValue)(false);
    const hasMounted = (0, react_native_reanimated_1.useSharedValue)(false);
    (0, react_1.useEffect)(() => {
        isAccordionExpanded.set(isExpanded);
        if (hasMounted.get()) {
            shouldAnimateAccordionSection.set(true);
        }
        else {
            hasMounted.set(true);
        }
    }, [hasMounted, isAccordionExpanded, isExpanded, shouldAnimateAccordionSection]);
    return { isAccordionExpanded, shouldAnimateAccordionSection };
}
exports.default = useAccordionAnimation;
