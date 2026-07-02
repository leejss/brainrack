# PRD: AI Worked Example Generator for LeetCode Problems

작성일: 2026-07-02

## 1. Summary

사용자가 text field에 LeetCode link, 문제 번호, 또는 문제 title을 입력하면, 시스템이 해당 문제를 식별하고 AI model이 research-based Worked Example explanation을 생성한다.

이 기능의 목적은 정답 코드를 빠르게 보여주는 것이 아니다. 목적은 learner가 LeetCode problem을 algorithm schema로 이해하도록 돕는 것이다.

핵심 product promise:

> LeetCode 문제를 입력하면, AI가 Cognitive Load Theory와 Worked Example research에 맞는 학습용 풀이 설명을 생성한다.

Default generation model은 Google `gemini-3.5-flash`로 둔다. 단, model provider와 model id는 configuration으로 분리한다.

## 2. Background

수집된 research의 공통 결론은 명확하다.

- LeetCode solving은 초보자에게 cognitive load가 높다.
- `문제 -> 빈 editor` flow는 learner의 working memory를 means-end search에 많이 소모시킨다.
- Worked Example은 expert reasoning을 구조화해 learner가 reusable algorithm schema를 형성하도록 돕는다.
- 좋은 Worked Example은 정답 코드가 아니라 `problem parsing`, `pattern recognition`, `subgoal plan`, `trace`, `invariant`, `complexity reasoning`, `transfer hook`을 포함해야 한다.
- AI는 answer generator가 아니라 scaffolded tutor로 동작해야 한다.

Internal research documents:

- [Cognitive Load Theory 기반 LeetCode 학습 도구 리서치 보고서](/Users/NWZ-leejss/projects/personal/brainrack/docs/cognitive-load-theory-for-leetcode-learning-tool.md)
- [Worked Example 기반 LeetCode 학습 도구 리서치 보고서](/Users/NWZ-leejss/projects/personal/brainrack/docs/worked-examples-for-leetcode-learning.md)
- [개발자들은 왜 LeetCode 문제를 풀어야 하는가?](/Users/NWZ-leejss/projects/personal/brainrack/docs/why-developers-should-practice-leetcode.md)

## 3. Goals

### 3.1 Product Goals

- 사용자가 LeetCode 문제를 빠르게 입력하고 Worked Example을 생성할 수 있게 한다.
- AI output을 research-based structure로 고정해 explanation 품질의 변동성을 줄인다.
- 단순 solution reveal이 아니라 schema acquisition을 돕는다.
- 초보자가 blank editor에 바로 던져지지 않도록 problem understanding과 pattern recognition을 먼저 제공한다.
- 향후 `completion task`, `hint ladder`, `self-explanation`, `mastery tracking`으로 확장 가능한 content model을 만든다.

### 3.2 Learning Goals

- learner가 문제의 surface detail보다 deep structure를 보게 한다.
- learner가 primary algorithm pattern과 invariant를 이해하게 한다.
- learner가 brute force에서 optimized solution으로 이동하는 reasoning을 따라가게 한다.
- learner가 같은 schema를 다른 문제로 transfer할 수 있게 한다.

## 4. Non-Goals

MVP에서 하지 않는다.

- LeetCode 전체 clone
- ranking, streak, social feed
- online judge 구현
- user code 실행 및 채점
- 자동 solved count tracking
- 모든 programming language 지원
- 모든 LeetCode 문제에 대해 curated human-authored content 제공
- AI가 정답 코드만 생성하는 기능
- LeetCode 유료 문제 우회 또는 비인가 content scraping

## 5. Target Users

### 5.1 Primary User

LeetCode를 풀기 시작했거나, pattern은 들어봤지만 문제에 적용하는 데 어려움을 겪는 novice-to-intermediate developer.

Pain points:

