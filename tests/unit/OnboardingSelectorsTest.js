"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const CONST_1 = require("@src/CONST");
describe('onboardingSelectors', () => {
    // Not all users have this NVP defined as we did not run a migration to backfill it for existing accounts, hence we need to make sure
    // the onboarding flow is only showed to the users with `hasCompletedGuidedSetupFlow` set to false
    describe('hasCompletedGuidedSetupFlowSelector', () => {
        it('Should return true if onboarding NVP is an empty object', () => {
            const onboarding = {};
            expect((0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboarding)).toBe(true);
        });
        it('Should return true if onboarding NVP contains only signupQualifier', () => {
            const onboarding = { signupQualifier: CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB };
            expect((0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboarding)).toBe(true);
        });
        it('Should return true if onboarding NVP contains hasCompletedGuidedSetupFlow = true', () => {
            const onboarding = { hasCompletedGuidedSetupFlow: true };
            expect((0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboarding)).toBe(true);
        });
        it('Should return false if onboarding NVP contains hasCompletedGuidedSetupFlow = false', () => {
            const onboarding = { hasCompletedGuidedSetupFlow: false };
            expect((0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboarding)).toBe(false);
        });
        it('Should return true if onboarding NVP contains only selfTourViewed', () => {
            const onboarding = { selfTourViewed: true };
            expect((0, onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector)(onboarding)).toBe(true);
        });
    });
});
