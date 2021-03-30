
# package.json 생성
```
$ npm init -y
```
-y를 입력하지 않으면 package.json에 들어가 값들을 직접 입력하면서 package.json을 생성할 수 있으며 -y를 입력할 경우 기본값으로 설정  


# package.json 수정
```json
{
  "name": "패키지명",
  "version": "1.0.0",
  "description": "패키지설명",
  "author": "",
  "license": "MIT",
  "keywords": [
    "npm 저장소 검색 키워드"
  ],
  "files": [
    "npm에 배포할 경우 실제로 패지키에 포함될 파일들, 폴더 이름을 지정하면 폴더안의 파일을 포함"
  ],
  "dependencies": {
    
  }
} 
```


-----


# 로그인
```
$ npm login
Username: yusungmin
Password:
Email: (this IS public) 
```


## .npmrc 파일 이용 로그인
auth base64 생성  
```
$ echo -n 'myuser:mypassword' | openssl base64
```

.npmrc
```
email=이메일정보
_auth=키
```


## 로그인 확인
```
$ npm whoami
```


-----


# 버전
https://docs.npmjs.com/cli/v7/commands/npm-version  
https://github.com/npm/node-semver#functions  
https://kevinkreuzer.medium.com/publishing-a-beta-or-alpha-version-to-npm-46035b630dd7  


# 버전변경
package.json
```json
{
  "version": "1.0.0-stg.0"
}
```

또는

```
$ npm version 1.0.0-stg.0
```


-----


# 태그를 붙여 배포
https://docs.npmjs.com/cli/v7/commands/npm-publish  
https://docs.npmjs.com/cli/v7/commands/npm-dist-tag  
```
$ npm publish --tag stg
```


# 태그 붙은 버전 나열
```
$ npm dist-tag ls
```


## 배포!
```
$ npm publish
```


## 배포된 패키지는 72시간이 지나면 삭제할 수 없어서 불필요한 패키지라면 미리 삭제하자.
```
$ npm unpublish <PACKAGE_NAME> -f
```


## 배포 중 대부분의 오류
1. NPM Registry 가입 후 E-Mail 인증을 하지 않은 경우
E-Mail 인증을 시도하자.
2. 패키지의 이름이 이미 다른 패키지와 중복이 된 경우
package.json의 name 속성을 바꿔주자.
3. 이미 같은 버전으로 배포가 된 경우
npm version [major, minor, path, x.x.x] 명령어로 버전을 올려 배포하자.


## npm 저장소 확인 (사설 저장소 확인은 별도)
https://www.npmjs.com/settings/yusungmin/packages


-----


## package.json
노드 프로젝트에 대한 정보, 설정, 사용중인 패키지를 기록하는 파일  
패키지에 대한 정보(의존성 등)를 명시  


## package-lock.json
노드 패키지 간의 의존 관계를 고정시켜둔 파일  
npm 패키지를 설치하거나 수정, 삭제 등의 작업을 진행할 때 생성  
패키지(모듈)내 다른 모듈의 의존성등 각 패키지에 대한 의존성 관리    
하나의 패키지를 여러 패키지에서 사용할 수 있고 하나의 패키지는 여러 개의 버전을 가지며 또 이 여러 버전을 다른 패키지에서 사용할 수 있음.  
이렇게 되면 패키지 버전 간의 충돌과 호환이 되지 않는 경우가 있는데 이를 미연에 방지하기 위한 것  
하나의 패키지에 dependencies(종속)가 어떤 패키지인지 버전 정보와 이름이 나열되어 있고 dependencies에 명시된 특정 패키지를 다시 검색 및 추적하다 보면 여러 패키지에서 사용하는 것을 볼 수 있음  


## .nvmrc
노드 버전 관리자로 nvm을 사용하는 경우 어떤 노드 버전을 사용할 지 적혀있습니다.  


## .npmignore
npm에 패키지를 배포할 때 배포하지 않을 파일들 목록입니다.  


## .npmrc
각종 설정 (로그인, 저장소 등 설정)  
https://docs.npmjs.com/cli/v7/configuring-npm/npmrc/


## lerna.json
하나의 프로젝트에서 여러 패키지를 관리할 수 있게 해주는 lerna입니다. 그에 관한 설정 파일입니다.

-----

## 패키지 저장소 지정 install
```
$ npm set registry "http://registry.npmjs.org/"
$ npm config get registry
```

## 패키지 그룹(또는 범위) '@'
@tistory/* 의 이름을 가진 패키지는 private npm 서버를 바라보도록 설정  
```
$ npm config set @tistory:registry http://localhost:4873
```
명령어를 입력하면 .npmrc 파일에 저장
또는 .npmrc 파일을 직접 생성하여 추가
```
@tistory:registry=http://localhost:4873
```

.npmrc 파일을 두고 관리할 경우, 위 처럼 매번 npm 명령어에서 --registry 를 명시하는 부분 생략이 가능하게 됨
```
# before
$ npm install react
$ npm install --registry http://localhost:4873 @tistory/module1
```
```
# after
$ npm install react
$ npm install @tistory/module1
```

