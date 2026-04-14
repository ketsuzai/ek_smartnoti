# 🧠 프로젝트 브레인: 데이터베이스 스키마 정의

> **최종 업데이트**: 2026-03-18  
> **참고**: 현재는 프론트엔드 모킹 데이터 기반. 실제 API 연동 시 이 스키마를 기준으로 테이블 설계.

---

## 1. 테이블 개요

```
┌──────────────────────────────────────────────────────┐
│  organizations ─── 기관 정보                          │
│  members ─── 회원 정보 (교사/학부모/기관장)            │
│  member_approvals ─── 가입 승인 관리                  │
│  classes ─── 반(학급) 정보                            │
│  invitations ─── 초대장 이력                          │
│  teacher_invitations ─── 교직원 초대장                │
│  org_members ─── 기관-멀티회원 교사 목록               │
│  notices ─── 공지사항                                 │
│  dashboard_metrics ─── 대시보드 KPI 메트릭             │
└──────────────────────────────────────────────────────┘
```

---

## 2. organizations (기관)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 기관 고유 ID |
| name | text | ✅ | 기관명 |
| type | text | ✅ | '어린이집' \| '유치원' |
| director | text | ✅ | 대표자(원장) 이름 |
| phone | text | ✅ | 기관 연락처 |
| region | text | ✅ | 지역 (서울, 경기, 인천, 부산, 대구, 기타) |
| cert | text | ✅ | 인증 상태: '인증완료' \| '인증대기' \| '인증실패' |
| approval | text | ✅ | 승인 상태: '승인완료' \| '승인대기' \| '반려' |
| status | text | ✅ | 이용 상태: '이용중' \| '이용종료' \| '승인대기' \| '반려' |
| membership | text | ✅ | 멤버십: '멀티회원' \| '정회원' \| '일반회원' \| '미가입' |
| member_plan | text | | 가입 플랜명 |
| member_since | text | | 멤버십 시작일 |
| member_expire | text | | 멤버십 만료일 |
| class_count | number | | 반 수 |
| teacher_count | number | | 교사 수 |
| kid_count | number | | 원아 수 |
| join_date | text | ✅ | 기관 가입일 |
| last_date | text | | 최근 접속일 |
| biz_number | text | | 사업자등록번호 |

---

## 3. members (회원)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 회원 고유 ID |
| status | text | ✅ | 's-active' \| 's-enroll' \| 's-grad' \| 's-leave' \| 's-out' \| 's-stop' |
| status_label | text | ✅ | 재직중, 재원중, 졸업, 퇴소/퇴사, 서비스탈퇴, 정지 |
| type | text | ✅ | 'teacher' \| 'parent' \| 'director' |
| type_label | text | ✅ | 교사, 학부모, 기관장 |
| guardian | text | | '-' \| '주계정' \| '가족계정' |
| name | text | ✅ | 이름 |
| phone | text | ✅ | 연락처 |
| email | text | | 이메일 |
| gender | text | | 성별 |
| birth | text | | 생년월일 |
| affili_main | text | | 소속 기관명 |
| affili_sub | text | | 소속 상세 (반/원아 정보) |
| conn | number | | 다중기관 연결 수 |
| role | text | | 역할 (담임, 보조, 엄마, 아빠 등) |
| pos | text | | 직위 (원장, 부원장, 교사, 보조교사) |
| route | text | ✅ | 가입경로: '기존통합회원' \| '초대장' \| '직접가입' |
| login_type | text | ✅ | 로그인: '통합ID' \| 'SNS-카카오' \| 'SNS-네이버' \| 'SNS-구글' \| 'SNS-애플' |
| join_date | text | ✅ | 가입일 |
| last_date | text | | 최근 접속일 |

---

## 4. member_approvals (가입 승인)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 승인 요청 고유 ID |
| status | text | ✅ | 'pending' \| 'approved' \| 'rejected' |
| type | text | ✅ | 'teacher' \| 'parent' \| 'director' |
| name | text | ✅ | 신청자명 |
| org | text | ✅ | 기관명 |
| org_type | text | ✅ | '유치원' \| '어린이집' |
| class_info | text | | 반 정보 |
| role | text | | 역할 |
| route | text | ✅ | 가입경로 |
| login_type | text | ✅ | 로그인 방식 |
| has_invitation | bool | | 초대장 수신 여부 |
| req_date | datetime | ✅ | 신청일시 |
| approved_date | datetime | | 처리일시 |
| can_cancel | bool | | 승인취소 가능 여부 |
| phone | text | | 연락처 |
| email | text | | 이메일 |
| gender | text | | 성별 |
| birth | text | | 생년월일 |
| guardian | text | | 보호자 유형 |
| conn | number | | 다중기관 연결 수 |