- 문제를 읽어도 어떤 pattern인지 모르겠다.
- solution을 봐도 왜 그렇게 푸는지 모르겠다.
- 코드 한 줄은 이해하지만 전체 plan이 안 보인다.
- 비슷한 문제를 만나도 transfer가 안 된다.
- AI에게 물으면 정답 코드는 나오지만 학습이 남지 않는다.

### 5.2 Secondary User

Interview preparation 중인 developer.

Needs:

- 빠르게 문제의 핵심 pattern을 이해하고 싶다.
- brute force에서 optimized solution으로 설명하는 연습을 하고 싶다.
- invariant와 complexity explanation을 interview-ready하게 정리하고 싶다.

## 6. Core User Flow

### 6.1 Happy Path

1. User가 text field에 LeetCode URL, problem number, 또는 problem title을 입력한다.
2. System이 input을 normalize한다.
3. System이 matching problem candidate를 찾는다.
4. 단일 match면 자동 선택한다.
5. ambiguous match면 user에게 candidate list를 보여주고 선택하게 한다.
6. System이 problem metadata와 problem statement를 확보한다.
7. AI generation request를 만든다.
8. Default model `gemini-3.5-flash`가 Worked Example을 생성한다.
9. System이 output을 structured sections로 render한다.
10. User는 Worked Example을 읽고, 필요한 경우 regenerate 또는 refinement action을 실행한다.

### 6.2 Fallback Path

Problem statement를 안정적으로 확보하지 못하면 user에게 문제 본문을 붙여넣도록 요청한다.

Fallback message는 짧아야 한다.

> 문제 본문을 가져오지 못했습니다. Problem statement를 붙여넣으면 같은 형식으로 Worked Example을 생성할 수 있습니다.

## 7. Input Requirements

### 7.1 Supported Inputs

Text field는 다음 입력을 지원한다.

- LeetCode URL  
  예: `https://leetcode.com/problems/two-sum/`

- Problem number  
  예: `1`, `15`, `424`

- Problem title  
  예: `Two Sum`, `Longest Substring Without Repeating Characters`

- Mixed input  
  예: `leetcode 424 character replacement`

### 7.2 Input Normalization

System은 입력을 다음 값으로 normalize한다.

- `rawInput`
- `inputType`: `url | number | title | mixed | unknown`
- `slug`
- `problemNumber`
- `titleCandidate`
- `confidence`

### 7.3 Ambiguity Handling

문제 번호는 보통 deterministic하다. Title 또는 mixed input은 ambiguity가 있을 수 있다.

Ambiguous case:

- 유사 title이 여러 개 있음
- problem number와 title이 충돌함
- input이 너무 짧음
- premium problem 또는 unavailable problem

이 경우 system은 최대 5개 candidate를 보여준다.

Candidate display:

- problem number
- title
- difficulty
- tags, 가능하면 표시

## 8. Problem Data Requirements

Worked Example 생성에는 최소한 다음 데이터가 필요하다.

- problem title
- problem statement
- examples
- constraints

가능하면 다음 데이터도 사용한다.

- difficulty
- official tags 또는 inferred tags
- follow-up
- related topics

주의:

LeetCode content fetch는 ToS와 접근 권한을 존중해야 한다. MVP에서는 안정적이고 허용된 source가 없으면 user paste fallback을 기본 안전장치로 둔다.

## 9. Output Requirements

AI output은 free-form essay가 아니라 structured Worked Example이어야 한다.

### 9.1 Required Sections

모든 generated Worked Example은 다음 section을 포함한다.

1. `Problem Restatement`
2. `Input / Output`
3. `Constraint Reading`
4. `Pattern Recognition`
5. `Brute Force`
6. `Bottleneck`
7. `Core Insight`
8. `Subgoal Plan`
9. `Trace`
10. `Invariant`
11. `Implementation`
12. `Complexity`
13. `Edge Cases`
14. `Self-Explanation Prompts`
15. `Transfer Hook`

### 9.2 Section Intent

