# Worked Example 기반 LeetCode 학습 도구 리서치 보고서

조사일: 2026-07-02

## 요약

LeetCode-style algorithm solving에서 Worked Example은 단순한 `정답 코드 보기`가 아니다. 효과적인 Worked Example은 expert가 문제를 어떻게 읽고, 어떤 algorithm pattern을 떠올리고, 어떤 subgoal로 쪼개고, 어떤 invariant를 유지하며, 왜 그 implementation을 선택했는지 보여주는 instructional object다.

리서치의 핵심 결론은 다음과 같다.

> 초보자에게 `문제 -> 빈 editor`를 바로 주는 것은 cognitive load가 높다. Worked Example은 solution search를 줄이고, learner가 reusable algorithm schema를 형성하도록 돕는다.

LeetCode 학습 도구에 적용하면, 핵심 SoT는 `Problem`이 아니라 `Pattern Schema`여야 한다. 문제는 schema를 보여주는 instance다. 따라서 학습 도구는 `Show Solution` 버튼보다 `Study Worked Example`, `Explain Subgoal`, `Complete Missing Step`, `Transfer to Similar Problem` flow를 중심에 둬야 한다.

## 1. Research Question

이번 리서치의 질문은 다음이다.

- Worked Example은 algorithm problem solving 학습에서 왜 효과적인가?
- Programming / algorithm education 연구에서 어떤 Worked Example design이 검증되었는가?
- LeetCode-style 문제 풀이 도구에 적용하려면 어떤 content model과 UX가 필요한가?
- AI tutor는 Worked Example을 어떻게 도와야 하고, 어디서 방해가 되는가?

## 2. Worked Example의 정의

Worked Example은 learner가 직접 문제를 풀기 전에 expert solution을 학습하도록 제공하는 instructional material이다. 일반적으로 다음을 포함한다.

- problem statement
- step-by-step solution
- final answer
- optional diagram, trace, explanation, annotation

하지만 LeetCode-style algorithm solving에서는 이 정의만으로 부족하다. 단순히 완성 code와 complexity를 보여주는 것은 Worked Example의 낮은 수준이다.

Algorithm solving용 Worked Example은 다음을 포함해야 한다.

- problem parsing
- constraint interpretation
- pattern recognition
- brute force와 bottleneck
- core insight
- subgoal plan
- state trace
- invariant
- code block with subgoal labels
- edge case reasoning
- transfer hook

즉, LeetCode용 Worked Example은 `solution artifact`가 아니라 `solution reasoning model`이다.

## 3. 왜 Worked Example이 효과적인가

### 3.1 Means-End Search를 줄인다

초보자가 처음부터 문제를 풀면 working memory의 대부분이 “어떻게든 답까지 가기”에 쓰인다. 이 과정은 means-end search에 가깝고, schema acquisition에는 비효율적일 수 있다.

Worked Example은 learner의 search space를 줄인다. learner는 처음부터 전체 solution을 만들어내는 대신, expert solution의 step 사이 관계를 이해하는 데 집중할 수 있다.

LeetCode에 적용하면 다음과 같다.

- 나쁜 flow: `problem -> blank editor -> fail -> solution`
- 좋은 flow: `problem -> worked example -> subgoal explanation -> partial completion -> similar problem`

### 3.2 Surface Detail이 아니라 Deep Structure를 보게 한다

LeetCode 문제는 surface story가 다르더라도 같은 pattern을 공유한다.

예를 들면 다음 문제들은 surface는 다르지만 같은 schema를 공유할 수 있다.

- longest substring without repeating characters
- maximum number of vowels in a substring
- minimum window substring
- longest repeating character replacement

초보자는 surface detail에 끌린다. 문자열인지 배열인지, 숫자인지 문자 등장 횟수인지에 집중한다. Worked Example이 잘 설계되면 learner는 deep structure를 본다.

Deep structure 예시:

