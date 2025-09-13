"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreventRemove = exports.useFocusEffect = exports.useRoute = exports.useScrollToTop = exports.useLinkTo = exports.useLinkProps = exports.useLinkBuilder = exports.ThemeProvider = exports.DefaultTheme = exports.DarkTheme = exports.ServerContainer = exports.NavigationContainer = exports.LinkingContext = exports.Link = exports.triggerTransitionEnd = exports.useLocale = exports.useNavigation = exports.useTheme = exports.useIsFocused = void 0;
const createAddListenerMock_1 = require("../../../tests/utils/createAddListenerMock");
const isJestEnv = process.env.NODE_ENV === 'test';
const realReactNavigation = isJestEnv ? jest.requireActual('@react-navigation/native') : require('@react-navigation/native');
const useIsFocused = isJestEnv ? realReactNavigation.useIsFocused : () => true;
exports.useIsFocused = useIsFocused;
const useTheme = isJestEnv ? realReactNavigation.useTheme : () => ({});
exports.useTheme = useTheme;
const useLocale = isJestEnv ? realReactNavigation.useTheme : () => ({});
exports.useLocale = useLocale;
const { triggerTransitionEnd, addListener } = isJestEnv
    ? (0, createAddListenerMock_1.default)()
    : {
        triggerTransitionEnd: () => { },
        addListener: () => { },
    };
exports.triggerTransitionEnd = triggerTransitionEnd;
const realOrMockedUseNavigation = isJestEnv ? realReactNavigation.useNavigation : {};
const useNavigation = () => ({
    ...realOrMockedUseNavigation,
    navigate: isJestEnv ? jest.fn() : () => { },
    getState: () => ({
        routes: [],
    }),
    addListener,
});
exports.useNavigation = useNavigation;
__exportStar(require("@react-navigation/core"), exports);
const Link = isJestEnv ? realReactNavigation.Link : () => null;
exports.Link = Link;
const LinkingContext = isJestEnv ? realReactNavigation.LinkingContext : () => null;
exports.LinkingContext = LinkingContext;
const NavigationContainer = isJestEnv ? realReactNavigation.NavigationContainer : () => null;
exports.NavigationContainer = NavigationContainer;
const ServerContainer = isJestEnv ? realReactNavigation.ServerContainer : () => null;
exports.ServerContainer = ServerContainer;
const DarkTheme = isJestEnv ? realReactNavigation.DarkTheme : {};
exports.DarkTheme = DarkTheme;
const DefaultTheme = isJestEnv ? realReactNavigation.DefaultTheme : {};
exports.DefaultTheme = DefaultTheme;
const ThemeProvider = isJestEnv ? realReactNavigation.ThemeProvider : () => null;
exports.ThemeProvider = ThemeProvider;
const useLinkBuilder = isJestEnv ? realReactNavigation.useLinkBuilder : () => null;
exports.useLinkBuilder = useLinkBuilder;
const useLinkProps = isJestEnv ? realReactNavigation.useLinkProps : () => null;
exports.useLinkProps = useLinkProps;
const useLinkTo = isJestEnv ? realReactNavigation.useLinkTo : () => null;
exports.useLinkTo = useLinkTo;
const useScrollToTop = isJestEnv ? realReactNavigation.useScrollToTop : () => null;
exports.useScrollToTop = useScrollToTop;
const useRoute = isJestEnv ? realReactNavigation.useRoute : () => ({ params: {} });
exports.useRoute = useRoute;
const useFocusEffect = isJestEnv ? realReactNavigation.useFocusEffect : (callback) => callback();
exports.useFocusEffect = useFocusEffect;
const usePreventRemove = isJestEnv ? jest.fn() : () => { };
exports.usePreventRemove = usePreventRemove;
