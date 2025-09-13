"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cropImageToAspectRatio_1 = require("@pages/iou/request/step/IOURequestStepScan/cropImageToAspectRatio");
describe('calculateCropRect', () => {
    it('returns full size when image equals target aspect ratio', () => {
        const result = (0, cropImageToAspectRatio_1.calculateCropRect)(1920, 1200, 16, 10);
        expect(result.width).toBe(1920);
        expect(result.height).toBe(1200);
        expect(result.originX).toBe(0);
        expect(result.originY).toBe(0);
    });
    it('crops horizontally when image is wider than target', () => {
        const result = (0, cropImageToAspectRatio_1.calculateCropRect)(2000, 1000, 3, 4);
        expect(result.width).toBe(750);
        expect(result.height).toBe(1000);
        expect(result.originX).toBe(625);
        expect(result.originY).toBe(0);
    });
    it('crops vertically when image is taller than target, center aligned', () => {
        const result = (0, cropImageToAspectRatio_1.calculateCropRect)(4000, 3000, 16, 9);
        expect(result.width).toBe(4000);
        expect(result.height).toBe(2250);
        expect(result.originX).toBe(0);
        expect(result.originY).toBe(375);
    });
    it('crops vertically when image is taller than target, top aligned', () => {
        const result = (0, cropImageToAspectRatio_1.calculateCropRect)(4000, 3000, 16, 9, true);
        expect(result.width).toBe(4000);
        expect(result.height).toBe(2250);
        expect(result.originX).toBe(0);
        expect(result.originY).toBe(0);
    });
});
