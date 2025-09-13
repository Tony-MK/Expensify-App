"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const home_fade_gradient__mobile_svg_1 = require("@assets/images/home-fade-gradient--mobile.svg");
const Hoverable_1 = require("@components/Hoverable");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Licenses_1 = require("@pages/signin/Licenses");
const Socials_1 = require("@pages/signin/Socials");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const columns = ({ navigateFocus = () => { } }) => [
    {
        translationPath: 'footer.features',
        rows: [
            {
                href: CONST_1.default.FOOTER.EXPENSE_MANAGEMENT_URL,
                translationPath: 'footer.expenseManagement',
            },
            {
                href: CONST_1.default.FOOTER.SPEND_MANAGEMENT_URL,
                translationPath: 'footer.spendManagement',
            },
            {
                href: CONST_1.default.FOOTER.EXPENSE_REPORTS_URL,
                translationPath: 'footer.expenseReports',
            },
            {
                href: CONST_1.default.FOOTER.COMPANY_CARD_URL,
                translationPath: 'footer.companyCreditCard',
            },
            {
                href: CONST_1.default.FOOTER.RECEIPT_SCANNING_URL,
                translationPath: 'footer.receiptScanningApp',
            },
            {
                href: CONST_1.default.FOOTER.BILL_PAY_URL,
                translationPath: 'footer.billPay',
            },
            {
                href: CONST_1.default.FOOTER.INVOICES_URL,
                translationPath: 'footer.invoicing',
            },
            {
                href: CONST_1.default.FOOTER.PAYROLL_URL,
                translationPath: 'footer.payroll',
            },
            {
                href: CONST_1.default.FOOTER.TRAVEL_URL,
                translationPath: 'footer.travel',
            },
        ],
    },
    {
        translationPath: 'footer.resources',
        rows: [
            {
                href: CONST_1.default.FOOTER.EXPENSIFY_APPROVED_URL,
                translationPath: 'footer.expensifyApproved',
            },
            {
                href: CONST_1.default.FOOTER.PRESS_KIT_URL,
                translationPath: 'footer.pressKit',
            },
            {
                href: CONST_1.default.FOOTER.SUPPORT_URL,
                translationPath: 'footer.support',
            },
            {
                href: CONST_1.default.NEWHELP_URL,
                translationPath: 'footer.expensifyHelp',
            },
            {
                href: CONST_1.default.FOOTER.TERMS_URL,
                translationPath: 'footer.terms',
            },
            {
                href: CONST_1.default.FOOTER.PRIVACY_URL,
                translationPath: 'footer.privacy',
            },
        ],
    },
    {
        translationPath: 'footer.learnMore',
        rows: [
            {
                href: CONST_1.default.FOOTER.ABOUT_URL,
                translationPath: 'footer.aboutExpensify',
            },
            {
                href: CONST_1.default.FOOTER.BLOG_URL,
                translationPath: 'footer.blog',
            },
            {
                href: CONST_1.default.FOOTER.JOBS_URL,
                translationPath: 'footer.jobs',
            },
            {
                href: CONST_1.default.FOOTER.ORG_URL,
                translationPath: 'footer.expensifyOrg',
            },
            {
                href: CONST_1.default.FOOTER.INVESTOR_RELATIONS_URL,
                translationPath: 'footer.investorRelations',
            },
        ],
    },
    {
        translationPath: 'footer.getStarted',
        rows: [
            {
                onPress: () => navigateFocus(),
                translationPath: 'footer.createAccount',
            },
            {
                onPress: () => navigateFocus(),
                translationPath: 'footer.logIn',
            },
        ],
    },
];
function Footer({ navigateFocus }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth } = (0, useResponsiveLayout_1.default)();
    const isVertical = shouldUseNarrowLayout;
    const imageDirection = isVertical ? styles.flexRow : styles.flexColumn;
    const imageStyle = isVertical ? styles.pr0 : styles.alignSelfCenter;
    const columnDirection = isVertical ? styles.flexColumn : styles.flexRow;
    const pageFooterWrapper = [styles.footerWrapper, imageDirection, imageStyle, isVertical ? styles.pl10 : {}];
    const footerColumns = [styles.footerColumnsContainer, columnDirection];
    const footerColumn = isVertical ? [styles.p4] : [styles.p4, isMediumScreenWidth ? styles.w50 : styles.w25];
    const footerWrapper = isVertical ? [StyleUtils.getBackgroundColorStyle(theme.signInPage), styles.overflowHidden] : [];
    const getTextLinkStyle = (hovered) => [styles.footerRow, hovered ? styles.textBlue : {}];
    return (<react_native_1.View style={[styles.flex1]}>
            <react_native_1.View style={footerWrapper}>
                {isVertical ? (<react_native_1.View style={[styles.signInPageGradientMobile]}>
                        <ImageSVG_1.default src={home_fade_gradient__mobile_svg_1.default} height="100%"/>
                    </react_native_1.View>) : null}
                <react_native_1.View style={pageFooterWrapper}>
                    <react_native_1.View style={footerColumns}>
                        {columns({ navigateFocus }).map((column, i) => (<react_native_1.View key={column.translationPath} style={footerColumn}>
                                <Text_1.default style={[styles.textHeadline, styles.footerTitle]}>{translate(column.translationPath)}</Text_1.default>
                                <react_native_1.View style={[styles.footerRow]}>
                                    {column.rows.map(({ href, onPress, translationPath }) => (<Hoverable_1.default key={translationPath}>
                                            {(hovered) => (<react_native_1.View>
                                                    {onPress ? (<TextLink_1.default style={getTextLinkStyle(hovered)} onPress={onPress}>
                                                            {translate(translationPath)}
                                                        </TextLink_1.default>) : (<TextLink_1.default style={getTextLinkStyle(hovered)} href={href}>
                                                            {translate(translationPath)}
                                                        </TextLink_1.default>)}
                                                </react_native_1.View>)}
                                        </Hoverable_1.default>))}
                                    {i === 2 && (<react_native_1.View style={styles.mt4}>
                                            <Socials_1.default />
                                        </react_native_1.View>)}
                                    {i === 3 && (<react_native_1.View style={styles.mv4}>
                                            <Licenses_1.default />
                                        </react_native_1.View>)}
                                </react_native_1.View>
                            </react_native_1.View>))}
                    </react_native_1.View>
                    <react_native_1.View style={[!isVertical && styles.footerBottomLogo]}>
                        {!isVertical ? (<ImageSVG_1.default src={Expensicons.ExpensifyFooterLogo}/>) : (<ImageSVG_1.default src={Expensicons.ExpensifyFooterLogoVertical} height={variables_1.default.verticalLogoHeight} width={variables_1.default.verticalLogoWidth}/>)}
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
Footer.displayName = 'Footer';
exports.default = Footer;
