"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom webpack plugin that forces garbage collection every 5 compilations
 * and logs memory usage to help monitor memory consumption during development.
 *
 * Note: Requires Node.js to be started with --expose-gc flag to enable garbage collection.
 */
var ForceGarbageCollectionPlugin = /** @class */ (function () {
    function ForceGarbageCollectionPlugin() {
        this.compilationCount = 0;
    }
    ForceGarbageCollectionPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (gc && typeof gc === 'function') {
            compiler.hooks.done.tap(this.constructor.name, function () {
                _this.compilationCount++;
                var memUsage = process.memoryUsage();
                var heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
                var heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
                console.log("\uD83D\uDCCA Compilation #".concat(_this.compilationCount, " - Heap: ").concat(heapUsedMB, "MB/").concat(heapTotalMB, "MB"));
                if (_this.compilationCount % 5 === 0) {
                    console.log("\uD83D\uDDD1\uFE0F Forcing garbage collection after ".concat(_this.compilationCount, " compilations"));
                    gc === null || gc === void 0 ? void 0 : gc();
                    var memAfterGC = process.memoryUsage();
                    var heapAfterMB = Math.round(memAfterGC.heapUsed / 1024 / 1024);
                    console.log("\u2705 Post-GC heap size: ".concat(heapAfterMB, "MB (freed ").concat(heapUsedMB - heapAfterMB, "MB)"));
                }
            });
        }
        else {
            console.warn('⚠️ ForceGarbageCollectionPlugin: gc() function not available. Start Node.js with --expose-gc flag to enable garbage collection.');
        }
    };
    return ForceGarbageCollectionPlugin;
}());
exports.default = ForceGarbageCollectionPlugin;
