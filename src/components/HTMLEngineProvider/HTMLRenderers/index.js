"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnchorRenderer_1 = require("./AnchorRenderer");
const CodeRenderer_1 = require("./CodeRenderer");
const ConciergeLinkRenderer_1 = require("./ConciergeLinkRenderer");
const DeletedActionRenderer_1 = require("./DeletedActionRenderer");
const EditedRenderer_1 = require("./EditedRenderer");
const EmojiRenderer_1 = require("./EmojiRenderer");
const ImageRenderer_1 = require("./ImageRenderer");
const MentionHereRenderer_1 = require("./MentionHereRenderer");
const MentionReportRenderer_1 = require("./MentionReportRenderer");
const MentionUserRenderer_1 = require("./MentionUserRenderer");
const NextStepEmailRenderer_1 = require("./NextStepEmailRenderer");
const PreRenderer_1 = require("./PreRenderer");
const RBRRenderer_1 = require("./RBRRenderer");
const ShortMentionRenderer_1 = require("./ShortMentionRenderer");
const TaskTitleRenderer_1 = require("./TaskTitleRenderer");
const VideoRenderer_1 = require("./VideoRenderer");
/**
 * This collection defines our custom renderers. It is a mapping from HTML tag type to the corresponding component.
 */
const HTMLEngineProviderComponentList = {
    // Standard HTML tag renderers
    a: AnchorRenderer_1.default,
    code: CodeRenderer_1.default,
    img: ImageRenderer_1.default,
    video: VideoRenderer_1.default,
    // Custom tag renderers
    edited: EditedRenderer_1.default,
    pre: PreRenderer_1.default,
    /* eslint-disable @typescript-eslint/naming-convention */
    'task-title': TaskTitleRenderer_1.default,
    rbr: RBRRenderer_1.default,
    'mention-user': MentionUserRenderer_1.default,
    'mention-report': MentionReportRenderer_1.default,
    'mention-here': MentionHereRenderer_1.default,
    'mention-short': ShortMentionRenderer_1.default,
    emoji: EmojiRenderer_1.default,
    'next-step-email': NextStepEmailRenderer_1.default,
    'deleted-action': DeletedActionRenderer_1.default,
    'concierge-link': ConciergeLinkRenderer_1.default,
    /* eslint-enable @typescript-eslint/naming-convention */
};
exports.default = HTMLEngineProviderComponentList;
