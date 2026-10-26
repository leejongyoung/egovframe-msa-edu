# egovframe-msa-template-frontend
msa template frontend - 클라우드 네이티브 기반의 행정,공공기관 서비스 확산 지원 사업

## 요구 사항
- Node.js >= 22 (LTS)
- npm >= 10 (bundled with Node)

## 프론트엔드 앱
| 앱 | 설명 | 포트(개발) | 포트(프로덕션) | 프로덕션 실행 방식 |
|---|---|---|---|---|
| admin | 관리자 콘솔 (SSR + Express 커스텀 서버) | 3000 | 3000 | `npm run build && npm run start:prodlg` (또는 `node dist/index.js`) |
| portal | 포탈 서비스 (SSR, Next.js 내장 서버) | 3000 | 3000 | `npm run build && npm run start` (`next start`) |

## 공통 환경 변수
| 변수 | 설명 | 기본값 |
|---|---|---|
| `PORT` | 리스닝 포트 | 3000 |
| `SERVER_API_URL` | 백엔드 API 게이트웨이 URL | http://localhost:8000 |
| `PROXY_HOST` | 프록시 호스트(리라이트용) | http://localhost:${PORT} |
| `SITE_ID` | 사이트 구분자 (admin: 1|4, portal: 2|3) | - |
| `NODE_ENV` | 실행 모드 | development |
| `ANALYZE` | 번들 분석 활성화 | false |

## 개발 실행
```bash
# Admin
cd frontend/admin
npm run dev:lg   # SITE_ID=1 (대기업)
npm run dev:sm   # SITE_ID=4 (중소기업)

# Portal
cd frontend/portal
npm run dev:lg   # SITE_ID=2 (대기업)
npm run dev:sm   # SITE_ID=3 (중소기업)
```

## 프로덕션 빌드
```bash
# Admin
cd frontend/admin
npm run build         # next build + tsc server build
npm run build:prodlg  # SITE_ID=1 프로덕션 빌드
npm run build:prodsm  # SITE_ID=4 프로덕션 빌드

# Portal
cd frontend/portal
npm run build         # next build (Turbopack)
npm run build:prodlg  # SITE_ID=2 프로덕션 빌드
npm run build:prodsm  # SITE_ID=3 프로덕션 빌드
```

> ⚠️ **주의**: Next.js 16은 Turbopack을 기본 빌더로 사용합니다. `next.config.js`에 custom webpack 설정이 있으면 빌드 실패합니다. 이 리포지토리의 `next.config.js`는 webpack 설정을 제거했으며, `tsconfig.json`의 `paths`만으로 alias를 처리합니다.

## 프로덕션 실행
```bash
# Admin (Express 커스텀 서버)
cd frontend/admin
npm run start:prodlg   # SITE_ID=1, NODE_ENV=production
npm run start:prodsm   # SITE_ID=4, NODE_ENV=production

# Portal (Next.js 내장 서버)
cd frontend/portal
npm run start:prodlg   # SITE_ID=2
npm run start:prodsm   # SITE_ID=3
```

## Docker 빌드
```bash
# Admin
cd frontend/admin
docker build -t egovframe/egovframe-msa-edu-frontend-admin:latest -f Dockerfile .
docker build -t egovframe/egovframe-msa-edu-frontend-admin:latest -f DockerfileK8s .   # K8s용
docker build -t egovframe/egovframe-msa-edu-frontend-admin:latest -f DockerfileK8sPipeline .  # CI용

# Portal
cd frontend/portal
docker build -t egovframe/egovframe-msa-edu-frontend-portal:latest -f Dockerfile .
docker build -t egovframe/egovframe-msa-edu-frontend-portal:latest -f DockerfileK8s .   # K8s용
docker build -t egovframe/egovframe-msa-edu-frontend-portal:latest -f DockerfileK8sPipeline .  # CI용
```

> Dockerfile은 `node:22-alpine` 베이스 이미지를 사용하며, `npm ci`로 의존성을 설치합니다. `NODE_OPTIONS=--openssl-legacy-provider`는 **필요하지 않습니다** (Next 16 + React 18/19 호환).

## 테스트
```bash
cd frontend/admin && npm test    # jest --coverage (next/jest + jsdom)
cd frontend/portal && npm test   # jest --coverage (next/jest + jsdom)
```

## 보안 감사
```bash
cd frontend/admin && npm audit --json   # 0 high / 0 critical
cd frontend/portal && npm audit --json  # 0 high / 0 critical
```

