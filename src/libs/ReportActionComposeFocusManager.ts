import {findFocusedRoute} from '@react-navigation/native';
import React from 'react';
import type {RefObject} from 'react';
import type {TextInput} from 'react-native';
import SCREENS from '@src/SCREENS';
import isReportOpenInRHP from './Navigation/helpers/isReportOpenInRHP';
import navigationRef from './Navigation/navigationRef';

type FocusCallback = (shouldFocusForNonBlurInputOnTapOutside?: boolean) => void;

const composerRef: RefObject<TextInput | null> = React.createRef<TextInput>();

// There are two types of composer: general composer (edit composer) and main composer.
// The general composer callback will take priority if it exists.
const editComposerRef: RefObject<TextInput | null> = React.createRef<TextInput>();
// There are two types of focus callbacks: priority and general
// Priority callback would take priority if it existed
let priorityFocusCallback: FocusCallback | null = null;
let focusCallback: FocusCallback | null = null;

/**
 * Register a callback to be called when focus is requested.
 * Typical uses of this would be call the focus on the ReportActionComposer.
 *
 * @param callback callback to register
 */
function onComposerFocus(callback: FocusCallback | null, isPriorityCallback = false) {
    if (isPriorityCallback) {
        priorityFocusCallback = callback;
    } else {
        focusCallback = callback;
    }
}

/**
 * Request focus on the ReportActionComposer
 */
function focus(shouldFocusForNonBlurInputOnTapOutside?: boolean) {
    /** Do not trigger the refocusing when the active route is not the report screen */
    const navigationState = navigationRef.getState();
    const focusedRoute = findFocusedRoute(navigationState);
    if (!navigationState || (!isReportOpenInRHP(navigationState) && focusedRoute?.name !== SCREENS.REPORT && focusedRoute?.name !== SCREENS.SEARCH.MONEY_REQUEST_REPORT)) {
        return;
    }

    if (typeof priorityFocusCallback !== 'function' && typeof focusCallback !== 'function') {
        return;
    }

    if (typeof priorityFocusCallback === 'function') {
        priorityFocusCallback(shouldFocusForNonBlurInputOnTapOutside);
        return;
    }

    if (typeof focusCallback === 'function') {
        focusCallback();
    }
}

/**
 * Clear the registered focus callback
 */
function clear(isPriorityCallback = false) {
    if (isPriorityCallback) {
        editComposerRef.current = null;
        priorityFocusCallback = null;
    } else {
        focusCallback = null;
    }
}

/**
 * Exposes the current focus state of the report action composer.
 */
function isFocused(): boolean {
    return !!composerRef.current?.isFocused();
}

/**
 * Exposes the current focus state of the edit message composer.
 */
function isEditFocused(): boolean {
    return !!editComposerRef.current?.isFocused();
}

export default {
    composerRef,
    onComposerFocus,
    focus,
    clear,
    isFocused,
    editComposerRef,
    isEditFocused,
};
