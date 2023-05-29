import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const utils = {
    proxy: function (mode) {
      switch (mode) {
        case "sit":
          return {
            "/driverServApi/admin": {
              target: `http://10.3.3.21:9090`,
              changeOrigin: true,
            }
          };
        case "prod":
          return {
            "/driverServApi/admin": {
              target: `http://10.3.2.163:3000`,
              changeOrigin: true,
            }
          };
      };
    }
  };
  // 可加入需要的其他文件类型，比如json，图片不要压缩，体积会比原来还大
  const productionGzipExtensions = [
    "js",
    "css",
    "json",
    "txt",
    "html",
    "ico",
    "svg",
  ];
  return {
    build: {
      outDir: `dist/${mode}/webapps/admin`,
      assetsDir: "static",
    },
    plugins: [
      vue(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      viteCompression({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240, //对超过10k的数据进行压缩
        minRatio: 0.6, // 压缩比例，值为0 ~ 1
      }),
      // new CompressionWebpackPlugin({
      //   filename: "[path].gz[query]",
      //   algorithm: "gzip",
      //   test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
      //   threshold: 10240, //对超过10k的数据进行压缩
      //   minRatio: 0.6, // 压缩比例，值为0 ~ 1
      // }),
    ],
    resolve: {
    },
    server: {
      host: '10.3.2.107',
      port: 8080,
      open: true,
      strictPort: false,
      https: false,
      proxy: utils.proxy(mode)
    },
  }
})
