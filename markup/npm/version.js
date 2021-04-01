const path = require("path");
const fs = require("fs");

let { isArgv, getArgv, phase, phaseType, npmPackageName, npmPackagePath, npmPackageVersion } = require(path.resolve(__dirname, "../config/index"));

/*
실행 명령 예(--version 옵션은 선택사항) 
$ node version.js --phase stg --npmPackageName apcp-css --npmPackageVersion 1.0.1
*/

// npm tag 환경별 설정값 구분
const tag = {
  [phaseType.dev]: "dev",
  [phaseType.stg]: "stg",
  [phaseType.prd]: "", // 운영은 사용자 태그 붙이지 않음
};

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

// npm 배포 패키지 정보
let package = require(npmPackagePath);

// 버전
const setVersion = (version = "", phase = "", tag = "") => {
  let [major = 0, minor = 0, ...patch] = version.split(".");
  let returnVersion = "";

  patch = patch.pop();
  if (phase === phaseType.prd) {
    // 운영배포
    //returnVersion = `${major}.${Number(minor) + 1}.${patch}`;
    returnVersion = `${major}.${minor}.${patch}`;
  } else if (tag) {
    // 1.0.0-환경정보.0
    //returnVersion = `${major}.${minor}.0-${tag}.${Number(patch) + 1}`;
    returnVersion = `${major}.${minor}.0-${tag}.${patch}`;
  } else {
    returnVersion = `${major}.${minor}.${patch}`;
  }

  return returnVersion;
};
npmPackageVersion = npmPackageVersion || setVersion(package.version, phase, tag[phase]) || null;
if(!npmPackageVersion) {
  console.log("NPM package 버전 에러!");
  process.exit();
}
console.log("npmPackageVersion", npmPackageVersion);

// 버전정보 저장(변경)
if (package.version !== npmPackageVersion) {
  console.log("NPM package 기본 버전", package.version);
  package.version = npmPackageVersion;
  fs.writeFileSync(
    npmPackagePath,
    JSON.stringify(Object.assign({}, package), null, 2),
    function (error) {
      console.log(error);
    }
  );
  console.log("NPM package 변경 버전", package.version);
}
