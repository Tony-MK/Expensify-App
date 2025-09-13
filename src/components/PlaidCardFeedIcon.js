"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const variables_1 = require("@styles/variables");
const Icon_1 = require("./Icon");
const Illustrations = require("./Icon/Illustrations");
const Image_1 = require("./Image");
function PlaidCardFeedIcon({ plaidUrl, style, isLarge, isSmall }) {
    const [isBrokenImage, setIsBrokenImage] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const theme = (0, useTheme_1.default)();
    const width = isLarge ? variables_1.default.cardPreviewWidth : variables_1.default.cardIconWidth;
    const height = isLarge ? variables_1.default.cardPreviewHeight : variables_1.default.cardIconHeight;
    const [loading, setLoading] = (0, react_1.useState)(true);
    const plaidImageStyle = isLarge ? styles.plaidIcon : styles.plaidIconSmall;
    const iconWidth = isSmall ? variables_1.default.cardMiniatureWidth : width;
    const iconHeight = isSmall ? variables_1.default.cardMiniatureHeight : height;
    const plaidLoadedStyle = isSmall ? styles.plaidIconExtraSmall : plaidImageStyle;
    (0, react_1.useEffect)(() => {
        if (!plaidUrl) {
            return;
        }
        setIsBrokenImage(false);
        setLoading(true);
    }, [plaidUrl]);
    return (<react_native_1.View style={[style]}>
            {isBrokenImage ? (<Icon_1.default src={illustrations.GenericCompanyCardLarge} height={iconHeight} width={iconWidth} additionalStyles={isSmall ? styles.cardMiniature : styles.cardIcon}/>) : (<>
                    <Image_1.default source={{ uri: plaidUrl }} style={plaidLoadedStyle} cachePolicy="memory-disk" onError={() => setIsBrokenImage(true)} onLoadEnd={() => setLoading(false)}/>
                    {loading ? (<react_native_1.View style={[styles.justifyContentCenter, { width: iconWidth, height: iconHeight }]}>
                            <react_native_1.ActivityIndicator color={theme.spinner} size={isSmall ? 10 : 20}/>
                        </react_native_1.View>) : (<Icon_1.default src={isLarge ? Illustrations.PlaidCompanyCardDetailLarge : Illustrations.PlaidCompanyCardDetail} height={iconHeight} width={iconWidth} additionalStyles={isSmall && styles.cardMiniature}/>)}
                </>)}
        </react_native_1.View>);
}
exports.default = PlaidCardFeedIcon;
