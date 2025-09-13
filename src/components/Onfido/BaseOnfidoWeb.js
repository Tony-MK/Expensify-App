"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onfido_sdk_ui_1 = require("onfido-sdk-ui");
const react_1 = require("react");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const Log_1 = require("@libs/Log");
const FontUtils_1 = require("@styles/utils/FontUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const LOCALES_1 = require("@src/CONST/LOCALES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
require("./index.css");
function initializeOnfido({ sdkToken, onSuccess, onError, onUserExit, preferredLocale, translate, theme }) {
    onfido_sdk_ui_1.Onfido.init({
        token: sdkToken,
        containerId: CONST_1.default.ONFIDO.CONTAINER_ID,
        customUI: {
            // Font styles are commented out until Onfido fixes it on their side, more info here - https://github.com/Expensify/App/issues/44570
            // For now we will use Onfido default font which is better than random serif font which it started defaulting to
            // fontFamilyTitle: `${FontUtils.fontFamily.platform.EXP_NEUE.fontFamily}, -apple-system, serif`,
            // fontFamilySubtitle: `${FontUtils.fontFamily.platform.EXP_NEUE.fontFamily}, -apple-system, serif`,
            // fontFamilyBody: `${FontUtils.fontFamily.platform.EXP_NEUE.fontFamily}, -apple-system, serif`,
            fontSizeTitle: `${variables_1.default.fontSizeLarge}px`,
            fontWeightTitle: Number(FontUtils_1.default.fontWeight.bold),
            fontWeightSubtitle: Number(FontUtils_1.default.fontWeight.normal),
            fontSizeSubtitle: `${variables_1.default.fontSizeNormal}px`,
            colorContentTitle: theme.text,
            colorContentSubtitle: theme.text,
            colorContentBody: theme.text,
            borderRadiusButton: `${variables_1.default.buttonBorderRadius}px`,
            colorBackgroundSurfaceModal: theme.appBG,
            colorBorderDocTypeButton: theme.border,
            colorBorderDocTypeButtonHover: theme.transparent,
            colorBorderButtonPrimaryHover: theme.transparent,
            colorBackgroundButtonPrimary: theme.success,
            colorBackgroundButtonPrimaryHover: theme.successHover,
            colorBackgroundButtonPrimaryActive: theme.successHover,
            colorBorderButtonPrimary: theme.success,
            colorContentButtonSecondaryText: theme.text,
            colorBackgroundButtonSecondary: theme.border,
            colorBackgroundButtonSecondaryHover: theme.hoverComponentBG,
            colorBackgroundButtonSecondaryActive: theme.hoverComponentBG,
            colorBorderButtonSecondary: theme.border,
            colorBorderButtonSecondaryHover: theme.transparent,
            colorBackgroundIcon: theme.transparent,
            colorContentLinkTextHover: theme.appBG,
            colorBorderLinkUnderline: theme.link,
            colorBackgroundLinkHover: theme.link,
            colorBackgroundLinkActive: theme.link,
            colorBackgroundInfoPill: theme.link,
            colorBackgroundSelector: theme.appBG,
            colorBackgroundDocTypeButton: theme.success,
            borderWidthSurfaceModal: '0px',
            colorBackgroundDocTypeButtonHover: theme.successHover,
            colorBackgroundButtonIconHover: theme.transparent,
            colorBackgroundButtonIconActive: theme.transparent,
            colorBorderButtonPrimaryFocus: theme.transparent,
            colorBorderButtonPrimaryActive: theme.transparent,
            colorBorderButtonSecondaryFocus: theme.transparent,
            colorBorderButtonSecondaryActive: theme.transparent,
            colorIcon: theme.icon,
            colorContentButtonTertiaryText: theme.link,
            colorBackgroundButtonTertiaryHover: theme.hoverComponentBG,
            colorBorderButtonTertiaryFocus: theme.transparent,
            colorInputOutline: theme.borderFocus,
            colorBackgroundInput: theme.appBG,
            colorBorderInput: theme.border,
        },
        steps: [
            {
                type: CONST_1.default.ONFIDO.TYPE.DOCUMENT,
                options: {
                    forceCrossDevice: true,
                    hideCountrySelection: true,
                    documentTypes: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        driving_licence: {
                            country: 'USA',
                        },
                        passport: true,
                    },
                },
            },
            {
                type: CONST_1.default.ONFIDO.TYPE.FACE,
                options: {
                    requestedVariant: CONST_1.default.ONFIDO.VARIANT.VIDEO,
                },
            },
        ],
        onComplete: (data) => {
            if ((0, EmptyObject_1.isEmptyObject)(data)) {
                Log_1.default.warn('Onfido completed with no data');
            }
            onSuccess(data);
        },
        onError: (error) => {
            const errorType = error.type;
            const errorMessage = error.message ?? CONST_1.default.ERROR.UNKNOWN_ERROR;
            Log_1.default.hmmm('Onfido error', { errorType, errorMessage });
            if (errorType === CONST_1.default.WALLET.ERROR.ONFIDO_USER_CONSENT_DENIED) {
                onUserExit();
                return;
            }
            onError(errorMessage);
        },
        language: {
            // We need to use ES_ES as locale key because the key `ES` is not a valid config key for Onfido
            locale: preferredLocale === CONST_1.default.LOCALES.ES ? LOCALES_1.EXTENDED_LOCALES.ES_ES_ONFIDO : (preferredLocale ?? CONST_1.default.LOCALES.DEFAULT),
            // Provide a custom phrase for the back button so that the first letter is capitalized,
            // and translate the phrase while we're at it. See the issue and documentation for more context.
            // https://github.com/Expensify/App/issues/17244
            // https://documentation.onfido.com/sdk/web/#custom-languages
            phrases: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'generic.back': translate('common.back'),
            },
        },
    });
}
function logOnFidoEvent(event) {
    Log_1.default.hmmm('Receiving Onfido analytic event', event.detail);
}
function Onfido({ sdkToken, onSuccess, onError, onUserExit }, ref) {
    const { preferredLocale, translate } = (0, useLocalize_1.default)();
    const theme = (0, useTheme_1.default)();
    (0, react_1.useEffect)(() => {
        initializeOnfido({
            sdkToken,
            onSuccess,
            onError,
            onUserExit,
            preferredLocale,
            translate,
            theme,
        });
        window.addEventListener('userAnalyticsEvent', logOnFidoEvent);
        return () => window.removeEventListener('userAnalyticsEvent', logOnFidoEvent);
        // Onfido should be initialized only once on mount
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    return (<div id={CONST_1.default.ONFIDO.CONTAINER_ID} ref={ref}/>);
}
Onfido.displayName = 'Onfido';
exports.default = (0, react_1.forwardRef)(Onfido);
