"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const SingleChoiceQuestion_1 = require("@components/SingleChoiceQuestion");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MAX_SKIP = 1;
const SKIP_QUESTION_TEXT = 'Skip Question';
function IdologyQuestions({ questions, idNumber }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, react_1.useState)(0);
    const [shouldHideSkipAnswer, setShouldHideSkipAnswer] = (0, react_1.useState)(false);
    const [userAnswers, setUserAnswers] = (0, react_1.useState)([]);
    const currentQuestion = questions.at(currentQuestionIndex) ?? {};
    const possibleAnswers = currentQuestion.answer
        .map((answer) => {
        if (shouldHideSkipAnswer && answer === SKIP_QUESTION_TEXT) {
            return;
        }
        return {
            label: answer,
            value: answer,
        };
    })
        .filter((answer) => answer !== undefined);
    const chooseAnswer = (answer) => {
        const tempAnswers = userAnswers.map((userAnswer) => ({ ...userAnswer }));
        tempAnswers[currentQuestionIndex] = { question: currentQuestion.type, answer };
        setUserAnswers(tempAnswers);
    };
    /**
     * Show next question or send all answers for Idology verifications when we've answered enough
     */
    const submitAnswers = () => {
        if (!userAnswers.at(currentQuestionIndex)) {
            return;
        }
        // Get the number of questions that were skipped by the user.
        const skippedQuestionsCount = userAnswers.filter((answer) => answer.answer === SKIP_QUESTION_TEXT).length;
        // We have enough answers, let's call expectID KBA to verify them
        if (userAnswers.length - skippedQuestionsCount >= questions.length - MAX_SKIP) {
            const tempAnswers = userAnswers.map((answer) => ({ ...answer }));
            // Auto skip any remaining questions
            if (tempAnswers.length < questions.length) {
                for (let i = tempAnswers.length; i < questions.length; i++) {
                    tempAnswers[i] = { question: questions.at(i)?.type ?? '', answer: SKIP_QUESTION_TEXT };
                }
            }
            BankAccounts.answerQuestionsForWallet(tempAnswers, idNumber);
            setUserAnswers(tempAnswers);
        }
        else {
            // Else, show next question
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShouldHideSkipAnswer(skippedQuestionsCount >= MAX_SKIP);
        }
    };
    const validate = (values) => {
        const errors = {};
        if (!values.answer) {
            errors.answer = translate('additionalDetailsStep.selectAnswer');
        }
        return errors;
    };
    return (<react_native_1.View style={styles.flex1}>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('additionalDetailsStep.helpTextIdologyQuestions')}</Text_1.default>
            </react_native_1.View>
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} onSubmit={submitAnswers} key={currentQuestionIndex} validate={validate} scrollContextEnabled style={[styles.flexGrow1, styles.ph5]} submitButtonText={translate('common.saveAndContinue')} shouldHideFixErrorsAlert>
                <>
                    <InputWrapper_1.default InputComponent={SingleChoiceQuestion_1.default} inputID="answer" prompt={currentQuestion?.prompt ?? ''} possibleAnswers={possibleAnswers} currentQuestionIndex={currentQuestionIndex} onValueChange={(value) => {
            chooseAnswer(String(value));
        }} onInputChange={() => { }}/>
                    <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt6]}>
                        <Icon_1.default src={Expensicons.QuestionMark} width={12} height={12} fill={theme.icon}/>
                        <TextLink_1.default style={[styles.textMicro, styles.ml2]} href={CONST_1.default.HELP_LINK_URL}>
                            {translate('additionalDetailsStep.helpLink')}
                        </TextLink_1.default>
                    </react_native_1.View>
                </>
            </FormProvider_1.default>
        </react_native_1.View>);
}
IdologyQuestions.displayName = 'IdologyQuestions';
exports.default = IdologyQuestions;
