"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const en_1 = require("@assets/emojis/en");
const StringUtils_1 = require("@src/libs/StringUtils");
describe('libs/StringUtils.removeInvisibleCharacters', () => {
    it('basic tests', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test test')).toBe('test test');
        expect(StringUtils_1.default.removeInvisibleCharacters('abcdefghijklmnopqrstuvwxyz')).toBe('abcdefghijklmnopqrstuvwxyz');
        expect(StringUtils_1.default.removeInvisibleCharacters('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        expect(StringUtils_1.default.removeInvisibleCharacters('0123456789')).toBe('0123456789');
        expect(StringUtils_1.default.removeInvisibleCharacters('!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~')).toBe('!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~');
        expect(StringUtils_1.default.removeInvisibleCharacters('')).toBe('');
        expect(StringUtils_1.default.removeInvisibleCharacters(' ')).toBe('');
    });
    it('other alphabets, list of all characters', () => {
        // arabic
        expect(StringUtils_1.default.removeInvisibleCharacters('أبجدية عربية')).toBe('أبجدية عربية');
        // chinese
        expect(StringUtils_1.default.removeInvisibleCharacters('的一是了我不人在他们')).toBe('的一是了我不人在他们');
        // cyrillic
        expect(StringUtils_1.default.removeInvisibleCharacters('абвгдезиклмнопр')).toBe('абвгдезиклмнопр');
        // greek
        expect(StringUtils_1.default.removeInvisibleCharacters('αβγδεζηθικλμνξοπρ')).toBe('αβγδεζηθικλμνξοπρ');
        // hebrew
        expect(StringUtils_1.default.removeInvisibleCharacters('אבגדהוזחטיכלמנ')).toBe('אבגדהוזחטיכלמנ');
        // hindi
        expect(StringUtils_1.default.removeInvisibleCharacters('अआइईउऊऋऍऎ')).toBe('अआइईउऊऋऍऎ');
        // japanese
        expect(StringUtils_1.default.removeInvisibleCharacters('あいうえおかきくけこ')).toBe('あいうえおかきくけこ');
        // korean
        expect(StringUtils_1.default.removeInvisibleCharacters('가나다라마바사아자')).toBe('가나다라마바사아자');
        // thai
        expect(StringUtils_1.default.removeInvisibleCharacters('กขคงจฉชซ')).toBe('กขคงจฉชซ');
    });
    it('trim spaces', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters(' test')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test ')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters(' test ')).toBe('test');
    });
    it('remove invisible characters', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200B')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200Btest')).toBe('testtest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200B test')).toBe('test test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200B test\u200B')).toBe('test test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200B test\u200B test')).toBe('test test test');
    });
    it('remove invisible characters (Cc)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u0000')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u0001')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u0009')).toBe('test');
    });
    it('remove invisible characters (Cf)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200E')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200F')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2060')).toBe('test');
    });
    it('check other visible characters (Cs)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uD800')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uD801')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uD802')).toBe('test');
    });
    it('check other visible characters (Co)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uE000')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uE001')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uE002')).toBe('test');
    });
    it('remove invisible characters (Cn)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uFFF0')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uFFF1')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\uFFF2')).toBe('test');
    });
    it('remove invisible characters (Zl)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2028')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2029')).toBe('test');
    });
    it('basic check emojis not removed', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test😀')).toBe('test😀');
        expect(StringUtils_1.default.removeInvisibleCharacters('test😀😀')).toBe('test😀😀');
        expect(StringUtils_1.default.removeInvisibleCharacters('test😀😀😀')).toBe('test😀😀😀');
    });
    it('all emojis not removed', () => {
        Object.keys(en_1.default).forEach((key) => {
            expect(StringUtils_1.default.removeInvisibleCharacters(key)).toBe(key);
        });
    });
    it('remove invisible characters (editpad)', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u0020')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u00A0')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2000')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2001')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2002')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2003')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2004')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2005')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2006')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2007')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2008')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2009')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u200A')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u2028')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u205F')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\u3000')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test ')).toBe('test');
    });
    it('other tests', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('\uD83D\uDE36\u200D\uD83C\uDF2B\uFE0F')).toBe('😶‍🌫️');
        expect(StringUtils_1.default.removeInvisibleCharacters('⁠test')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('test⁠test')).toBe('testtest');
        expect(StringUtils_1.default.removeInvisibleCharacters('  	 ‎ ‏ ⁠        　 ')).toBe('');
        expect(StringUtils_1.default.removeInvisibleCharacters('te	‎‏⁠st')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F')).toBe('🏴󠁧󠁢󠁥󠁮󠁧󠁿');
    });
    it('special scenarios', () => {
        // Normally we do not remove this character, because it is used in Emojis.
        // But if the String consist of only invisible characters, we can safely remove it.
        expect(StringUtils_1.default.removeInvisibleCharacters('\u200D')).toBe('');
        expect(StringUtils_1.default.removeInvisibleCharacters('⁠')).toBe('');
    });
    it('check multiline', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('test\ntest')).toBe('test\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('\ntest')).toBe('test');
        expect(StringUtils_1.default.removeInvisibleCharacters('\n')).toBe('');
        expect(StringUtils_1.default.removeInvisibleCharacters('\n\n')).toBe('');
        expect(StringUtils_1.default.removeInvisibleCharacters('\n\n\n')).toBe('');
        // multiple newlines
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n\ntest')).toBe('test\n\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n\n\ntest')).toBe('test\n\n\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n\n\n\ntest')).toBe('test\n\n\n\ntest');
        // multiple newlinest with multiple texts
        expect(StringUtils_1.default.removeInvisibleCharacters('test\ntest\ntest')).toBe('test\ntest\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\ntest\ntest\ntest')).toBe('test\ntest\ntest\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\ntest\ntest\ntest\ntest')).toBe('test\ntest\ntest\ntest\ntest');
        // multiple newlines with multiple texts and spaces
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n\ntest\ntest\ntest\ntest')).toBe('test\n\ntest\ntest\ntest\ntest');
        expect(StringUtils_1.default.removeInvisibleCharacters('test\n \ntest')).toBe('test\n \ntest');
    });
    it('check markdown styling', () => {
        expect(StringUtils_1.default.removeInvisibleCharacters('# test\n** test **')).toBe('# test\n** test **');
        expect(StringUtils_1.default.removeInvisibleCharacters('# test\n** test **\n')).toBe('# test\n** test **');
        expect(StringUtils_1.default.removeInvisibleCharacters('# test\n**test**\n~~test~~')).toBe('# test\n**test**\n~~test~~');
        // multiple newlines
        expect(StringUtils_1.default.removeInvisibleCharacters('# test\n\n** test **')).toBe('# test\n\n** test **');
        expect(StringUtils_1.default.removeInvisibleCharacters('# test\n\n** test **\n')).toBe('# test\n\n** test **');
    });
});
