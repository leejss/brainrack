---
title: "로컬 Markdown 블로그로 전환"
description: "데이터베이스와 인증 없이 Markdown 파일을 곧바로 게시하는 구조"
publishedAt: "2026-07-12"
---

Brainrack의 콘텐츠 원본은 이제 `content/posts` 디렉터리의 Markdown 파일이다.

## 글 작성

새 글은 영문 소문자와 하이픈으로 된 파일명을 사용한다.

```text
content/posts/my-new-post.md
```

파일 상단에는 다음 front matter가 필요하다.

```yaml
---
title: "글 제목"
description: "목록과 메타데이터에 표시할 요약"
publishedAt: "2026-07-12"
---
```

외부 출처가 있으면 `sourceUrl`을 추가할 수 있다. 본문은 일반 Markdown과 GFM 표, 체크리스트, 코드 블록을 지원한다.

## 게시

파일을 커밋하고 배포하면 끝이다. 별도 관리자 화면, 로그인, 데이터베이스 동기화는 없다.