---

## 5. classes (반/학급)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 반 고유 ID |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| name | text | ✅ | 반 이름 |
| teacher | text | | 담당 교사명 |
| member_count | number | | 현재 가입 학부모 수 |
| capacity | number | | 정원 |
| status | text | ✅ | 'active' \| 'stopped' \| 'none' |
| invite_link | text | | 초대 링크 URL |
| toggle_on | bool | | 초대 활성화 여부 |

---

## 6. invitations (초대 이력)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 초대 고유 ID |
| status | text | ✅ | 'active' \| 'used' \| 'expired' \| 'stopped' |
| type | text | ✅ | 'parent' \| 'teacher' |
| org | text | ✅ | 기관명 |
| class_name | text | | 반명 |
| name | text | | 대상자 이름 |
| channel | text | | 발송 채널: '카카오' \| '문자' \| '링크복사' |
| sent_at | datetime | ✅ | 발송 일시 |
| joined_at | datetime | | 가입 일시 |
| link | text | | 초대 링크 |

---

## 7. teacher_invitations (교직원 초대)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 초대 고유 ID |
| org_id | text (FK) | ✅ | 기관 ID |
| class_name | text | ✅ | 반 이름 |
| role | text | ✅ | '담임교사' \| '보조교사' |
| invited_by | text | | 초대 발송자 |
| sent_at | datetime | ✅ | 발송일 |
| status | text | ✅ | 'pending' \| 'used' \| 'expired' |
| d_day | number | | D-day 카운트 |
| name | text | | 가입자 이름 (가입 완료 시) |
| link | text | | 초대 링크 |

---

## 8. org_members (기관-멀티회원 교사)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 고유 ID |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| name | text | ✅ | 교사 이름 |
| email | text | | 이메일 |
| role | text | ✅ | '담임교사' \| '보조교사' |
| joined_at | text | | 가입일 |
| active | bool | ✅ | 활성 여부 |

---

## 9. children (원아)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 원아 고유 ID (예: CHD001) |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| class_id | text (FK) | | 배정된 반 ID (미배정 시 null) |
| class_name | text | | 배정된 반명 (표시용) |
| name | text | ✅ | 아동 이름 |
| birth | text | ✅ | 생년월일 (YYYY-MM-DD) |
| age | text | | 만 나이 (표시용, 계산 생성) |
| gender | text | ✅ | '남' \| '여' |
| profile_color | text | | 아바타 배경색 (HEX) |
| status | text | ✅ | 'enrolled' \| 'graduated' \| 'withdrawn' \| 'on_leave' \| 'pending' |
| status_label | text | ✅ | 재원중, 졸업, 퇴소, 휴원중, 등록대기 |
| enroll_date | text | ✅ | 입원일 |
| graduate_date | text | | 졸업/퇴소일 |
| expected_graduate | text | | 예상 졸업년도 (YYYY) |
| primary_parent_id | text (FK) | ✅ | 주계정 학부모 ID (members 테이블) |
| primary_parent_name | text | ✅ | 주계정 학부모 이름 |
| primary_parent_phone | text | | 주계정 학부모 연락처 |
| primary_parent_relation | text | ✅ | 주계정 관계: '엄마' \| '아빠' \| '기타' |
| parents | array | | 연결된 전체 보호자 목록 (배열) |
| parent_count | number | | 연결된 보호자 수 |
| reg_route | text | ✅ | 등록 경로: '학부모직접' \| '교사등록' \| '기관등록' |
| allergy | array | | 알레르기 정보 (문자열 배열) |
| memo | text | | 특이사항 메모 |
| created_at | text | ✅ | 레코드 생성일시 |
| updated_at | text | | 최종 수정일시 |
| updated_by | text | | 최종 수정자 (회원 ID) |

> **parents 배열 내부 구조**: `{ member_id, name, phone, relation, account_type('primary'|'family'), app_connected, last_access }`

---

