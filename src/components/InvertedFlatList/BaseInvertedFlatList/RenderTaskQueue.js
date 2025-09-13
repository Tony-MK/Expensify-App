"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RENDER_DELAY = 500;
class RenderTaskQueue {
    constructor() {
        this.renderInfos = [];
        this.isRendering = false;
        this.handler = () => { };
        this.timeout = null;
    }
    add(info) {
        this.renderInfos.push(info);
        if (!this.isRendering) {
            this.render();
        }
    }
    setHandler(handler) {
        this.handler = handler;
    }
    cancel() {
        if (this.timeout == null) {
            return;
        }
        clearTimeout(this.timeout);
    }
    render() {
        const info = this.renderInfos.shift();
        if (!info) {
            this.isRendering = false;
            return;
        }
        this.isRendering = true;
        this.handler(info);
        this.timeout = setTimeout(() => {
            this.render();
        }, RENDER_DELAY);
    }
}
exports.default = RenderTaskQueue;
