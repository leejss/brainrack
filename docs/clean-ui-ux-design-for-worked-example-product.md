# Clean UI/UX Design for AI Worked Example Generator

조사일: 2026-07-02

## 요약

이 제품은 일반적인 AI chatbot이 아니다. 사용자의 핵심 목표는 AI와 대화하는 것이 아니라, LeetCode problem 하나를 빠르게 `Worked Example` 학습 문서로 변환하는 것이다.

따라서 UI의 중심은 chat thread가 아니라 `problem command -> generation status -> structured Markdown document -> save/reuse` 흐름이어야 한다.

핵심 디자인 원칙:

> UI는 사라지고, problem -> reasoning -> code -> reflection 흐름만 남아야 한다.

이 제품의 clean design은 비어 보이는 minimalism이 아니다. 학습에 필요한 구조만 남기는 **instructional minimalism**이다.

## 1. Product Context

### 1.1 Core Feature

User가 text field에 다음 중 하나를 입력한다.

- LeetCode URL
- problem number
- problem title
- pasted problem statement

AI model은 research-based Worked Example을 streaming Markdown으로 생성한다.

생성물은 다음을 포함한다.

- problem restatement
- constraint reading
- pattern recognition
- brute force
- bottleneck
- core insight
- subgoal plan
- trace
- invariant
- implementation
- complexity
- edge cases
- self-explanation prompts
- transfer hook

### 1.2 UX의 핵심 위험

이 제품은 잘못 디자인하면 곧바로 “AI answer generator”로 오해된다. 그러면 사용자는 schema acquisition보다 solution consumption에 빠진다.

위험한 UX:

- chat bubble 중심 UI
- 큰 AI sparkle visual
- `Show Solution` 중심 CTA
- code block을 너무 빨리 노출
- model/provider setting을 과하게 노출
- long-form explanation이 code와 떨어져 있는 layout
- history/bookmark가 output보다 시각적으로 강한 구조

좋은 UX:

- `Generate Worked Example` 하나의 primary action
- output은 document reader로 표시
- code보다 reasoning sections가 먼저 보임
- `model`, `mode`, `language`, `resolved problem`은 작은 metadata row로 노출
- history/bookmark는 reuse를 돕는 secondary surface

## 2. Design Thesis

### 2.1 Workbench, Not Chatbot

Chatbot UI는 conversational task에는 적합하지만, 이 제품의 primary artifact는 대화가 아니라 학습 문서다. Chat bubble은 다음 문제를 만든다.

- structured section scanning이 어렵다.
- generated document가 대화의 일부처럼 보인다.
- long code block이 bubble 안에서 읽기 어렵다.
- user가 “질문을 더 잘 던지는 법”에 집중하게 된다.

이 제품은 `algorithm learning workbench`로 설계해야 한다.

권장 구조:

```text
Left Sidebar
- Brand
- New
- History
- Bookmarks

Main
- Compact header
- Problem command
- Language / Mode / Model metadata
- Streaming status
- Markdown document
- Actions: Bookmark / Copy / Export / Regenerate
```

### 2.2 Instructional Minimalism

Minimalism은 요소를 줄이는 것이 아니라, 사용자가 지금 해야 하는 cognitive work만 남기는 것이다.

이 제품에서 사용자가 해야 하는 cognitive work:

- 어떤 문제를 학습할지 입력한다.
- 어떤 language와 learner mode로 볼지 선택한다.
- AI output이 어떤 assumption으로 생성됐는지 확인한다.
- Worked Example을 읽고 schema를 형성한다.
- 필요하면 저장하거나 다시 생성한다.

이외의 장식, hero copy, social/ranking/gamification은 MVP에서 제거해야 한다.

## 3. Research Basis

### 3.1 Cognitive Load와 UI

NN/g는 cognitive load를 줄이기 위해 visual clutter를 피하고, 기존 mental model을 활용하고, 사용자가 기억해야 하는 일을 UI가 덜어줘야 한다고 설명한다.

제품 적용:

