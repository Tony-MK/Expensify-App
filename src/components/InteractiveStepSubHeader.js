"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const Icon_1 = require("./Icon");
const Expensicons = require("./Icon/Expensicons");
const PressableWithFeedback_1 = require("./Pressable/PressableWithFeedback");
const Text_1 = require("./Text");
const MIN_AMOUNT_FOR_EXPANDING = 3;
const MIN_AMOUNT_OF_STEPS = 2;
function InteractiveStepSubHeader({ stepNames, startStepIndex = 0, onStepSelected }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    const containerWidthStyle = stepNames.length < MIN_AMOUNT_FOR_EXPANDING ? styles.mnw60 : styles.mnw100;
    if (stepNames.length < MIN_AMOUNT_OF_STEPS) {
        throw new Error(`stepNames list must have at least ${MIN_AMOUNT_OF_STEPS} elements.`);
    }
    const [currentStep, setCurrentStep] = (0, react_1.useState)(startStepIndex);
    (0, react_1.useImperativeHandle)(ref, () => ({
        moveNext: () => {
            setCurrentStep((actualStep) => actualStep + 1);
        },
        movePrevious: () => {
            setCurrentStep((actualStep) => actualStep - 1);
        },
        moveTo: (step) => {
            setCurrentStep(step);
        },
    }), []);
    const amountOfUnions = stepNames.length - 1;
    return (<react_native_1.View style={[styles.interactiveStepHeaderContainer, containerWidthStyle]}>
            {stepNames.map((stepName, index) => {
            const isCompletedStep = currentStep > index;
            const isLockedStep = currentStep < index;
            const isLockedLine = currentStep < index + 1;
            const hasUnion = index < amountOfUnions;
            const moveToStep = () => {
                if (isLockedStep || !onStepSelected) {
                    return;
                }
                setCurrentStep(index);
                const step = stepNames.at(index);
                if (step) {
                    onStepSelected(step);
                }
            };
            return (<react_native_1.View style={[styles.interactiveStepHeaderStepContainer, hasUnion && styles.flex1]} key={stepName}>
                        <PressableWithFeedback_1.default style={[
                    styles.interactiveStepHeaderStepButton,
                    isLockedStep && styles.interactiveStepHeaderLockedStepButton,
                    isCompletedStep && styles.interactiveStepHeaderCompletedStepButton,
                    !onStepSelected && styles.cursorDefault,
                ]} disabled={isLockedStep || !onStepSelected} onPress={moveToStep} accessible accessibilityLabel={stepName[index]} role={CONST_1.default.ROLE.BUTTON}>
                            {isCompletedStep ? (<Icon_1.default src={Expensicons.Checkmark} width={variables_1.default.iconSizeNormal} height={variables_1.default.iconSizeNormal} fill={colors_1.default.white}/>) : (<Text_1.default style={[styles.interactiveStepHeaderStepText, isLockedStep && styles.textSupporting]}>{index + 1}</Text_1.default>)}
                        </PressableWithFeedback_1.default>
                        {hasUnion ? <react_native_1.View style={[styles.interactiveStepHeaderStepLine, isLockedLine && styles.interactiveStepHeaderLockedStepLine]}/> : null}
                    </react_native_1.View>);
        })}
        </react_native_1.View>);
}
InteractiveStepSubHeader.displayName = 'InteractiveStepSubHeader';
exports.default = (0, react_1.forwardRef)(InteractiveStepSubHeader);
