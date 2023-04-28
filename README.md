# 젬파이 커뮤니티 서버

젬파이 커뮤니티 서버 입니다.

## 기술 스팩
 - nestjs
 - sequelize
 - mysql2

## 필요 환경 변수
``` bash
DB_HOSTNAME=데이터베이스 호스트
DB_PORT=데이터베이스 포트
DB_USERNAME=데이터베이스 유저명
DB_PASSWORD=데이터베이스 비밀번호
DB_NAME=사용 데이터베이스명
FIREBASE_API_KEY=파이어베이스 API키
URL=jest로 테스트할 서버 URL
LOGIN_KEY=jest로 테스트시 로그인 key
LOGIN_EMAIL=jest로 테스트시 로그인 이메일
LOGIN_PASSWORD=jest로 테스트시 로그인 비밀번호
USER_ID=jest로 테스트시 사용하는 유저 아이디
GOOGLE_API=jest로 테스트시 로그인 처리할 구글 API
GOOGLE_APPLICATION_CREDENTIALS=jest로 테스트시 로그인 처리할 구글 인증 키
```

## 알아둘 사항

### yarn 사용
젬파이 프로젝트는 npm이 아닌 yarn을 사용했습니다.
npm으로 install시 패키지 문제가 발생 할 수 있으므로, 되도록 yarn을 사용해주세요.


### DB table init 
초기셋팅_sql문.md

---
### 공통 테이블은 *View*로 사용
커뮤니티 개발을 위해 사용해야하는 공통 테이블인 users, admins, game은 커뮤니티 서버에서는 컬럼 수정이 일어나면 안되는 테이블입니다.   
그러나 사용되는 sequelize 패키지에서 테이블 모델마다 부분 동기화가 제대로 동작안하는 것으로 확인되었습니다.  
그렇기에 공통 테이블은 추가적으로 view 테이블을 생성하여 해당 view 테이블을 커뮤니티 서버에서 사용하고 있습니다.

---

### 테스트 코드
jest로 작성한 테스트 코드가 *./test*에 작성되어있습니다.   
서버에 api 호출로 테스트하는 방식이기에 테스트할 서버가 구동되어있어야하며,   
테스트에 필요한 환경변수를 셋팅해주어야합니다.

명령어는 *yarn test:e2e* 입니다.

```bash
URL=jest로 테스트할 서버 URL
LOGIN_KEY=jest로 테스트시 로그인 key
LOGIN_EMAIL=jest로 테스트시 로그인 이메일
LOGIN_PASSWORD=jest로 테스트시 로그인 비밀번호
USER_ID=jest로 테스트시 사용하는 유저 아이디
GOOGLE_API=jest로 테스트시 로그인 처리할 구글 API
GOOGLE_APPLICATION_CREDENTIALS=jest로 테스트시 로그인 처리할 구글 인증 키
```

---

### 개발배포
릴리즈 배포는 github action에서 빌드 후 릴리즈 서버에 빌드 파일, package.json, yarn.lock,  
파이어베이스 파일, node_modules 파일만 업로드하여 구동시킵니다. 
github action 설명은 해당 파일에서 확인 부탁드립니다. 

prod-deploy.yml -> 릴리즈 서버 배포
development-server.yml -> 개발 서버 배포

필요 시크릿 변수만 나열해두겠습니다.
```bash
SSH_HOSTNAME -> SSH 호스트 IP or URL
USER_NAME -> SSH호스트 유저명
PORT -> SSH 포트
KEY -> SSH 접속을 위한 pem key
ENVFILE -> 실서버 구동을 위한 .env 파일 내용
```


번외로 개발배포일때 사용했던 Dockerfile,docker-compose.yml파일이 포함되어있습니다.

---

### ZempieUseGuards 사용
api의 관한을 핸들링하기 위해 ZempieUseGuards라는 커스텀 UseGuard 데코레이터를 만들어 사용하고있습니다.

---
