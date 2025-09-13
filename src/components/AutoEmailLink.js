"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Text_1 = require("./Text");
const TextLink_1 = require("./TextLink");
/*
 * This is a "utility component", that does this:
 *     - Checks if a text contains any email. If it does, render it as a mailto: link
 *     - Else just render it inside `Text` component
 */
function AutoEmailLink({ text, style }) {
    const styles = (0, useThemeStyles_1.default)();
    const emailRegex = expensify_common_1.CONST.REG_EXP.EXTRACT_EMAIL;
    const matches = [...text.matchAll(emailRegex)];
    if (matches.length === 0) {
        return <Text_1.default style={style}>{text}</Text_1.default>;
    }
    let lastIndex = 0;
    return (<Text_1.default style={style}>
            {matches.flatMap((match, index) => {
            const email = match[0];
            const startIndex = match.index ?? 0;
            const elements = [];
            // Push plain text before email
            if (startIndex > lastIndex) {
                elements.push(text.slice(lastIndex, startIndex));
            }
            // Push email as a link
            elements.push(<TextLink_1.default 
            // eslint-disable-next-line react/no-array-index-key
            key={`email-${index}`} href={`mailto:${email}`} style={styles.emailLink}>
                        {email}
                    </TextLink_1.default>);
            lastIndex = startIndex + email.length;
            return elements;
        })}
            {lastIndex < text.length && text.slice(lastIndex)}
        </Text_1.default>);
}
AutoEmailLink.displayName = 'AutoEmailLink';
exports.default = AutoEmailLink;
