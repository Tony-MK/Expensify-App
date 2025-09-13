"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const RadioButtons_1 = require("./RadioButtons");
const Text_1 = require("./Text");
function SingleChoiceQuestion({ prompt, errorText, possibleAnswers, currentQuestionIndex, onInputChange }, ref) {
    const styles = (0, useThemeStyles_1.default)();
    return (<>
            <Text_1.default ref={ref} style={[styles.mt3]}>
                {prompt}
            </Text_1.default>
            <RadioButtons_1.default items={possibleAnswers} key={currentQuestionIndex} onPress={onInputChange} errorText={errorText}/>
        </>);
}
SingleChoiceQuestion.displayName = 'SingleChoiceQuestion';
exports.default = (0, react_1.forwardRef)(SingleChoiceQuestion);