- window는 언제 valid한가?
- right pointer는 언제 확장되는가?
- left pointer는 언제 축소되는가?
- window state는 어떤 자료구조로 유지되는가?
- answer candidate는 언제 update되는가?

### 3.3 Expert의 Tacit Knowledge를 드러낸다

숙련자는 문제를 보면 자동으로 pattern을 떠올린다. 하지만 이 과정은 learner에게 보이지 않는다. 그래서 초보자는 “왜 갑자기 hash map을 쓰지?”, “왜 binary search가 되지?”, “왜 이 DP state가 맞지?”에서 막힌다.

Worked Example은 expert의 tacit knowledge를 externalize해야 한다.

좋은 Worked Example은 코드의 결과만 보여주지 않는다.

- 어떤 signal 때문에 이 pattern을 의심했는지
- 어떤 brute force가 먼저 떠오르는지
- 그 brute force의 bottleneck이 무엇인지
- 어떤 invariant를 유지하면 bottleneck이 사라지는지
- 왜 이 implementation이 그 invariant를 보존하는지

이런 reasoning을 보여줘야 한다.

## 4. Algorithm / LeetCode 문제에서 Worked Example이 특히 중요한 이유

LeetCode solving은 초보자에게 element interactivity가 높다. 한 문제에 여러 요소가 동시에 얽힌다.

- problem statement parsing
- hidden constraint 찾기
- data structure 선택
- algorithm pattern 선택
- loop/recursion invariant 유지
- edge case 검증
- time/space complexity 설명
- implementation detail 처리

이 중 하나라도 schema가 없으면 전체 풀이가 무너진다.

예를 들어 binary search 문제는 단순히 `while left <= right`를 외운다고 풀리지 않는다. learner는 다음을 알아야 한다.

- search space가 무엇인가
- predicate가 monotonic한가
- mid가 가능한 answer인지, answer boundary인지
- left/right update가 어떤 invariant를 유지하는가
- 종료 후 어떤 값을 반환해야 하는가

이런 구조는 Worked Example로 명시적으로 보여주는 편이 좋다.

## 5. 주요 Design Pattern

### 5.1 Process-Oriented Worked Example

Product-oriented example은 완성된 solution을 보여준다. Process-oriented example은 solution에 도달하는 reasoning을 보여준다.

LeetCode 초보자에게는 process-oriented example이 더 중요하다.

Product-oriented example:

- final code
- complexity
- maybe short explanation

Process-oriented example:

- problem signal
- failed naive attempt
- bottleneck
- key insight
- subgoal plan
- trace
- invariant
- implementation
- test reasoning

초기 학습에서는 process-oriented example이 필요하고, 어느 정도 schema가 생긴 뒤에는 product-oriented example로도 충분할 수 있다.

### 5.2 Subgoal-Labeled Worked Example

Subgoal label은 여러 solution step을 기능 단위로 묶고, 그 목적을 이름 붙이는 방식이다.

Programming education 연구에서 subgoal label은 code의 low-level syntax보다 high-level procedure를 보게 만든다. LeetCode에서는 이것이 특히 중요하다. 왜냐하면 algorithm solution은 보통 몇 개의 반복 가능한 subgoal로 구성되기 때문이다.

예: Sliding Window subgoals

1. Initialize window state
2. Expand right boundary
3. Restore validity
4. Update answer
5. Return best candidate

예: BFS subgoals

1. Build initial frontier
2. Track visited state
3. Process level
4. Generate neighbors
5. Stop on target condition

예: DP subgoals

1. Define state
2. Set base cases
3. Choose iteration order
4. Apply transition
5. Extract answer

Subgoal label은 code comment보다 강한 개념이다. 단순 설명이 아니라 transfer 가능한 mental chunk다.

### 5.3 Faded Worked Example

Worked Example은 계속 완성본만 보여주면 안 된다. learner가 expertise를 얻을수록 scaffold를 줄여야 한다.

추천 fading sequence:

