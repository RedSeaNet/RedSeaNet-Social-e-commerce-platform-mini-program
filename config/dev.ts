import type { UserConfigExport } from "@tarojs/cli";

export default {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    useHtmlComponents: true,
  },
  logger: {
    quiet: false,
    stats: true,
  },
} satisfies UserConfigExport;
