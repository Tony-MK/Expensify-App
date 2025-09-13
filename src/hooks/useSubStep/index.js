"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSubStep;
const react_1 = require("react");
function calculateLastIndex(bodyContentLength, skipSteps = []) {
    let lastIndex = bodyContentLength - 1;
    while (skipSteps.includes(lastIndex)) {
        lastIndex -= 1;
    }
    return lastIndex;
}
/**
 * This hook ensures uniform handling of components across different screens, enabling seamless integration and navigation through sub steps of the VBBA flow.
 * @param bodyContent - array of components to display in particular step
 * @param onFinished - callback triggered after finish last step
 * @param startFrom - initial index for bodyContent array
 * @param onNextSubStep - callback triggered after finish each step
 * @param skipSteps - array of indexes to skip
 */
function useSubStep({ bodyContent, onFinished, startFrom = 0, skipSteps = [], onNextSubStep = () => { } }) {
    const [screenIndex, setScreenIndex] = (0, react_1.useState)(startFrom);
    const isEditing = (0, react_1.useRef)(false);
    if (bodyContent.length === skipSteps.length) {
        throw new Error('All steps are skipped');
    }
    const lastScreenIndex = (0, react_1.useMemo)(() => calculateLastIndex(bodyContent.length, skipSteps), [bodyContent.length, skipSteps]);
    const prevScreen = (0, react_1.useCallback)(() => {
        let decrementNumber = 1;
        while (screenIndex - decrementNumber >= 0 && skipSteps.includes(screenIndex - decrementNumber)) {
            decrementNumber += 1;
        }
        const prevScreenIndex = screenIndex - decrementNumber;
        if (prevScreenIndex < 0) {
            return;
        }
        setScreenIndex(prevScreenIndex);
    }, [screenIndex, skipSteps]);
    const nextScreen = (0, react_1.useCallback)((finishData) => {
        if (isEditing.current) {
            isEditing.current = false;
            setScreenIndex(lastScreenIndex);
            return;
        }
        let incrementNumber = 1;
        while (screenIndex + incrementNumber < lastScreenIndex && skipSteps.includes(screenIndex + incrementNumber)) {
            incrementNumber += 1;
        }
        const nextScreenIndex = screenIndex + incrementNumber;
        if (nextScreenIndex === lastScreenIndex + 1) {
            onFinished(finishData);
        }
        else {
            onNextSubStep();
            setScreenIndex(nextScreenIndex);
        }
    }, [screenIndex, lastScreenIndex, skipSteps, onFinished, onNextSubStep]);
    const moveTo = (0, react_1.useCallback)((step, turnOnEditMode) => {
        isEditing.current = !(turnOnEditMode !== undefined && !turnOnEditMode);
        setScreenIndex(step);
    }, []);
    const resetScreenIndex = (0, react_1.useCallback)((newScreenIndex = 0) => {
        isEditing.current = false;
        setScreenIndex(newScreenIndex);
    }, []);
    const goToTheLastStep = (0, react_1.useCallback)(() => {
        isEditing.current = false;
        setScreenIndex(lastScreenIndex);
    }, [lastScreenIndex]);
    // eslint-disable-next-line react-compiler/react-compiler
    return {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        componentToRender: bodyContent.at(screenIndex),
        // eslint-disable-next-line react-compiler/react-compiler
        isEditing: isEditing.current,
        screenIndex,
        prevScreen,
        nextScreen,
        lastScreenIndex,
        moveTo,
        resetScreenIndex,
        goToTheLastStep,
    };
}