1. Complete worked example
2. Worked example with missing explanation
3. Worked example with missing invariant
4. Partial implementation completion
5. Pseudocode completion
6. Similar problem with hint ladder
7. Independent solve
8. Transfer problem

LeetCode 도구에서는 이 sequence가 핵심 learning loop가 될 수 있다.

### 5.4 Example-Problem Pair

Worked Example은 비슷한 practice problem과 가까이 붙어야 한다.

예:

- Worked Example: `Longest Substring Without Repeating Characters`
- Practice Problem: `Maximum Number of Vowels in a Substring`
- Transfer Problem: `Minimum Window Substring`

첫 practice는 surface가 너무 달라서는 안 된다. learner가 같은 schema를 적용한다는 사실을 인식할 수 있어야 한다. 이후 transfer problem에서 surface variation을 키운다.

### 5.5 Multiple Examples for One Pattern

하나의 Worked Example만 보면 learner가 surface detail을 schema로 착각할 수 있다. 같은 pattern에 최소 2개 이상의 example을 제공해야 한다.

예: Binary Search

- exact target search
- lower bound
- answer space binary search
- rotated sorted array

이렇게 여러 example을 보면 learner는 binary search의 본질이 `정렬 배열에서 target 찾기`만이 아니라 `monotonic predicate로 search space를 줄이는 것`임을 이해한다.

### 5.6 Self-Explanation Prompt

Worked Example은 그냥 읽게 두면 효과가 떨어진다. learner가 example을 자기 말로 설명해야 한다.

좋은 prompt:

- “이 subgoal의 목적은 무엇인가?”
- “이 loop invariant는 무엇인가?”
- “이 line이 없으면 어떤 test에서 깨지는가?”
- “왜 여기서 answer를 update하는가?”
- “이 문제와 이전 문제의 공통 schema는 무엇인가?”

나쁜 prompt:

- “이해했나요?”
- “설명해보세요.”
- “이 코드는 무엇을 하나요?”

좋은 self-explanation은 구체적이고 검증 가능해야 한다.

### 5.7 Learnersourcing / Peer Examples

AlgoSolve 계열 연구는 learner가 subgoal label을 직접 만들고, peer examples와 비교하며 개선하는 방식이 algorithmic problem-solving에 도움이 될 수 있음을 보여준다.

LeetCode 도구에 적용하면 다음이 가능하다.

- learner가 solution code block에 subgoal label을 붙인다.
- AI 또는 system이 peer/expert label과 비교한다.
- learner가 label을 수정한다.
- 좋은 label은 다음 learner의 example candidate가 된다.

이 접근은 content creation 비용을 낮출 수 있지만, quality control이 중요하다. 잘못된 peer explanation은 extraneous load를 만들 수 있다.

## 6. LeetCode용 Worked Example Content Model

Worked Example을 문서나 UI로 만들 때 다음 model을 추천한다.

### 6.1 Metadata

- `problemId`
- `title`
- `difficulty`
- `primaryPattern`
- `secondaryPatterns`
- `prerequisites`
- `targetSchema`
- `expectedPriorKnowledge`

### 6.2 Problem Understanding

- input/output restatement
- constraint interpretation
- examples parsed
- edge cases
- hidden assumptions

### 6.3 Pattern Recognition

- signal words
- data shape
- brute force shape
- bottleneck
- pattern candidates
- rejected patterns and why

### 6.4 Core Insight

한 문장으로 표현되는 핵심 insight가 있어야 한다.

예:

> 중복 없는 substring을 유지하려면, right를 확장하고 중복이 생길 때 left를 이동해 window validity를 복구한다.

### 6.5 Subgoal Plan

implementation 전에 subgoal plan을 먼저 제시한다.

예:

1. Track characters inside current window
2. Move right to include next character
3. Move left until duplicate disappears
4. Update best length

### 6.6 Trace

작은 input으로 state 변화를 보여준다.

Trace는 길면 안 된다. 핵심 전환점만 보여줘야 한다.

좋은 trace:

