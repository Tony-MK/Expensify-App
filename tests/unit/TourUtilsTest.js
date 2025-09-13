"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TourUtils_1 = require("@libs/TourUtils");
var CONST_1 = require("@src/CONST");
describe('TourUtils', function () {
    describe('getTestDriveURL', function () {
        describe('NewDot users with introSelected NVP', function () {
            describe('Invited employee', function () {
                it('returns proper URL when screen is narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(true, { choice: CONST_1.default.ONBOARDING_CHOICES.SUBMIT, inviteType: CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE }, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.EMPLOYEE_TOUR_MOBILE);
                });
                it('returns proper URL when screen is not narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(false, { choice: CONST_1.default.ONBOARDING_CHOICES.SUBMIT, inviteType: CONST_1.default.ONBOARDING_INVITE_TYPES.WORKSPACE }, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.EMPLOYEE_TOUR);
                });
            });
            describe('Intro selected is Track Workspace', function () {
                it('returns proper URL when screen is narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(true, { choice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE }, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.TRACK_WORKSPACE_TOUR_MOBILE);
                });
                it('returns proper URL when screen is not narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(false, { choice: CONST_1.default.ONBOARDING_CHOICES.TRACK_WORKSPACE }, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.TRACK_WORKSPACE_TOUR);
                });
            });
            describe('Default case - Admin tour', function () {
                it('returns proper URL when screen is narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(true, {}, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.ADMIN_TOUR_MOBILE);
                });
                it('returns proper URL when screen is not narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(false, {}, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.ADMIN_TOUR);
                });
            });
        });
        describe('Migrated users from Classic - no introSelected NVP', function () {
            describe('User is admin of a workspace', function () {
                it('returns proper URL when screen is narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(true, undefined, true);
                    expect(url).toBe(CONST_1.default.STORYLANE.ADMIN_TOUR_MOBILE);
                });
                it('returns proper URL when screen is not narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(false, undefined, true);
                    expect(url).toBe(CONST_1.default.STORYLANE.ADMIN_TOUR);
                });
            });
            describe('Default case - Employee tour', function () {
                it('returns proper URL when screen is narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(true, undefined, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.EMPLOYEE_TOUR_MOBILE);
                });
                it('returns proper URL when screen is not narrow', function () {
                    var url = (0, TourUtils_1.getTestDriveURL)(false, undefined, false);
                    expect(url).toBe(CONST_1.default.STORYLANE.EMPLOYEE_TOUR);
                });
            });
        });
    });
});