`Problem Restatement`  
문제를 learner의 언어로 다시 설명한다. 원문을 길게 복사하지 않는다.

`Constraint Reading`  
Constraints가 algorithm choice에 어떤 신호를 주는지 설명한다.

`Pattern Recognition`  
Primary pattern과 rejected alternatives를 짧게 설명한다.

`Brute Force`  
가장 직접적인 풀이와 complexity를 설명한다.

`Bottleneck`  
Brute force에서 무엇이 반복 계산되는지 설명한다.

`Core Insight`  
Optimized solution의 핵심을 한 문장으로 압축한다.

`Subgoal Plan`  
Implementation 전에 high-level plan을 4-7개 subgoal로 나눈다.

`Trace`  
작은 example로 state가 바뀌는 결정적 순간만 보여준다.

`Invariant`  
Loop, recursion, window, queue, DP table이 유지해야 하는 조건을 명시한다.

`Implementation`  
Code는 subgoal label이 붙은 block 단위로 제공한다.

`Complexity`  
왜 그 complexity인지 movement, state count, edge count 등으로 설명한다.

`Self-Explanation Prompts`  
Learner가 이해를 점검할 수 있는 짧은 질문을 3-5개 제공한다.

`Transfer Hook`  
같은 schema를 쓰는 다른 문제 유형 또는 follow-up variation을 제시한다.

### 9.3 Output Style

- 한국어로 설명하되 algorithm terms는 English를 유지한다.
- 정답 코드보다 reasoning을 먼저 보여준다.
- 긴 강의체를 피하고 section별로 짧게 쓴다.
- `pattern name`만 말하지 않고 invariant를 반드시 설명한다.
- code comment는 subgoal label 중심으로 쓴다.
- 잘 모르는 problem detail은 단정하지 않는다.

## 10. AI Generation Requirements

### 10.1 Default Model

Default model:

```text
gemini-3.5-flash
```

Google AI for Developers 문서 기준으로 `gemini-3.5-flash`는 stable model id로 제공된다. 구현에서는 model id를 hard-code하지 않고 environment config로 관리한다.

### 10.2 Model Configuration

Required config:

- `AI_PROVIDER=google`
- `AI_MODEL=gemini-3.5-flash`
- `AI_TEMPERATURE`
- `AI_MAX_OUTPUT_TOKENS`
- `AI_TIMEOUT_MS`

권장 기본값:

- temperature: `0.3`
- timeout: `60s`
- max output tokens: product UI에 맞춰 제한

### 10.3 Prompt Contract

Prompt는 최소한 다음 정보를 포함해야 한다.

- normalized problem metadata
- problem statement
- examples
- constraints
- desired learner level, default `novice-intermediate`
- required output schema
- style constraints
- anti-pattern constraints

Prompt는 AI에게 다음을 명시적으로 금지해야 한다.

- 원문 problem statement를 길게 복사
- full solution만 먼저 제시
- pattern label만 말하고 reasoning 생략
- 지나치게 긴 generic explanation
- 존재하지 않는 LeetCode follow-up을 단정
- code만 출력

### 10.4 Output Validation

AI response는 render 전에 최소 validation을 거친다.

Required validation:

- required sections 존재 여부
- implementation code block 존재 여부
- invariant section 존재 여부
- complexity section 존재 여부
- self-explanation prompt 3개 이상
- output length upper bound

Validation 실패 시:

1. 같은 model로 repair prompt를 보낸다.
2. repair도 실패하면 partial output과 error state를 보여준다.

## 11. Domain Model

### 11.1 Core Entities

```text
ProblemQuery
ProblemCandidate
ProblemSource
LeetCodeProblem
WorkedExampleRequest
WorkedExample
WorkedExampleSection
GenerationModel
GenerationRun
ValidationResult
```

### 11.2 Entity Responsibilities

`ProblemQuery`  
User input을 normalize한 값.

`ProblemCandidate`  
입력에서 추론된 possible problem.

