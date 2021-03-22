/**
 * 웹팩 배포환경 설정
 */
 const path = require('path'); 
 const fs = require('fs');
 
 const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
 //const TerserPlugin = require("terser-webpack-plugin"); // debugger 구문을 제거하거나, 옵션 값으로 console.log도 배포전에 삭제하는 플러그인
 const FileManagerPlugin = require('filemanager-webpack-plugin');
 
 // 웹팩 설정 
 module.exports = {
     // webpack mode: 'none' | 'development' | 'production'
     mode: 'none',
 
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
                         delete: [ './css/**.js' ]
                     },
                 ]
             },
         }),
     ],
 };