- duplicate가 처음 생기는 순간
- left pointer가 움직이는 순간
- answer가 update되는 순간

나쁜 trace:

- 모든 iteration을 표로 길게 나열
- state가 너무 많아 읽기 어려움
- code와 연결되지 않음

### 6.7 Code With Subgoal Labels

Code는 line-by-line explanation보다 block-by-block explanation이 낫다.

예:

```ts
// Initialize window state
let left = 0;
const seen = new Set<string>();
let best = 0;

// Expand right boundary one character at a time
for (let right = 0; right < s.length; right += 1) {
  const next = s[right];

  // Restore window validity
  while (seen.has(next)) {
    seen.delete(s[left]);
    left += 1;
  }

  // Commit the valid window and update answer
  seen.add(next);
  best = Math.max(best, right - left + 1);
}
```

이 예시는 code 자체보다 subgoal label 구조가 중요하다.

### 6.8 Invariant

모든 algorithm Worked Example은 invariant를 가져야 한다.

Sliding Window invariant:

> 매 loop 끝에서 `s[left..right]`는 중복 없는 valid window다.

Binary Search invariant:

> answer는 항상 `[left, right]` search space 안에 있거나, candidate로 저장되어 있다.

BFS invariant:

> queue에는 현재 distance에서 다음으로 확장할 frontier가 들어 있다.

Invariant는 LeetCode 학습에서 가장 중요한 schema compression 도구다.

### 6.9 Complexity

Complexity는 마지막에 형식적으로 붙이면 안 된다. Solution의 subgoal과 연결해야 한다.

나쁜 설명:

> Time complexity is O(n).

좋은 설명:

> `right`는 n번 이동하고, `left`도 전체 과정에서 최대 n번만 이동한다. 따라서 while loop가 nested처럼 보여도 total movement는 O(n)이다.

### 6.10 Transfer Hook

Worked Example의 끝에는 반드시 transfer hook이 있어야 한다.

- 같은 schema를 쓰는 문제
- surface detail만 바뀐 문제
- constraint가 바뀌어 다른 자료구조가 필요한 문제
- 이 pattern이 실패하는 문제

Transfer hook은 solved count보다 중요하다.

## 7. Worked Example UX 원칙

### 7.1 Show Solution 대신 Study Example

`Show Solution`은 learner가 answer를 소비하게 만든다. `Study Worked Example`은 reasoning을 따라가게 만들어야 한다.

권장 UI:

- problem statement
- pattern signal panel
- subgoal timeline
- trace panel
- code panel
- inline explanation
- self-explanation prompt
- next practice problem

### 7.2 Explanation은 Code 옆에 있어야 한다

Long-form explanation이 code 아래에 길게 붙으면 split attention이 생긴다. Code block과 explanation은 같은 visual context에 있어야 한다.

권장:

- code block 단위 annotation
- hover/focus explanation
- subgoal별 collapse
- trace와 code line 연결

비권장:

- code와 explanation이 멀리 떨어짐
- explanation이 너무 길어 code를 보지 않게 됨
- 같은 내용을 영상, 문단, 주석에서 중복 설명

### 7.3 Worked Example은 Interactive해야 한다

완전히 passive reading이면 효과가 떨어질 수 있다.

추천 interaction:

- 다음 subgoal 예측하기
- invariant 빈칸 채우기
- missing line 완성하기
- trace에서 next state 선택하기
- complexity reasoning 선택하기
- edge case 만들기

### 7.4 Learner Level에 따라 달라져야 한다

Novice:

- full process-oriented example
- explicit subgoal label
- small trace
- guided self-explanation

Intermediate:

- partial example
- missing subgoal
- failing test feedback
- hint ladder

Advanced:

- minimal hint
- alternative solution comparison
- proof/counterexample
- timed mock interview

Worked Example은 novice에게 특히 유용하지만, advanced에게는 redundancy가 될 수 있다.

## 8. AI Tutor 적용 원칙