- input option을 여러 field로 나누지 말고 하나의 command field로 둔다.
- `URL / number / title / pasted statement`를 한 field에서 허용한다.
- generated output은 section heading이 고정된 Markdown으로 보여준다.
- `language`, `mode`, `model`은 사용자가 기억하지 않아도 metadata row에 남긴다.
- history와 bookmarks는 local storage에 남겨 user recall 부담을 줄인다.

### 3.2 Form UX

NN/g의 form design 원칙은 `structure`, `transparency`, `clarity`, `support`로 요약된다.

제품 적용:

- Structure: command field, controls, primary CTA를 하나의 input surface 안에 묶는다.
- Transparency: 생성 중에는 `Generating`, `Streaming`, `model`, `mode`를 보여준다.
- Clarity: placeholder는 가능한 input type을 말한다.
- Support: problem data를 가져오지 못하면 pasted statement fallback을 안내한다.

### 3.3 Generative AI UX

Generative AI application은 output variability와 imperfection을 가진다. 사용자는 AI가 무엇을 만들고 있는지, 어떤 control을 갖는지, 결과를 어떻게 수정하거나 재시도할 수 있는지 알아야 한다.

제품 적용:

- `Stop` action은 streaming 중 visible해야 한다.
- `Regenerate`는 document toolbar에 있어야 한다.
- `model`, `provider`, `language`, `mode`는 compact metadata로 노출한다.
- AI output은 final truth처럼 보이면 안 된다. Markdown document로 보여주되, user가 copy/export/bookmark할 수 있는 generated artifact로 다룬다.

### 3.4 Aesthetic and Minimalist Design

Nielsen heuristic의 “Aesthetic and Minimalist Design”은 모든 element가 목적을 가져야 한다는 뜻이다.

제품 적용:

- 하나의 primary CTA만 둔다.
- decorative card grid를 만들지 않는다.
- page section을 card 안에 또 card로 감싸지 않는다.
- icon-only action은 familiar icons에만 사용하고 aria label/title을 제공한다.
- output reader는 넓은 prose width보다 constrained document width가 맞다.

### 3.5 Apple HIG: Clarity and Directness

Apple HIG는 clear and direct design을 강조한다. 이 제품에서는 Jony Ive-style restraint를 다음처럼 해석할 수 있다.

- 기능을 설명하는 copy보다 기능 자체를 전면에 둔다.
- 장식보다 hierarchy와 alignment를 우선한다.
- controls는 조용하고, primary action만 분명하게 만든다.
- surface는 적고, content는 선명하게 만든다.

## 4. Information Architecture

### 4.1 Primary Surfaces

이 제품의 primary surfaces는 세 개다.

1. Sidebar
2. Command Area
3. Document Reader

각 surface의 책임은 명확히 달라야 한다.

### 4.2 Sidebar

역할:

- 이전 generation 재사용
- bookmarked output 빠른 접근
- 새 generation 시작

포함:

- Brand
- `New` icon button
- `History / Bookmarks` segmented filter
- history item list

History item에 포함할 정보:

- problem title
- created time
- language
- bookmark status

History item에 포함하지 않을 정보:

- generated content preview
- long query
- model detail
- full timestamp
- excessive action buttons

### 4.3 Command Area

역할:

- problem input
- language/mode selection
- generation trigger

권장 구성:

```text
Problem textarea
Language segmented control
Mode segmented control
Generate / Stop button
Example chips
```

하나의 command surface 안에 묶는 이유:

- user가 command를 구성하는 데 필요한 controls가 한눈에 보인다.
- form field와 CTA 사이의 relation이 명확하다.
- desktop/mobile 모두에서 task boundary가 분명하다.

### 4.4 Metadata Row

역할:

- AI output의 context를 작고 명확하게 남긴다.

포함:

- resolved title 또는 current query title
- status: `Ready`, `Generating`, `Needs attention`
- language
- mode
- provider
- model

메타데이터는 중요하지만 primary content가 아니다. 작은 row로 충분하다.

### 4.5 Document Reader

역할:

- Worked Example을 읽고 학습하는 공간

권장:

