# Brainrack

Brainrack은 저장소 안의 Markdown 파일을 정적 페이지로 렌더링하는 Next.js 블로그입니다.

## Stack

- Next.js 16 App Router
- React 19
- Local Markdown + front matter
- Tailwind CSS 4 + Typography
- Vercel (`icn1`)

## Local setup

```bash
npm install
npm run dev
```

환경변수와 외부 데이터베이스는 필요하지 않습니다.

## Writing

`content/posts`에 `.md` 파일을 추가합니다. 파일명은 URL slug가 되므로 영문 소문자, 숫자, 하이픈만 사용합니다.

```markdown
---
title: "글 제목"
description: "글 요약"
publishedAt: "2026-07-12"
sourceUrl: "https://example.com/optional-source"
---

Markdown 본문
```

필수 front matter는 `title`, `description`, `publishedAt`입니다. `sourceUrl`은 선택입니다. 잘못된 파일은 빌드에서 즉시 실패합니다.

## Validation

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Markdown 내부 raw HTML은 렌더링하지 않습니다. 글의 추가·수정·삭제는 파일과 Git으로 관리합니다.
