"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Link_1 = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const Text_1 = require("./Text");
function TextLink({ href, onPress, children, style, onMouseDown = (event) => event.preventDefault(), ...rest }, ref) {
    const { environmentURL } = (0, useEnvironment_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const openLink = (event) => {
        if (onPress) {
            onPress(event);
        }
        else {
            (0, Link_1.openLink)(href, environmentURL);
        }
    };
    const openLinkOnTap = (event) => {
        event.preventDefault();
        openLink(event);
    };
    const openLinkOnEnterKey = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        event.preventDefault();
        openLink(event);
    };
    return (<Text_1.default style={[styles.link, style]} role={CONST_1.default.ROLE.LINK} href={href} onPress={openLinkOnTap} onKeyDown={openLinkOnEnterKey} onMouseDown={onMouseDown} ref={ref} suppressHighlighting 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}>
            {children}
        </Text_1.default>);
}
TextLink.displayName = 'TextLink';
exports.default = (0, react_1.forwardRef)(TextLink);
