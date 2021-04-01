const path = require("path");
const fs = require("fs");

// 쉘 명령에서 '--옵션값' 존재여부
// $ node <실행 파일> --옵션키
const isArgv = (argv) => process.argv.indexOf(`--${argv}`) >= 0;

// 쉘 명령에서 '--옵션키'의 '옵션값' 반환
// $ node <실행 파일> --옵션키 옵션값
const getArgv = (argv) => {
  let value = null;
  if (
    process.argv.includes(`--${argv}`) &&
    process.argv[process.argv.indexOf(`--${argv}`) + 1]
  ) {
    value = process.argv[process.argv.indexOf(`--${argv}`) + 1];
  }
  return value;
};

// 환경 (phase)
const DEV = "dev";
const QA = "qa";
const STG = "stg";
const PRD = "prd";
const phaseType = {
  dev: DEV,
  qa: QA,
  stg: STG,
  prd: PRD,
};
let phase = getArgv("phase") || process.env.PHASE || "";
phase = ([DEV, QA, STG, PRD].includes(phase) && phase) || "";

// NPM
let npmPackageName = getArgv("npmPackageName") || process.env.NPM_PACKAGE_NAME || "apcp-css";
let npmPackagePath = path.resolve(__dirname, `../npm/${npmPackageName}/package.json`);
if(!fs.existsSync(npmPackagePath)) {
	npmPackageName = '';
	npmPackagePath = '';
}
let npmPackageVersion = getArgv("npmPackageVersion") || process.env.NPM_PACKAGE_VERSION || "";

module.exports = {
  isArgv,
  getArgv,
  phase,
  phaseType,
  npmPackageName,
  npmPackagePath,
  npmPackageVersion,
};