- constrained width: 약 65-75ch
- Markdown heading hierarchy
- Shiki highlighted code blocks
- section spacing 충분히
- table/list readable
- action toolbar는 document 위에 얇게 배치

비권장:

- output 전체를 chat bubble 안에 넣기
- 각 section을 별도 card로 감싸기
- code와 explanation이 멀리 떨어지는 layout
- long full-width text line

## 5. Visual Design Direction

### 5.1 Tone

톤앤매너는 LeetCode를 참고하되 clone하지 않는다.

가져올 것:

- neutral surface
- quiet dark sidebar
- warm orange accent
- code/editor-like contrast
- compact operational UI

가져오지 않을 것:

- problem solving platform 전체 navigation
- ranking/contest/social signals
- dense table UI
- gamified pressure

### 5.2 Palette

OKLCH 기반 palette를 권장한다.

권장 token family:

- `canvas`: warm near-white background
- `panel`: pure or near-white surface
- `output`: document reader surface
- `line`: low-chroma divider
- `muted`: secondary text
- `sidebar`: dark cool neutral
- `accent`: warm orange
- `accent-soft`: pale orange metadata/state background
- `danger`: error state
- `code`: dark code block surface

Color principle:

- grayscale hierarchy first
- accent is for primary CTA and important learning signals only
- semantic colors are sparse
- no decorative gradients or orbs

### 5.3 Typography

이 제품은 reading product다. Typography가 UI의 핵심이다.

권장:

- body: 15-16px, line-height 1.6-1.75
- labels: 11-12px uppercase, muted
- headings: 24-30px max for app header
- document heading: smaller than page title
- code: mono font, 13-14px, line-height 1.6-1.75
- text-wrap: `balance` for headings, `pretty` for body

피해야 할 것:

- hero-scale heading
- negative letter spacing
- viewport-based font scaling
- long full-width paragraph

### 5.4 Spacing

Use a constrained spacing scale.

권장 scale:

- 4px: icon/text tight gap
- 8px: related controls
- 16px: component internal padding
- 24px: section grouping
- 32px: major group separation
- 48px+: page-level whitespace

이 제품은 dashboard보다 reading tool에 가깝다. command area는 compact하게, document area는 넉넉하게 둔다.

### 5.5 Shape and Depth

Jony Ive-style restraint를 유지하려면 radius와 shadow를 과하게 쓰지 않는다.

권장:

- card radius: 8px 이하
- inner control radius: 6px
- soft shadow only for raised surfaces
- no nested card stacks
- document reader는 surface 하나로 충분

## 6. Interaction Design

### 6.1 Primary Action

Primary action은 `Generate` 하나다.

Rules:

- 입력이 비었으면 disabled
- streaming 중에는 `Stop`으로 바뀐다
- icon + text를 사용한다
- mobile에서도 44px 이상 touch target을 유지한다

### 6.2 Secondary Actions

Document toolbar:

- Bookmark
- Copy
- Download
- Regenerate

Rules:

- output이 없으면 disabled
- icon-only action은 tooltip/title과 aria-label 필요
- destructive action 없음
- action bar는 output보다 시각적으로 약해야 한다

### 6.3 Streaming State

Streaming은 단순 spinner보다 staged feedback이 낫다.

권장:

- metadata row에 `Streaming` badge 표시
- document reader에 skeleton 표시
- output chunks가 오면 즉시 Markdown으로 보여준다
- user가 멈출 수 있게 `Stop` 제공

### 6.4 Error State

Error message는 다음을 포함해야 한다.

- 무엇이 실패했는지
- 왜 실패했을 가능성이 있는지
- 사용자가 다음에 할 수 있는 action

예:

```text
Google API key가 설정되지 않았습니다.
.env.local에 GOOGLE_GENERATIVE_AI_API_KEY를 추가한 뒤 다시 시도하세요.
```

비권장:

```text
Generation failed.
```

## 7. Responsive Design

### 7.1 Desktop

Desktop layout:

```text
17rem sidebar | main content
```

Desktop에서 sidebar는 sticky로 유지한다. history/bookmarks는 반복 접근 surface이기 때문이다.

### 7.2 Mobile

