"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getMatchingNewRoute_1 = require("@navigation/helpers/getMatchingNewRoute");
describe('getBestMatchingPath', () => {
    it('returns mapped base path when input matches the exact pattern', () => {
        expect((0, getMatchingNewRoute_1.default)('/settings/workspaces/')).toBe('/workspaces/');
    });
    it('returns mapped base path when input matches the exact pattern', () => {
        expect((0, getMatchingNewRoute_1.default)('/settings/workspaces')).toBe('/workspaces');
    });
    it('returns mapped path when input matches the pattern and have more content', () => {
        expect((0, getMatchingNewRoute_1.default)('/settings/workspaces/anything/more')).toBe('/workspaces/anything/more');
    });
    it('returns undefined when input does not match any pattern - similar prefix but different ending', () => {
        expect((0, getMatchingNewRoute_1.default)('/settings/anything/')).toBe(undefined);
    });
    it('returns undefined when input is unrelated to any pattern', () => {
        expect((0, getMatchingNewRoute_1.default)('/anything/workspaces/')).toBe(undefined);
        expect((0, getMatchingNewRoute_1.default)('/anything/anything/')).toBe(undefined);
        expect((0, getMatchingNewRoute_1.default)('/anything/anything/anything')).toBe(undefined);
    });
});
