const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
module.exports = {
    devServer: {
        port: 5555,
        open: true,
        https: false
    },
    publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "./", // 默認'/'，部署應用包時的基本 URL
    outputDir: process.env.OUT_PUT_DIR || 'dist', // 'dist', 生產環境構建文件的目錄
    assetsDir: process.env.ASSETS_DIR || '', // 相對於outputDir的靜態資源(js、css、img、fonts)目錄
    lintOnSave: false, // 是否在保存的時候使用 `eslint-loader` 進行檢查。
    runtimeCompiler: true, // 是否使用包含運行時編譯器的 Vue 構建版本
    productionSourceMap: !IS_PROD, // 生產環境的 source map
    parallel: require("os").cpus().length > 1,
    pwa: {}
}