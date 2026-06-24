// Plain render-function component (no `.vue` SFC) so the build needs no Vue SFC
// compiler. This mirrors exactly what the previous template
//   <svg v-bind="svgAttributes" v-html="svgContent"></svg>
// compiled to: `v-bind="object"` routes `class`/`style` onto the vnode data and
// every other key onto `attrs` (Vue's bindObjectProps), and `v-html` maps to
// `domProps.innerHTML` (null coerced to '', like the `_s` toString helper).
export default {
    props: {
        icon: String
    },

    computed: {
        iconPath: {
            cache: false,

            get: function get() {
                return this.icon.replace(new RegExp('.'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '/') + '.svg';
            }
        },

        svgString: function svgString() {
            return require('svg-files-path/' + this.iconPath).default;
        },

        svgAttributes: function svgAttributes() {
            if (!this.svgString) return {};

            var wrapper = document.createElement('div');
            wrapper.innerHTML = this.svgString;

            var attributesList = wrapper.firstElementChild.attributes;
            var attributes = {};

            Object.keys(attributesList).map(function (i) { return attributes[attributesList[i].name] = attributesList[i].value; });

            return attributes;
        },

        svgContent: function svgContent() {
            return this.svgString ? this.svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '') : null;
        }
    },

    render: function render(h) {
        var data = {
            attrs: {},
            domProps: { innerHTML: this.svgContent == null ? '' : this.svgContent }
        };

        var source = this.svgAttributes;

        Object.keys(source).forEach(function (key) {
            if (key === 'class' || key === 'style') {
                data[key] = source[key];
            } else {
                data.attrs[key] = source[key];
            }
        });

        return h('svg', data);
    }
};
