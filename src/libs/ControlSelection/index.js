"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Block selection on the whole app
 *
 */
function block() {
    document.body.classList.add('disable-select');
}
/**
 * Unblock selection on the whole app
 *
 */
function unblock() {
    document.body.classList.remove('disable-select');
}
/**
 * Block selection on particular element
 */
function blockElement(element) {
    if (!element) {
        return;
    }
    // eslint-disable-next-line no-param-reassign
    element.onselectstart = () => false;
}
/**
 * Unblock selection on particular element
 */
function unblockElement(element) {
    if (!element) {
        return;
    }
    // eslint-disable-next-line no-param-reassign
    element.onselectstart = () => true;
}
const ControlSelection = {
    block,
    unblock,
    blockElement,
    unblockElement,
};
exports.default = ControlSelection;
