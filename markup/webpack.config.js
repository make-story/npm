const path = require("path");
const webpack = require("webpack");
//const webpackMerge = require('webpack-merge'); // 여러 웹팩 설정값 결합 - webpackMerge({설정1}, {설정2}, ...) - (4.x 와 5.x 이상 버전 사용방법 차이 있음)
const { merge } = require("webpack-merge");

let {
  isArgv,
  getArgv,
  phase,
  phaseType,
  npmPackageName,
  npmPackagePath,
  npmPackageVersion,
} = require(path.resolve(__dirname, "./config/index"));
const paths = require(path.resolve(__dirname, "./config/paths"));

const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // css 파일로 내보내기
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// webpack config (웹팩설정 정보)
const configEntry = require(path.resolve(
  __dirname,
  "./config/webpack.entry.js"
)); // 기본 엔트리
const configProduction = require(path.resolve(
  __dirname,
  "./config/webpack.production.js"
)); // 웹팩 배포용 설정
const configDevelopment = require(path.resolve(
  __dirname,
  "./config/webpack.development.js"
)); // 웹팩 개발모드 설정
const configNone = require(path.resolve(__dirname, "./config/webpack.none.js")); // 웹팩 로컬용 설정

// 명령 설정값 확인
const mode = getArgv("mode");
const isProduction = mode === "production"; // $ webpack --mode production
const isDevelopment = mode === "development"; // $ webpack --mode development
const isNone = mode === "none"; // $ webpack --mode none

// version
/*console.log("버전 자동변경", process.env.VERSION_AUTO.trim());
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
}*/

// NPM 패키지 정보
let package = {};
let packageVersion = "";
if (npmPackagePath) {
  package = require(npmPackagePath);
  packageVersion = package.version || "";
}

// static path
let staticURL = phase !== phaseType.prd ? paths.cdnStgUrl : paths.cdnPrdUrl;
let staticPath = paths.cdnPath;
if (npmPackageName && packageVersion) {
  staticPath = `${staticPath}/${npmPackageName}/${packageVersion}`;
}

// 웹팩 기본 설정
const configDefault = {
  cache: false,

  // 결과
  // 파일이 저장될 경로
  output: {
    path: path.resolve(__dirname, "css"),
    // [name]은 entry 에 설정된 ‘key’ 이름 - entry name
    // [id] 웹팩 내부적으로 사용하는 모듈 ID - chunk id
    // [hash]는 매번 웹팩 컴파일 시 랜덤한 문자열을 붙여줍니다. 해시 길이 지정가능 - [hash:16]
    // [hash]가 컴파일할 때마다 랜덤 문자열을 붙여준다면,
    // [chunkhash]는 파일이 달라질 때에만 랜덤 값이 바뀝니다. (이것을 사용하면 변경되지 않은 파일들은 계속 캐싱하고 변경된 파일만 새로 불러올 수 있습니다.)
    //filename: '[name].js',
  },

  // 경로나 확장자를 처리할 수 있게 도와주는 옵션
  // 모듈로딩 관련 옵션 설정, 모듈 해석방식 정의 (alias등)
  resolve: {
    modules: [
      // 'node_modules' 경로 필수
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "."),
    ],
    extensions: [".css", ".scss"],
  },

  // 모듈처리 방법 (로더 등)
  // 로더는 웹팩 번들링되는 중간 과정에 개입 (로더는 파일을 해석하고 변환하는 과정에 관여, 모듈을 처리하는 단위)
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          //MiniCssExtractPlugin.loader,
          isProduction || isNone
            ? MiniCssExtractPlugin.loader /*CSS 파일로 내보내기*/
            : "style-loader" /*<style>태그로 포함*/,
          "css-loader", // CSS 코드를 JavaScript 모듈화 규칙으로 변환 (.js)
          // https://github.com/browserslist/browserslist#full-list
          {
            loader: "postcss-loader", // 자바스크립트로 작성된 여러 플러그인을 통해 CSS 코드에 추가적 기능(코드)을 제공
            options: {
              //config: { path: "postcss.config.js" },
            },
          },
          "sass-loader", // SCSS 파일을 CSS 로 컴파일
        ],
        exclude: /node_modules/,
      },
      // image / svg
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader", // css 코드내 파일을 별도 경로로 내보내기
            options: {
              // 루트경로는 output.path 가 기준이 됨
              publicPath: isProduction
                ? `//${staticURL}/${staticPath}/images/`
                : "/",
              outputPath: `../${staticPath}/images/`,
              name: "[name].[ext]?[hash]",
              //name: '[contenthash].[ext]',
              //name: isProduction ? '[path][name].[ext]' : '../[path][name].[ext]',
              emitFile: true, // 파일 복사 여부
            },
          },
        ],
      },
      /*{
				test: /\.png$/i,
				use: {
					loader: 'url-loader', // image 파일 형태를 base64 형태로 변환
					options: {
						// 루트경로는 output.path 가 기준이 됨
						publicPath: './dist/',
						name: '[name].[ext]?[hash]',
						limit: 10000 // 10kb
					}
				}
			},*/
      // font
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader", // css 코드내 파일을 별도 경로로 내보내기
            options: {
              // 루트경로는 output.path 가 기준이 됨
              publicPath: isProduction
                ? `//${staticURL}/${staticPath}/fonts/`
                : "/",
              outputPath: `../${staticPath}/fonts/`,
              name: "[name].[ext]?[hash]",
              //name: '[path][name].[ext]',
              //name: '[contenthash].[ext]',
              //name: isProduction ? '[path][name].[ext]' : '../[path][name].[ext]',
              emitFile: true, // 파일 복사 여부
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 기존 파일 비우기
    new CleanWebpackPlugin(),
    // 코드 압축
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    // 배너
    new webpack.BannerPlugin({
      banner: [
        npmPackageName,
        `@version ${package.version || '-'} | ${new Date().toDateString()}`,
        `@author ${package.author || 'amore'}`,
      ].join("\n"),
      raw: false,
      entryOnly: true,
    }),
  ],
  /*externals: [
		{
			codemirror: {
				commonjs: 'codemirror',
				commonjs2: 'codemirror',
				amd: 'codemirror',
				root: ['CodeMirror']
			}
		}
	],*/
  performance: {
    hints: false,
  },
};

let config = {}; // webpack config
config = merge(config, configEntry, configDefault);
if (isProduction) {
  config = merge(config, configProduction);
} else if (isNone) {
  config = merge(config, configNone);
} else {
  config = merge(config, configDevelopment);
}

module.exports = config;
