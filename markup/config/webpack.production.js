/**
 * 웹팩 배포환경 설정
 */
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { isArgv, getArgv } = require(path.resolve(__dirname, "./index"));
const paths = require(path.resolve(__dirname, "./paths"));
const package = require(path.resolve(__dirname, "../package.json"));
const packageApcpCss =
  require(path.resolve(__dirname, "../npm/apcp-css/package.json")) || {};

const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
//const TerserPlugin = require("terser-webpack-plugin"); // debugger 구문을 제거하거나, 옵션 값으로 console.log도 배포전에 삭제하는 플러그인
const FileManagerPlugin = require("filemanager-webpack-plugin");

// version
console.log("버전 자동변경", process.env.VERSION_AUTO.trim());
//let versionApcpCss = getArgv('version') || packageApcpCss.version || new Date().toDateString();
let versionApcpCss = packageApcpCss.version || null;
if (process.env.VERSION_AUTO.trim() === "true") {
  let [major, minor, patch] = packageApcpCss.version.split(".");
  versionApcpCss = `${major}.${minor}.${Number(patch) + 1}`;
}
if (versionApcpCss !== packageApcpCss.version) {
  packageApcpCss.version = versionApcpCss;
  fs.writeFileSync(
    path.resolve(__dirname, "../npm/apcp-css/package.json"),
    JSON.stringify(Object.assign({}, packageApcpCss), null, 2),
    function (error) {
      console.log(error);
    }
  );
  console.log("버전 설정", packageApcpCss.version);
}

// 웹팩 설정
module.exports = {
  // webpack mode: 'none' | 'development' | 'production'
  mode: "production",

  // 최적화
  optimization: {
    /*minimizer: [
			new OptimizeCssAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
						annotation: true,
					},
				},
			}),
		],*/
  },

  // 플러그인
  plugins: [
    // 파일 복사, 이동, 삭제 등
    new FileManagerPlugin({
      events: {
        onEnd: [
          {
            // 윈도우 환경에서 "*.{js,css}" 실행되지 않을 수 있다. (*.js, *.css 형태로 각각 추가)
            //delete: ["./css/*.{js,txt}"],
            delete: ["./css/*.js", "./css/*.txt"],
          },
          {
            copy: [
              { source: "./css/*.{css,map}", destination: "./npm/apcp-css/" },
            ],
          },
        ],
      },
    }),
    // 배너
    new webpack.BannerPlugin({
      banner: [
        packageApcpCss.name,
        `@version ${packageApcpCss.version} | ${new Date().toDateString()}`,
        `@author ${packageApcpCss.author}`,
      ].join("\n"),
      raw: false,
      entryOnly: true,
    }),
  ],
};