Mobile에서 sidebar를 drawer로 숨기는 것도 가능하지만, MVP에서는 상단 history rail이 더 단순하다.

Mobile layout:

```text
Top sidebar block
Main command
Metadata row
Document reader
```

주의:

- long URL chip은 mobile에서 overflow하지 않아야 한다.
- segmented controls는 2-column으로 유지한다.
- command field와 Generate button은 같은 visual group 안에 둔다.
- document reader는 full width에 가깝게 쓰되 inner padding을 유지한다.

## 8. Accessibility

### 8.1 Contrast

Body text는 WCAG AA 기준 4.5:1 이상을 목표로 한다.

주의:

- muted text는 너무 밝게 하지 않는다.
- orange accent 위 text는 충분히 어둡게 한다.
- disabled state는 낮은 contrast가 허용되지만, active state와 혼동되지 않아야 한다.

### 8.2 Keyboard and Screen Reader

필수:

- textarea focus visible
- button focus visible
- icon-only button은 `aria-label` 필요
- segmented control은 button group으로 동작
- status update는 추후 `aria-live` 고려

### 8.3 Touch Targets

Mobile controls는 최소 40-44px 높이를 유지한다.

해당 controls:

- New button
- History item
- Bookmark button
- Copy/Download/Regenerate
- Segmented controls
- Generate/Stop

## 9. Product-Specific UI Patterns

### 9.1 Command Field

단일 command field는 이 제품에 적합하다.

이유:

- user가 URL/number/title 중 어떤 입력을 해야 하는지 고민하지 않아도 된다.
- pasted statement fallback도 같은 surface에서 처리 가능하다.
- future command palette로 확장 가능하다.

권장 placeholder:

```text
LeetCode URL, number, title, or pasted statement
```

### 9.2 Metadata Strip

Metadata strip은 generated artifact의 provenance를 보여준다.

권장 표시:

```text
Two Sum
Ready · TypeScript · Guided
google · gemini-3.5-flash
```

이 정보는 trust를 높이지만, document보다 강하면 안 된다.

### 9.3 History and Bookmarks

History는 local storage에 저장된다.

권장:

- 최대 30개
- newest first
- title + time + language
- bookmark toggle
- bookmarks filter

추후:

- search history
- delete generation
- rename saved output
- sync account

### 9.4 Markdown Document

Markdown renderer는 product core다.

필수:

- clear heading scale
- readable list/table
- Shiki code highlight
- inline code styling
- constrained width

피해야 할 것:

- rendered Markdown을 app chrome보다 약하게 보이게 하기
- code block을 light gray로 보여주기
- line-by-line explanation을 long prose로 밀어넣기

## 10. Anti-Patterns

### 10.1 Chat Bubble Output

이 제품은 conversation artifact가 아니라 learning artifact를 만든다. Chat bubble은 long Markdown과 code block을 읽기 어렵게 만든다.

### 10.2 Hero Page

Landing hero는 이 제품의 task를 지연시킨다. 첫 화면은 바로 usable command surface여야 한다.

### 10.3 Decorative AI Branding

Sparkle, glow, gradient, abstract AI decoration은 조심해야 한다. AI가 핵심이지만, user의 목표는 AI를 보는 것이 아니라 problem schema를 이해하는 것이다.

### 10.4 Too Many Cards

모든 section을 card로 감싸면 hierarchy가 무너지고 clutter가 늘어난다. Card는 repeated item, modal, tool surface에만 쓴다.

### 10.5 Model Settings First

Provider/model 설정은 important하지만 primary task가 아니다. 기본값은 `gemini-3.5-flash`로 두고, advanced setting은 추후 progressive disclosure로 옮긴다.

## 11. Recommended UI Structure

최종 권장 구조:

```text
App Shell
├── Sidebar
│   ├── Brand
│   ├── New
│   ├── History / Bookmarks filter
│   └── Generation list
└── Main
    ├── Compact header
    ├── Problem command surface
    │   ├── Textarea
    │   ├── Language segmented control
    │   ├── Mode segmented control
    │   └── Generate / Stop
    ├── Example chips
    ├── Metadata strip
    └── Document area
        ├── Toolbar
        └── Markdown reader
```

