# lostarkcalc

## Tech Stack

<div align="left">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeORM-E84343?style=for-the-badge&logo=typeorm&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</div>

## 로스트아크 계산기

- 로스트아크 Open API 데이터를 활용하여 아이템 제작 비용 대비 경매장 판매 수익성을 실시간으로 분석하고, 관리자 기능을 통해 제작 레시피를 유연하게 확장 가능한 서비스

## 프로젝트 인원

- 1명

## 주요 역할

### Full-stack Development

- 시스템 아키텍처 설계, 백엔드 API 서버 구축
- 프론트엔드 UI/UX 구현

## 프로젝트 목적

- 백엔드 아키텍처 및 API 설계 역량 강화: NestJS 프레임워크와 외부 Open API 연동을 통해 확장 가능하고 견고한 백엔드 시스템 구축 역량 습득
- 풀스택 프로세스 경험: 프론트엔드와 백엔드 전 과정을 직접 구현하며 데이터의 흐름과 시스템 통합 과정 이해

## 주요 구현 및 담당 업무

### 효율적인 데이터 관리 및 DB 설계

- TypeORM 기반의 객체지향 DB 설계: 클래스 기반 정의를 통해 데이터 구조의 가독성을 높이고, 유지보수가 용이한 Data Mapper 패턴 적용
- 외부 데이터 동기화: Open API를 연동하여 실시간성 데이터를 수집하고, 시스템 내부 정보의 최신성 유지

### 시스템 성능 최적화 및 비용 절감

- 서버 부하 분산(Client-side Rendering): 복잡한 연산 로직을 클라이언트(Front-end)로 이관하여 서버 CPU 자원을 절약하고 응답 속도 개선
- 통신 최적화 미들웨어 구현: Middleware 계층에서 불필요한 Open API 호출을 제어하고 캐싱 전략을 검토하여, 외부 API 의존도 및 네트워크 비용 최소화

### 협업 효율 및 문서화

- Swagger를 통한 API 규격 자동화: REST API 문서화를 통해 프론트엔드-백엔드 간 데이터 타입 불일치를 방지하고 협업 생산성 극대화
- 프로세스 시각화: 복잡한 비즈니스 로직을 Flowchart로 도식화하여 설계 단계에서의 논리적 오류를 방지하고 시스템 흐름에 대한 이해도 증진

## 기술 역량

### Backend Development

- NestJS & TypeScript: 모듈형 아키텍처를 이해하고, 타입 안정성을 확보한 견고한 서버 로직 구현

- TypeORM: Data Mapper 패턴을 활용한 효율적인 DB 스키마 설계 및 데이터 관리

### Frontend Development

- React: 컴포넌트 기반 개발을 통한 재사용성 극대화 및 사용자 경험(UX) 중심 UI 구현

- TailwindCSS: 유틸리티 우선(Utility-first) 방식의 스타일링으로 신속한 UI 프로토타이핑 및 일관된 디자인 시스템 적용

### Infrastructure & DevOps

- Swagger: API 명세 자동화 및 프론트엔드-백엔드 간 원활한 협업 프로세스 구축

## 기능

## 사용법 (프로젝트 받아서 사용시)

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

### 기본적으로 몇개 아이템이 들어가있으나, 전부 들어가 있지는 않음
