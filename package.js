/**
 * NPM package.json 정보 설정
 * 
 * 실행 명령 예(--version 옵션은 선택사항) 
 * $ node package.js --phase stg --npmPackageName apcp-css --npmPackageVersion 1.0.1
 * $ node package.js --phase stg --npmPackageName apcp-css --npmPackageTag stg
 */
 const path = require("path");
 const fs = require("fs");
 
 let { isArgv, getArgv, phase, phaseType, npmPackageName, npmPackagePath, npmPackageTag, npmPackageVersion, } = require(path.resolve(__dirname, "./config/index"));
 
 // 유효성 검사
 if(!phase) {
   console.log("phase(배포단계 지정) 에러!", `${Object.values(phaseType).join(' / ')} 중 선택 가능합니다.`);
   process.exit();
 }else if(!npmPackageName) {
   console.log("NPM package name 에러!");
   process.exit();
 }else if(!npmPackagePath) {
   console.log("NPM package 경로 에러!");
   process.exit();
 }
 console.log("phase", phase);
 console.log("npmPackageName", npmPackageName);
 console.log("npmPackagePath", npmPackagePath);
 console.log("npmPackageTag", npmPackageTag);
 //console.log("npmPackageVersion", npmPackageVersion);
 
 /**
  * package 정보
  */
 const package = npmPackagePath && fs.existsSync(npmPackagePath) ? require(npmPackagePath) : {};
 
 /**
  * package name 설정
  */
 const setName = (npmPackagePath, package={}, npmPackageName='') => {
   console.log("NPM package 기존 name", package.name);
   package.name = npmPackageName;
   fs.writeFileSync(
     npmPackagePath,
     JSON.stringify(Object.assign({}, package), null, 2),
     function (error) {
       console.log(error);
     }
   );
   console.log("NPM package 변경 name", package.name);
 };
 if(package.name !== npmPackageName) {
   setName(npmPackagePath, package, npmPackageName);
 }
 
 /**
  * package version 설정
  */
 // 윈도우 환경 : set 환경변수명=값 
 // 맥 환경 : export 환경변수명=값
 const getVersion = (phase = "", version = "", tag = "") => {
   let versionSplit = version.split(".");
   let [major = 0, minor = 0, ...patch] = versionSplit;
   let returnVersion = "";
 
   console.log(phase, version, tag);
   if (phase !== phaseType.prd) {
    if(/*!version.includes('-') || */!patch.join('').includes('-')) {
       // 운영배포가 아닌 경우, 버전은 pre-release 형태로 설정되어야 한다.
       throw '잘못된 버전 설정 (운영환경 배포가 아닌 경우, 버전은 major.minor.patch-test0 형태로 설정되어야 함)';
     }else if(!tag) {
       // 태그가 설정되어야 한다.
       throw '운영배포가 아닌 경우, 배포되는 환경 tag 설정 필요';
     }else {
       returnVersion = version;
     }
   }else {
     // patch 값에서 pre-release 형태 제거 (major.minor.x-stg1)
     returnVersion = `${major}.${minor}.${patch.shift().split('-').shift()}`;
   }
 
   return returnVersion;
 };
 const setVersion = (npmPackagePath, package={}, npmPackageVersion) => {
   console.log("NPM package 기존 version", package.version);
   package.version = npmPackageVersion;
   fs.writeFileSync(
     npmPackagePath,
     JSON.stringify(Object.assign({}, package), null, 2),
     function (error) {
       console.log(error);
     }
   );
   console.log("NPM package 변경 version", package.version);
 };
 npmPackageVersion = getVersion(phase, npmPackageVersion || package.version, npmPackageTag) || null;
 if(!npmPackageVersion) {
   console.log("NPM package 버전 에러!");
   process.exit();
 }
 if(package.version !== npmPackageVersion) {
   setVersion(npmPackagePath, package, npmPackageVersion);
 }
 