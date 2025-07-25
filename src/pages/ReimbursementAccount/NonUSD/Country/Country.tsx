import type {ComponentType} from 'react';
import React from 'react';
import InteractiveStepWrapper from '@components/InteractiveStepWrapper';
import useLocalize from '@hooks/useLocalize';
import useSubStep from '@hooks/useSubStep';
import type {SubStepProps} from '@hooks/useSubStep/types';
import {clearErrors} from '@userActions/FormActions';
import ONYXKEYS from '@src/ONYXKEYS';
import Confirmation from './subSteps/Confirmation';

type CountryProps = {
    /** Handles back button press */
    onBackButtonPress: () => void;

    /** Handles submit button press */
    onSubmit: () => void;

    /** ID of current policy */
    policyID: string | undefined;

    /** Array of step names */
    stepNames?: readonly string[];
};

type CountryStepProps = {
    /** ID of current policy */
    policyID: string | undefined;
} & SubStepProps;

const bodyContent: Array<ComponentType<CountryStepProps>> = [Confirmation];

function Country({onBackButtonPress, onSubmit, policyID, stepNames}: CountryProps) {
    const {translate} = useLocalize();

    const submit = () => {
        onSubmit();
    };

    const {
        componentToRender: SubStep,
        isEditing,
        screenIndex,
        nextScreen,
        prevScreen,
        moveTo,
        goToTheLastStep,
    } = useSubStep<CountryStepProps>({bodyContent, startFrom: 0, onFinished: submit});

    const handleBackButtonPress = () => {
        clearErrors(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }

        if (screenIndex === 0) {
            onBackButtonPress();
        } else {
            prevScreen();
        }
    };

    return (
        <InteractiveStepWrapper
            wrapperID={Country.displayName}
            handleBackButtonPress={handleBackButtonPress}
            headerTitle={translate('countryStep.confirmCurrency')}
            stepNames={stepNames}
            startStepIndex={0}
        >
            <SubStep
                isEditing={isEditing}
                onNext={nextScreen}
                onMove={moveTo}
                policyID={policyID}
            />
        </InteractiveStepWrapper>
    );
}

Country.displayName = 'Country';

export default Country;
