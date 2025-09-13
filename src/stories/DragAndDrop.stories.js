"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = Default;
const react_1 = require("react");
const react_native_1 = require("react-native");
const Consumer_1 = require("@components/DragAndDrop/Consumer");
const Provider_1 = require("@components/DragAndDrop/Provider");
const Text_1 = require("@components/Text");
const styles_1 = require("@src/styles");
/**
 * We use the Component Story Format for writing stories. Follow the docs here:
 *
 * https://storybook.js.org/docs/react/writing-stories/introduction#component-story-format
 */
const story = {
    title: 'Components/DragAndDrop',
    component: Consumer_1.default,
};
function Default() {
    const [fileURL, setFileURL] = (0, react_1.useState)('');
    return (<react_native_1.View style={[
            {
                width: 500,
                height: 500,
                backgroundColor: 'beige',
            },
            styles_1.defaultStyles.alignItemsCenter,
            styles_1.defaultStyles.justifyContentCenter,
        ]}>
            <Provider_1.default>
                <react_native_1.View style={[styles_1.defaultStyles.w100, styles_1.defaultStyles.h100, styles_1.defaultStyles.justifyContentCenter, styles_1.defaultStyles.alignItemsCenter]}>
                    {fileURL ? (<react_native_1.Image source={{ uri: fileURL }} style={{
                width: 200,
                height: 200,
            }}/>) : (<Text_1.default color="black">Drop a picture here!</Text_1.default>)}
                </react_native_1.View>
                <Consumer_1.default onDrop={(event) => {
            const file = event.dataTransfer?.files?.[0];
            if (file?.type.includes('image')) {
                const reader = new FileReader();
                reader.addEventListener('load', () => setFileURL(reader.result));
                reader.readAsDataURL(file);
            }
        }}>
                    <react_native_1.View style={[styles_1.defaultStyles.w100, styles_1.defaultStyles.h100, styles_1.defaultStyles.alignItemsCenter, styles_1.defaultStyles.justifyContentCenter, { backgroundColor: 'white' }]}>
                        <Text_1.default color="black">Release to upload file</Text_1.default>
                    </react_native_1.View>
                </Consumer_1.default>
            </Provider_1.default>
        </react_native_1.View>);
}
exports.default = story;