AI는 Worked Example을 생성할 수 있지만, 설계가 나쁘면 cognitive load를 늘린다.

### 8.1 좋은 AI 역할

- learner의 current solution을 subgoal로 요약한다.
- code block의 목적을 짧게 설명한다.
- learner가 빠뜨린 invariant를 질문한다.
- full solution 대신 다음 subgoal만 hint로 준다.
- 같은 pattern의 transfer problem을 추천한다.
- learner가 쓴 self-explanation의 빈틈을 짚는다.

### 8.2 나쁜 AI 역할

- 정답 code를 바로 생성한다.
- 긴 generic explanation을 제공한다.
- 문제마다 다른 terminology를 쓴다.
- pattern label만 말하고 reasoning을 생략한다.
- learner가 어떤 schema를 못 갖고 있는지 추적하지 않는다.

AI는 answer generator가 아니라 Worked Example tutor여야 한다.

## 9. Product MVP 제안

### 9.1 MVP Scope

처음부터 모든 LeetCode 문제를 다루면 content quality가 무너진다. MVP는 핵심 pattern 5개 정도로 제한하는 것이 낫다.

추천 pattern:

- `hash map`
- `two pointers`
- `sliding window`
- `binary search`
- `BFS/DFS`

각 pattern마다 다음을 만든다.

- canonical worked example 2개
- process-oriented explanation
- subgoal labels
- trace
- completion task 2개
- similar practice problem 3개
- transfer problem 1개
- self-explanation prompts

### 9.2 MVP에서 제외할 것

- 대규모 problem bank
- ranking
- social feed
- full AI auto-solver
- 고급 visualization editor
- 모든 language 지원

초기 제품의 quality는 문제 수가 아니라 Worked Example의 instructional quality에서 나온다.

## 10. Measurement

Worked Example의 효과는 단순 solved count로 측정하면 안 된다.

추천 metric:

- worked example completion rate
- subgoal explanation accuracy
- completion task success rate
- hint depth reduction
- same-pattern transfer success
- delayed retry success
- first meaningful edit time 감소
- repeated misconception 감소
- self-explanation quality
- solution plan completeness

특히 `solution plan completeness`가 중요하다. Algorithm solving에서 code 이전 plan이 약하면 implementation이 흔들린다.

## 11. Anti-Patterns

### 11.1 정답 코드만 보여주기

정답 코드는 product이지 process가 아니다. 초보자는 왜 그런 code가 나왔는지 이해하지 못한다.

### 11.2 Line-by-Line 설명 과잉

모든 줄을 설명하면 오히려 structure가 안 보인다. Worked Example은 line이 아니라 subgoal 중심이어야 한다.

### 11.3 Pattern 이름만 가르치기

`sliding window`라는 이름을 맞히는 것과 window invariant를 유지하는 것은 다르다. Pattern label은 출발점일 뿐이다.

### 11.4 너무 빨리 Independent Solve로 넘기기

초보자에게 바로 문제 풀이를 시키면 failure가 productive하지 않을 수 있다. Complete example과 partial completion을 거쳐야 한다.

### 11.5 너무 오래 Full Example에 머물기

계속 full solution만 보여주면 learner가 passive해진다. Fading이 필요하다.

## 12. 결론

LeetCode-style algorithm learning에서 Worked Example은 가장 중요한 instructional primitive 중 하나다. 하지만 효과는 example의 품질에 달려 있다.

좋은 Worked Example은 다음을 만족한다.

- expert reasoning을 드러낸다.
- code를 subgoal로 묶는다.
- invariant를 명시한다.
- trace로 state 변화를 보여준다.
- self-explanation을 요구한다.
- similar problem과 붙어 있다.
- 시간이 지나며 scaffold가 fade된다.
- transfer를 목표로 한다.

따라서 LeetCode 학습 도구의 핵심 flow는 다음이어야 한다.

```text
Pattern Schema
-> Process-Oriented Worked Example
-> Subgoal Explanation
-> Completion Task
-> Similar Practice
-> Transfer Problem
-> Reflection
```