`ProblemSource`  
Problem metadata와 statement를 가져오는 source. Approved source와 user paste fallback을 구분한다.

`LeetCodeProblem`  
AI generation에 필요한 canonical problem data.

`WorkedExampleRequest`  
AI prompt 생성을 위한 request object.

`WorkedExample`  
Validated structured output.

`GenerationRun`  
Model, prompt version, duration, token usage, status를 기록한다.

`ValidationResult`  
Output schema 준수 여부와 repair 필요 여부.

## 12. Functional Requirements

### FR1. Problem Input

User는 하나의 text field에 URL, number, title을 입력할 수 있어야 한다.

Acceptance criteria:

- URL에서 slug를 추출한다.
- 숫자만 입력하면 problem number로 처리한다.
- title 입력은 fuzzy match를 수행한다.
- unknown input이면 명확한 error message를 보여준다.

### FR2. Problem Resolution

System은 input을 LeetCode problem으로 resolve해야 한다.

Acceptance criteria:

- single high-confidence match는 자동 선택한다.
- multiple candidates는 user selection을 요구한다.
- unavailable problem은 paste fallback을 제공한다.

### FR3. Worked Example Generation

System은 resolved problem으로 Worked Example을 생성해야 한다.

Acceptance criteria:

- default model은 `gemini-3.5-flash`다.
- required sections가 모두 생성된다.
- code보다 reasoning section이 먼저 나온다.
- output은 한국어 중심이며 algorithm terms는 English로 유지된다.

### FR4. Structured Rendering

Generated output은 section 단위로 render되어야 한다.

Acceptance criteria:

- section headings가 고정되어 있다.
- code block은 syntax highlighting이 가능해야 한다.
- subgoal labels가 code 근처에 표시된다.
- invariant와 complexity가 별도 section으로 구분된다.

### FR5. Regeneration

User는 generation이 마음에 들지 않으면 regenerate할 수 있어야 한다.

Acceptance criteria:

- regenerate는 같은 problem data를 재사용한다.
- previous output을 덮어쓰기 전에 run history에 기록한다.
- regenerate reason을 optional로 입력할 수 있다.

### FR6. Copy / Export

User는 generated Worked Example을 복사하거나 Markdown으로 export할 수 있어야 한다.

Acceptance criteria:

- 전체 복사
- section별 복사
- Markdown export

## 13. Non-Functional Requirements

### 13.1 Latency

Target:

- problem resolution: 2초 이내
- AI generation first response: 10초 이내
- full generation: 60초 이내

### 13.2 Reliability

- AI provider timeout 시 retry는 최대 1회
- provider failure 시 user에게 명확한 retry action 제공
- prompt/version/model/run metadata 저장

### 13.3 Cost Control

- input problem data를 cache한다.
- repeated generation은 user action이 있을 때만 실행한다.
- max output tokens를 제한한다.
- model id는 config로 관리해 cheaper model fallback 가능성을 열어둔다.

### 13.4 Safety and Compliance

- LeetCode content를 무단으로 대량 저장하지 않는다.
- premium content를 우회하지 않는다.
- problem statement unavailable 시 user paste fallback을 사용한다.
- AI output에는 original problem statement의 장문 복제를 피한다.

## 14. UX Requirements

### 14.1 First Screen

첫 화면은 product core action을 바로 보여준다.

Required UI:

- single input field
- primary action: `Generate Worked Example`
- optional examples: URL, number, title
- recent generations, 있으면 표시

불필요한 landing page는 만들지 않는다.

### 14.2 Loading State

Generation 중에는 현재 단계를 보여준다.

Stages:

1. 문제 식별 중
2. 문제 정보 준비 중
3. Worked Example 생성 중
4. 구조 검증 중

### 14.3 Error State

Error는 다음 action을 포함해야 한다.

- 다시 시도
- candidate 직접 선택
- problem statement 붙여넣기