## 12. Implementation Checklist

### Visual Hierarchy

- [ ] Page title is short and clear.
- [ ] Primary CTA is the only visually strong button.
- [ ] Labels are smaller and muted.
- [ ] Metadata is visible but secondary.
- [ ] Document reader is the strongest content surface after generation.

### Layout

- [ ] Sidebar supports History and Bookmarks.
- [ ] Command controls are visually grouped.
- [ ] Output document has constrained width.
- [ ] Mobile layout has no horizontal overflow.
- [ ] Text does not overlap or clip.

### Interaction

- [ ] Generate disabled when input is empty.
- [ ] Stop visible during streaming.
- [ ] Copy/Download/Bookmark disabled when no output exists.
- [ ] Regenerate reuses current query.
- [ ] History item restores query, mode, language, and Markdown.

### Accessibility

- [ ] Icon-only buttons have aria-label.
- [ ] Interactive target height is at least 40px.
- [ ] Focus states are visible.
- [ ] Muted text remains readable.
- [ ] Streaming status can be made screen-reader friendly.

### AI Transparency

- [ ] Provider and model visible in metadata row.
- [ ] Language and mode visible.
- [ ] Ambiguous problem resolution is not silently fabricated.
- [ ] Error states provide next action.

## 13. Conclusion

이 제품의 clean UI/UX는 “더 비어 보이게 만들기”가 아니다. 핵심은 learning flow를 방해하는 모든 것을 제거하고, AI-generated Worked Example을 신뢰 가능한 학습 artifact로 읽게 만드는 것이다.

가장 중요한 판단:

> 이 제품은 chatbot이 아니라 algorithm learning workbench다.

따라서 UI는 command, metadata, document, history만 남겨야 한다. 장식적 AI visual, 큰 hero, chat bubble, 과한 setting surface는 모두 MVP의 core learning outcome을 약하게 만든다.

## References

### Nielsen Norman Group - Minimize Cognitive Load to Maximize Usability

URL: https://www.nngroup.com/articles/minimize-cognitive-load/

Original quote:

> "Avoid visual clutter"

적용: decorative element, redundant cards, unnecessary AI branding을 줄이고 command/document 중심으로 구성한다.

### Nielsen Norman Group - What Is Cognitive Load?

URL: https://www.nngroup.com/videos/cognitive-load/

Original quote:

> "avoid visual clutter, build on existing mental models, and offload tasks"

적용: local history/bookmarks, single command field, metadata row로 user memory load를 낮춘다.

### Nielsen Norman Group - 4 Principles to Reduce Cognitive Load in Forms

URL: https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/

Original quote:

> "structure, transparency, clarity, and support"

적용: command area를 하나의 visual group으로 묶고, generation status와 fallback action을 명확하게 제공한다.

### Nielsen Norman Group - Designing AI Products and Features

URL: https://www.nngroup.com/articles/designing-ai-study-guide/

Original quote:

> "designing AI products and features"

적용: AI-specific UX는 model behavior, user trust, transparency, control을 다뤄야 한다.

### Weisz et al. - Design Principles for Generative AI Applications

URL: https://arxiv.org/abs/2401.14484

Original quote:

> "six principles for the design of generative AI applications"

적용: generative variability 때문에 user control, explanation, exploration, harm mitigation이 필요하다.

### Apple Human Interface Guidelines - Design Principles

URL: https://developer.apple.com/design/human-interface-guidelines/design-principles

Original quote:

> "Be clear and direct"

적용: Jony Ive-style restraint는 decorative minimalism이 아니라 directness, clarity, element discipline으로 해석한다.

### Material Design 3

URL: https://m3.material.io/

Original quote:

> "user-friendly interfaces"

적용: tokens, typography, shape, state, layout을 system으로 다뤄 UI consistency를 확보한다.

### GitHub Primer

URL: https://primer.style/

Original quote:

> "The Design System for GitHub"

적용: developer-facing product는 neutral surfaces, accessible color system, compact operational UI가 적합하다.
