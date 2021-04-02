# 젠킨스  

## Choice Parameter  
NPM_PACKAGE_NAME  
apcp-css  
NPM 패키지 선택  

## String Parameter  
NPM_PACKAGE_VERSION
NPM 패키지 버전 직접입력 (선택사항)  

```
# 배포환경 
export PHASE="stg"

# 패키지 설치
npm install

# 환경에 따른 버전확인
node ./npm/version.js --phase ${PHASE} --npmPackageName ${NPM_PACKAGE_NAME}

# 빌드
npm run build-jenkins

# 배포
cd npm/${NPM_PACKAGE_NAME}
if [ "dev" == $PHASE ] || [ "stg" == $PHASE ];
	then 
    npm publish --tag ${PHASE}
else 
	npm publish
fi
#export NPM_PACKAGE_VERSION=`node -p "require('./package.json').version"`

```