# NPM

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

# Tag 를 붙여 배포
https://docs.npmjs.com/cli/v7/commands/npm-publish  
https://docs.npmjs.com/cli/v7/commands/npm-dist-tag  
```
$ npm publish --tag stg
```


## 환경 단위 Tag 예    
--tag dev 
--tag qa   
--tag stg  
--tag latest  


# Tag 붙은 버전 나열
```
$ npm dist-tag ls
```


## Tag 의 마지막 버전 설치  
```
$ yarn add <name>@<tag>
```


## Tag 의 버전지정 설치
 ```
$ yarn add apcp-css@1.0.0-stg.0
```


-----


# 배포!
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
