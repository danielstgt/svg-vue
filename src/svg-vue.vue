<template>
    <svg
        :viewBox="svgViewBoxValues"
        xmlns="http://www.w3.org/2000/svg"
        v-html="svgContent"
    >
    </svg>
</template>

<script>
export default {
    props: {
        icon: String
    },

    data() {
        return {
            svgString: require(`svg-files-path/${this.iconPath}`).default
        }
    },

    computed: {
        iconPath: {
            cache: false,

            get() {
                return this.icon.replace(new RegExp('.'.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), '/') + '.svg';
            }
        },

        svgViewBoxValues() {
            return this.svgString ? (/viewBox="([^"]+)"/.exec(this.svgString) || '')[1] : null;
        },

        svgContent() {
            return this.svgString ? this.svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '') : null;
        }
    },
}
</script>
