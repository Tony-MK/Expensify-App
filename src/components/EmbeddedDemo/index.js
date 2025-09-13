"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function EmbeddedDemo({ url, iframeTitle, iframeProps }) {
    const styles = (0, useThemeStyles_1.default)();
    return (<iframe title={iframeTitle} src={url} style={styles.embeddedDemoIframe} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...iframeProps}/>);
}
EmbeddedDemo.displayName = 'EmbeddedDemo';
exports.default = EmbeddedDemo;
