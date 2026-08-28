# ☕ GRIDS & CIRCLE

커피 상품을 조회하고 주문할 수 있는 웹 서비스입니다.  
고객은 상품을 선택해 주문하고 자신의 주문 내역을 관리할 수 있으며,  
관리자는 상품과 주문 및 배송 내역을 관리할 수 있습니다.

## 주요 기능

### 👤 고객
- 상품 목록 조회
- 주문 생성 (상품 선택, 수량 조절)
- 주문 내역 및 상세 조회
- 주문 수정 및 취소

### 🔐 관리자
- 상품 목록 조회
- 상품 등록
- 전체 주문 조회
- 합배송 내역 조회 (당일, 날짜별)

## 📌 구현 내용

- Spring Boot 기반 REST API 구현
- Next.js를 이용한 사용자 및 관리자 화면 구현
- JPA를 활용한 상품 및 주문 데이터 관리
- 프론트엔드와 백엔드 API 연동

## 🛠 기술 스택

### Backend
- Java
- Spring Boot
- Spring Data JPA
- H2 Database

### Frontend
- Next.js
- React
- TypeScript
- Bootstrap