## 10. notice_boards (알림장 원본)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 알림장 고유 ID (예: NB001) |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| class_id | text (FK) | ✅ | 소속 반 ID |
| class_name | text | ✅ | 반명 (표시용) |
| teacher_id | text (FK) | ✅ | 작성 교사 ID |
| teacher_name | text | ✅ | 작성 교사 이름 |
| date | text | ✅ | 알림장 날짜 (YYYY-MM-DD) |
| status | text | ✅ | 'draft' \| 'published' \| 'recalled' |
| title | text | | 제목 (미입력 시 날짜 자동생성) |
| content | rich_text | ✅ | 알림장 공통 본문 |
| weather | text | | 날씨: '맑음' \| '흐림' \| '비' \| '눈' \| '바람' 등 |
| temperature | text | | 기온 (예: '14°C / 6°C') |
| child_count | number | ✅ | 발행 대상 원아 수 |
| read_count | number | | 학부모 읽음 수 (집계) |
| comment_count | number | | 전체 댓글 수 (집계) |
| photo_count | number | | 첨부 사진 수 |
| has_ai | bool | | AI 기능 사용 여부 |
| published_at | datetime | | 발행 일시 |
| scheduled_at | datetime | | 예약 발행 일시 (null = 즉시 발행) |
| is_scheduled | bool | | 예약 발행 여부 |
| created_at | datetime | ✅ | 작성 시작 일시 |
| updated_at | datetime | | 최종 수정 일시 |

---

## 10-1. notice_children (알림장-원아 연결)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 연결 고유 ID (예: NC001) |
| notice_id | text (FK) | ✅ | 알림장 원본 ID |
| child_id | text (FK) | ✅ | 원아 ID |
| child_name | text | ✅ | 원아 이름 |
| attendance | text | ✅ | 출결: '출석' \| '결석' \| '조퇴' \| '지각' \| '외출' |
| absence_reason | text | | 결석/조퇴 사유 |
| mood | text | | 기분: '매우좋음' \| '좋음' \| '보통' \| '나쁨' \| '매우나쁨' |
| health_status | array | | 건강상태 (복수 선택): ['양호','콧물','기침','발열' 등] |
| health_memo | text | | 건강 특이사항 메모 |
| meal_breakfast | text | | 아침식사: '잘먹음' \| '조금먹음' \| '안먹음' \| '해당없음' |
| meal_lunch | text | | 점심식사: 동일 |
| meal_snack_am | text | | 오전간식: 동일 |
| meal_snack_pm | text | | 오후간식: 동일 |
| meal_memo | text | | 식사 특이사항 |
| nap_status | text | | 낮잠: '잘잠' \| '조금잠' \| '못잠' \| '안잠' |
| nap_start | text | | 낮잠 시작 (HH:MM) |
| nap_end | text | | 낮잠 종료 (HH:MM) |
| toilet_count | number | | 대변 횟수 |
| toilet_status | text | | 배변 상태: '정상' \| '묽음' \| '딱딱함' \| '없음' |
| diaper_count | number | | 기저귀 교체 횟수 (영아반) |
| activity_indoor | array | | 실내활동 태그 |
| activity_outdoor | array | | 실외활동 태그 |
| activity_special | text | | 특별활동 메모 |
| individual_content | rich_text | | 원아 개별 추가 본문 (공통 본문 외 원아별 별도 내용, 해당 보호자에게만) |
| individual_memo | rich_text | | 원아 개별 메모 (짧은 메모, 해당 보호자에게만 표시) |
| private_memo | text | | 교사 전용 메모 (학부모 비공개) |
| medication_done | bool | | 투약 완료 여부 |
| is_read | bool | | 학부모 읽음 여부 |
| read_at | datetime | | 읽음 일시 |
| comment_count | number | | 해당 원아 댓글 수 |
| photos | array | | 원아별 첨부 사진 URL 배열 |
| created_at | datetime | ✅ | 생성 일시 |
| updated_at | datetime | | 수정 일시 |

---

## 10-2. notice_comments (알림장 댓글)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 댓글 고유 ID |
| notice_child_id | text (FK) | ✅ | 알림장-원아 연결 ID (격리 단위) |
| author_id | text (FK) | ✅ | 작성자 ID (members) |
| author_name | text | ✅ | 작성자 이름 |
| author_type | text | ✅ | 'teacher' \| 'parent' |
| author_relation | text | | 학부모 관계 (엄마/아빠 등) |
| content | text | ✅ | 댓글 내용 |
| is_edited | bool | | 수정 여부 |
| is_deleted | bool | | 삭제 여부 (소프트 삭제) |
| created_at | datetime | ✅ | 작성 일시 |
| updated_at | datetime | | 수정 일시 |

---

## 10-3. notice_photos (알림장 사진)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 사진 고유 ID |
| notice_id | text (FK) | ✅ | 알림장 원본 ID |
| notice_child_id | text (FK) | | 원아별 개별 사진 연결 (null = 공통 사진) |
| url | text | ✅ | 사진 URL |
| thumbnail_url | text | | 썸네일 URL |
| caption | text | | 사진 설명 |
| order | number | | 정렬 순서 |
| is_cover | bool | | 대표 사진 여부 |
| uploaded_by | text (FK) | ✅ | 업로드 교사 ID |
| uploaded_at | datetime | ✅ | 업로드 일시 |

