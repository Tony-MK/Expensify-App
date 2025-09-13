"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementPatch = exports.incrementMinor = exports.SEMANTIC_VERSION_LEVELS = exports.MAX_INCREMENTS = exports.incrementVersion = exports.getVersionStringFromNumber = exports.getVersionNumberFromString = void 0;
exports.isValidSemverLevel = isValidSemverLevel;
exports.getPreviousVersion = getPreviousVersion;
const SEMANTIC_VERSION_LEVELS = {
    MAJOR: 'MAJOR',
    MINOR: 'MINOR',
    PATCH: 'PATCH',
    BUILD: 'BUILD',
};
exports.SEMANTIC_VERSION_LEVELS = SEMANTIC_VERSION_LEVELS;
const MAX_INCREMENTS = 99;
exports.MAX_INCREMENTS = MAX_INCREMENTS;
function isValidSemverLevel(str) {
    return Object.keys(SEMANTIC_VERSION_LEVELS).includes(str);
}
/**
 * Transforms a versions string into a number
 */
const getVersionNumberFromString = (versionString) => {
    const [version, build] = versionString.split('-');
    const [major, minor, patch] = version.split('.').map((n) => Number(n));
    return [major, minor, patch, Number.isInteger(Number(build)) ? Number(build) : 0];
};
exports.getVersionNumberFromString = getVersionNumberFromString;
/**
 * Transforms version numbers components into a version string
 */
const getVersionStringFromNumber = (major, minor, patch, build = 0) => `${major}.${minor}.${patch}-${build}`;
exports.getVersionStringFromNumber = getVersionStringFromNumber;
/**
 * Increments a minor version
 */
const incrementMinor = (major, minor) => {
    if (minor < MAX_INCREMENTS) {
        return getVersionStringFromNumber(major, minor + 1, 0, 0);
    }
    return getVersionStringFromNumber(major + 1, 0, 0, 0);
};
exports.incrementMinor = incrementMinor;
/**
 * Increments a Patch version
 */
const incrementPatch = (major, minor, patch) => {
    if (patch < MAX_INCREMENTS) {
        return getVersionStringFromNumber(major, minor, patch + 1, 0);
    }
    return incrementMinor(major, minor);
};
exports.incrementPatch = incrementPatch;
/**
 * Increments a build version
 */
const incrementVersion = (version, level) => {
    const [major, minor, patch, build] = getVersionNumberFromString(version);
    // Majors will always be incremented
    if (level === SEMANTIC_VERSION_LEVELS.MAJOR) {
        return getVersionStringFromNumber(major + 1, 0, 0, 0);
    }
    if (level === SEMANTIC_VERSION_LEVELS.MINOR) {
        return incrementMinor(major, minor);
    }
    if (level === SEMANTIC_VERSION_LEVELS.PATCH) {
        return incrementPatch(major, minor, patch);
    }
    if (build < MAX_INCREMENTS) {
        return getVersionStringFromNumber(major, minor, patch, build + 1);
    }
    return incrementPatch(major, minor, patch);
};
exports.incrementVersion = incrementVersion;
function getPreviousVersion(currentVersion, level) {
    const [major, minor, patch, build] = getVersionNumberFromString(currentVersion);
    if (level === SEMANTIC_VERSION_LEVELS.MAJOR) {
        if (major === 1) {
            return getVersionStringFromNumber(1, 0, 0, 0);
        }
        return getVersionStringFromNumber(major - 1, 0, 0, 0);
    }
    if (level === SEMANTIC_VERSION_LEVELS.MINOR) {
        if (minor === 0) {
            return getPreviousVersion(currentVersion, SEMANTIC_VERSION_LEVELS.MAJOR);
        }
        return getVersionStringFromNumber(major, minor - 1, 0, 0);
    }
    if (level === SEMANTIC_VERSION_LEVELS.PATCH) {
        if (patch === 0) {
            return getPreviousVersion(currentVersion, SEMANTIC_VERSION_LEVELS.MINOR);
        }
        return getVersionStringFromNumber(major, minor, patch - 1, 0);
    }
    if (build === 0) {
        return getPreviousVersion(currentVersion, SEMANTIC_VERSION_LEVELS.PATCH);
    }
    return getVersionStringFromNumber(major, minor, patch, build - 1);
}