## 주요 버전 (2026-10-27 기준 레지스트리 검증)
| 패키지 | 버전 | 비고 |
|---|---|---|
| next | 16.4.3 | 유일하게 audit clean인 버전 (12/13/14/15 모두 high/critical 존재) |
| react / react-dom | 18.3.1 | Next 16 peer requirement; @atlaskit/tree peer React 18.2 호환 |
| @mui/material, @mui/icons-material | 7.3.11 | MUI v4→v7 마이그레이션 완료 |
| @mui/styles | 6.5.0 | `makeStyles`/`createStyles` 레거시 지원 (deprecated, JSS→Emotion 병존) |
| @mui/x-data-grid | 8.29.5 | Alpha → v8 API (`paginationModel`, `slots`, `disableRowSelectionOnClick`) |
| @mui/x-date-pickers | 8.29.5 | `@material-ui/pickers` + `@date-io/date-fns` 대체 |
| @mui/x-tree-view | 8.29.3 | `@material-ui/lab` TreeView/TreeItem 대체 |
| @ckeditor/ckeditor5-react | 12.0.0 | `ckeditor5` 49+ 필수, ClassicEditor 직접 어셈블리 |
| next-i18next | 16.4.3 | Pages Router API는 `next-i18next/pages`에서 import |
| date-fns | 4.4.0 | date-fns-tz 3.x와 호환 (`toZonedTime`/`fromZonedTime`) |
| express | 5.3.0 | v4→v5 마이그레이션 (`server.all('*')` → `server.use()`) |
| swr | 2.5.1 | v0.5→v2 API 변경 (array key fetcher destructuring) |
| notistack | 3.0.2 | v1→v3 API 변경 (snackbar API) |
| yup | 1.7.1 | v0.32→v1 API 변경 |
| recharts | 3.10.1 | v2→v3 마이그레이션 |

## 알려진 제한 사항
- **MUI @mui/styles**: `makeStyles`/`createStyles`/`withStyles`를 사용하는 기존 코드가 그대로 동작하도록 JSS 브리지로 유지. `@mui/styles`는 deprecated이며 React 19 / StrictMode에서 제한적 작동. 장기적으로는 `@mui/system`의 `sx` prop 또는 `styled()` API로 마이그레이션 권장.
- **@atlaskit/tree → @hello-pangea/dnd**: 관리자 앱의 중첩 트리(메뉴/권한) 기능은 유지보수되는 `@hello-pangea/dnd`(peer React 18/19)로 대체하여 `@atlaskit/tree` 내부의 `react-beautiful-dnd-next`(peer React 16) 충돌을 해소.
- **정적 호스팅 불가**: 두 앱 모두 `getServerSideProps`, API 프록시(쿠키 기반 인증/리프레시), multer 업로드 엔드포인트, 커스텀 Express 서버(admin)를 사용하므로 **Node.js 프로세스 실행 환경**이 필요. `next export` / 정적 익스포트는 지원하지 않음.
- **React 18 → 19 업그레이드 경로**: Next 16은 React 18을 deprecated 경고하며, Next 17에서 React 19 필수가 될 예정. 현재는 React 18.3.1로 고정.
- **번들 분석기**: `@next/bundle-analyzer@16` 유지. `ANALYZE=true npm run build`로 활성화.

## 변경 이력 (2026-10-27 Issue #8 완료)
- Next.js 11.1.0 → 16.4.3 (React 17 → 18.3.1)
- MUI v4 (@material-ui/*) → MUI v7 (@mui/*) + @mui/x-* 데이터 그리드/데이트피커/트리뷰
- next-i18next 8.6 → 16.4.3 (Pages Router import 경로 변경)
- date-fns 2.x → 4.x / date-fns-tz 1.x → 3.x (API 변경 적용)
- express 4.x → 5.x / multer 1.x → 2.x
- swr 0.5 → 2.5 / notistack 1.0 → 3.0 / yup 0.32 → 1.7 / recharts 2.x → 3.x
- CKEditor5 classic build → ckeditor5 ESM 직접 어셈블리 (upload adapter 유지)
- @atlaskit/tree → @hello-pangea/dnd (peer 충돌 해소)
- ESLint 7 + airbnb → ESLint 9 flat config (eslint-config-next + prettier)
- Jest babel-jest → next/jest (SWC)
- Docker/Node 14 → 22, npm ci, legacy openssl 제거
- npm audit 0 high/critical 두 앱 모두 달성