---

## 10-4. notice_templates (알림장 예문/템플릿)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 템플릿 고유 ID |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| teacher_id | text (FK) | | 작성 교사 ID (null = 기관 공용) |
| category | text | ✅ | '본문' \| '활동' \| '식사' \| '낮잠' \| '건강' \| '기타' |
| title | text | ✅ | 예문 제목 (검색용) |
| content | rich_text | ✅ | 예문 내용 |
| tags | array | | 검색 태그 |
| is_ai_generated | bool | | AI 생성 예문 여부 |
| use_count | number | | 사용 횟수 |
| is_shared | bool | | 기관 전체 공유 여부 |
| created_at | datetime | ✅ | 생성 일시 |

---

## 11. notices (공지사항)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 고유 ID |
| tag | text | ✅ | 대상: 'ALL' \| '기관' \| '학부모' \| '교사' |
| text | text | ✅ | 공지 내용 |
| date | text | ✅ | 작성일 |
| views | number | | 조회수 |

---

## 12. meal_plans (식단표)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | text (PK) | ✅ | 식단 고유 ID (예: MP001) |
| org_id | text (FK) | ✅ | 소속 기관 ID |
| date | text | ✅ | 식단 날짜 (YYYY-MM-DD). 기관당 날짜 유니크 |
| snack_am_menu | text | | 오전간식 메뉴 (null = 미등록) |
| snack_am_image_url | text | | 오전간식 이미지 URL |
| snack_am_allergens | text | | 오전간식 알레르기 유발성분 (null = 미입력) |
| lunch_menu | text | | 점심 메뉴 (null = 미등록) |
| lunch_image_url | text | | 점심 이미지 URL |
| lunch_allergens | text | | 점심 알레르기 유발성분 |
| snack_pm_menu | text | | 오후간식 메뉴 (null = 미등록) |
| snack_pm_image_url | text | | 오후간식 이미지 URL |
| snack_pm_allergens | text | | 오후간식 알레르기 유발성분 |
| dinner_menu | text | | 석식 메뉴 (null = 미등록) |
| dinner_image_url | text | | 석식 이미지 URL |
| dinner_allergens | text | | 석식 알레르기 유발성분 |
| created_by | text (FK) | ✅ | 등록 교사/관리자 ID |
| created_at | datetime | ✅ | 생성 일시 |
| updated_by | text (FK) | | 최종 수정 교사/관리자 ID (미수정 시 created_by와 동일) |
| updated_at | datetime | | 최종 수정 일시 |

> **제약**: `(org_id, date)` 복합 유니크. 날짜별 1건만 허용.  
> **표시 규칙**: `updated_by ≠ created_by`이면 패널 하단에 수정자·수정일시 amber 컬러로 별도 표시.  
> **미결**: 영양사 권한 추가 시 `created_by` 역할 확장 필요.

---

## 13. 관계도 (ERD 요약)

```
organizations ──1:N──→ classes
organizations ──1:N──→ org_members
organizations ──1:N──→ teacher_invitations
organizations ──1:N──→ children (org_id)
organizations ──1:N──→ notice_templates (org_id)
members ──N:1──→ organizations (affili_main)
member_approvals ──N:1──→ organizations (org)
invitations ──N:1──→ organizations (org)
classes ──has──→ invite_link (초대 관련)
classes ──1:N──→ children (class_id)
classes ──1:N──→ notice_boards (class_id)
members (parent) ──1:N──→ children (primary_parent_id)
members (parent) ──N:M──→ children (via parents 배열)
members (teacher) ──1:N──→ notice_boards (teacher_id)
notice_boards ──1:N──→ notice_children (notice_id)
notice_boards ──1:N──→ notice_photos (notice_id, child=null → 공통사진)
notice_children ──N:1──→ children (child_id)
notice_children ──1:N──→ notice_comments (notice_child_id)
notice_children ──1:N──→ notice_photos (notice_child_id → 개별사진)
notice_comments ──N:1──→ members (author_id)
notice_templates ──N:1──→ members/teacher (teacher_id)
organizations ──1:N──→ meal_plans (org_id)
meal_plans ──N:1──→ members (created_by)
meal_plans ──N:1──→ members (updated_by)
```

---

> **참고**: 현재 모든 데이터는 각 HTML 파일 내 JavaScript 상수(`const`)로 하드코딩되어 있습니다.  
> 실제 서비스 전환 시 RESTful API 또는 TableAPI로 교체가 필요합니다.
