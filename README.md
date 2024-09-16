# lostarkcalc

## 기능

로아 거래소 api기반으로 아이템을 만들었을때 판매,제작에관한 이득, 손해 확인
아아템 제작법은 기본적으로 몇개가 들어가 있으나, 관리자 권한으로 추가가능

## 사용법

- 백엔드 env 파일 작성

```
HOST=string
USERNAME=string
PASSWORD=string
DATABASE=string
mysql 설정

SYNCHRONIZE=boolean
false 추천

LOSTAPI= string
로스트아크 api 키 작성

PAGEPASSWORD= string
관리자 권한 비밀번호
ADMINNAME= string
```

### 관리자 권한 획득하는법

footer의 관리 라고 써져있는 글자를 누르면 비밀번호 입력창이 나오니, 입력하면됨