한 줄로 정리하면:

> Worked Example은 solution을 보여주는 기능이 아니라, learner가 algorithm schema를 형성하도록 expert reasoning을 구조화하는 기능이다.

## References

### Atkinson, Derry, Renkl, Wortham - Learning from Examples

URL: https://assess.ucr.edu/sites/default/files/2019-02/atkinsonderryrenklwortham_2000.pdf

Original quote:

> "provide an expert's problem solution for a learner to study"

해석: Worked Example은 expert solution을 learner가 학습할 수 있게 제공하는 instructional device다.

### Margulieux, Morrison, Decker - Reducing Withdrawal and Failure Rates

URL: https://link.springer.com/article/10.1186/s40594-020-00222-7

Original quote:

> "Every word and punctuation mark in a worked example can be a source of cognitive load"

해석: Programming Worked Example은 syntax와 procedure가 섞여 있어 초보자에게 load를 만들 수 있다. 그래서 subgoal label이 필요하다.

### Teach Computing - Using Worked Examples

URL: https://static.teachcomputing.org/pedagogy/QR2-Worked-examples.pdf

Original quote:

> "Fade the use of worked examples over time"

해석: Worked Example은 초보 단계에서 강하게 제공하고, expertise가 생기면 점진적으로 줄여야 한다.

### Renkl, Atkinson, Maier, Staley - From Example Study to Problem Solving

URL: https://asu.elsevierpure.com/en/publications/from-example-study-to-problem-solving-smooth-transitions-help-lea/

Original quote:

> "successive integration of problem-solving elements into example study"

해석: Complete example에서 independent problem solving으로 갑자기 넘어가지 말고, 점진적으로 learner가 해결할 부분을 늘려야 한다.

### van Gog, Paas, van Merriënboer - Process-Oriented Worked Examples

URL: https://studio.courseware.epfl.ch/assets/courseware/v1/e516a7bcc0fb6f0e0aeec7c8305bbe34/asset-v1%3AEPFL%2BDEMO%2B2020%2Btype%40asset%2Bblock/VanGog2004_Article_Process-OrientedWorkedExamples.pdf

Original quote:

> "both 'why' and 'how' information is useful"

해석: Algorithm solving에서는 solution step뿐 아니라 왜 그 step이 필요한지, 어떻게 search space를 줄이는지도 보여줘야 한다.

### Chen - Worked Examples with Explanation Types and Learner Motivation

URL: https://eric.ed.gov/?id=EJ1476162

Original quote:

> "guided questions to prompt self-explanations"

해석: Worked Example은 passive reading보다 guided self-explanation과 결합할 때 transfer에 더 유리하다.

### Choi, Shin, Xia, Kim - AlgoSolve

URL: https://www.xiameng.org/2022_CHI_AlgoSolve.pdf

Original quote:

> "Subgoal learning can help learners improve their solution planning ability"

해석: Algorithm problem solving에서 subgoal learning은 code 이전의 solution planning을 강화한다.

### AlgoSolve Project Page

URL: https://algosolve.kixlab.org/

Original quote:

> "Designing solution plans before writing code is critical"

해석: LeetCode-style 학습 도구는 code editor보다 solution plan을 먼저 다뤄야 한다.

### Jin, Kim - Learnersourcing Subgoal Hierarchies of Code Examples

URL: https://ceur-ws.org/Vol-3410/short4.pdf

Original quote:

> "memorizing code without understanding code structures hinder learners"

해석: Code memorization은 transfer를 방해한다. Worked Example은 code structure 이해를 중심에 둬야 한다.

### Lee et al. - Learning from Teaching Assistants to Program with Subgoals

URL: https://arxiv.org/html/2309.10419

Original quote:

> "divide the task into smaller problems"

해석: AI tutor도 solution을 대신 주기보다 learner가 problem을 subgoal로 나누도록 도와야 한다.