### 14.4 Output Screen

Output screen은 학습 흐름 순서대로 배치한다.

Recommended layout:

- left/top: problem summary
- main: Worked Example sections
- side/inline: subgoal navigation
- bottom: self-explanation prompts and transfer hook

## 15. Success Metrics

### 15.1 Activation Metrics

- input submitted
- problem resolved
- generation completed
- generated output viewed for 30 seconds or more

### 15.2 Learning Proxy Metrics

- self-explanation prompts opened/completed
- section copy/export
- regenerate rate
- user rating: explanation helped me understand the pattern
- transfer hook click/open

### 15.3 Quality Metrics

- required section validation pass rate
- invariant missing rate
- code-only output rate
- user-reported incorrect explanation rate
- average generation latency
- generation cost per output

## 16. Risks

### 16.1 Problem Data Access

LeetCode problem data access may be unstable or restricted. MVP must support paste fallback.

### 16.2 AI Hallucination

AI may generate incorrect pattern, invalid code, or unsupported follow-up. Output validation catches structure, not correctness. Correctness validation needs later code execution or judge integration.

### 16.3 Over-Helping

If AI gives full solution too early, learner may consume answer without schema acquisition. Prompt and UI should place reasoning, subgoal, and invariant before code.

### 16.4 Model Drift

Default model behavior can change. Store prompt version, model id, generation timestamp, and output validation result.

### 16.5 Copyright / Content Policy

Problem statement should not be unnecessarily reproduced in full. The app should summarize problem understanding and rely on user-provided or approved source content.

## 17. Open Questions

- MVP에서 problem data source는 무엇으로 둘 것인가?
- User paste fallback을 core flow에 얼마나 노출할 것인가?
- 초기 지원 language는 TypeScript, Python 중 무엇으로 할 것인가?
- Generated code correctness를 어떻게 검증할 것인가?
- Output을 한 번에 생성할 것인가, section streaming으로 생성할 것인가?
- Learner level을 user가 선택하게 할 것인가, default를 고정할 것인가?

## 18. MVP Cut

### Must Have

- Text field input
- URL / number / title parsing
- Problem candidate selection
- Problem statement paste fallback
- `gemini-3.5-flash` generation
- Research-based Worked Example schema
- Structured section rendering
- Basic output validation
- Markdown export

### Should Have

- Generation history
- Regenerate with reason
- Learner level selector
- Section-level copy
- Prompt version tracking

### Later

- Code execution
- Online judge integration
- Completion task generation
- Hint ladder
- User mastery tracking
- Similar problem recommendation
- Multi-model evaluation

## 19. Acceptance Test Scenarios

### Scenario 1. URL Input

Given user enters `https://leetcode.com/problems/two-sum/`  
When user clicks `Generate Worked Example`  
Then system resolves the problem and generates all required Worked Example sections.

### Scenario 2. Problem Number Input

Given user enters `3`  
When user clicks generate  
Then system resolves `Longest Substring Without Repeating Characters` or asks for confirmation if metadata confidence is low.

### Scenario 3. Ambiguous Title Input

Given user enters `substring`  
When multiple matches exist  
Then system shows candidate list instead of guessing.

### Scenario 4. Problem Data Unavailable

Given system cannot fetch problem statement  
When user wants to continue  
Then system asks user to paste problem statement and examples.

### Scenario 5. Invalid AI Output

Given AI output misses `Invariant`  
When validation runs  
Then system sends a repair prompt before rendering final output.

## 20. Reference Notes

Google AI for Developers documents `gemini-3.5-flash` as a stable Gemini API model. Release notes state that the GA version was released on 2026-05-19.

External references:

- Google AI for Developers, Gemini 3.5 Flash: https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash
- Google AI for Developers, Models: https://ai.google.dev/gemini-api/docs/models
- Google AI for Developers, Release notes: https://ai.google.dev/gemini-api/docs/changelog
