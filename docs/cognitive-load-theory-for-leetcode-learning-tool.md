# Cognitive Load Theory 기반 LeetCode 학습 도구 리서치 보고서

조사일: 2026-07-02

## 요약

Cognitive Load Theory, 이하 CLT는 학습자가 새로운 정보를 처리할 때 working memory가 제한적이라는 전제에서 출발한다. 학습은 문제를 많이 푸는 순간 자체가 아니라, long-term memory에 재사용 가능한 schema가 형성될 때 일어난다.

LeetCode solving은 CLT 관점에서 cognitive load가 높은 학습 대상이다. 한 문제 안에 problem parsing, data structure 선택, algorithm pattern 식별, invariant 유지, complexity 분석, implementation, debugging, edge case 검증이 동시에 얽힌다.

따라서 CLT 기반 LeetCode 학습 도구의 목표는 “문제를 쉽게 만들기”가 아니다. 목표는 다음에 가깝다.

> 불필요한 load는 줄이고, algorithm schema 형성에 필요한 사고는 남긴다.

제품 설계 관점에서 핵심은 `Problem List`가 아니라 `Pattern / Schema / Worked Example / Completion Task / Attempt / Hint / Reflection / Mastery`를 SoT로 삼는 것이다.

## 1. CLT의 핵심 전제

CLT는 인간의 cognitive architecture를 instructional design의 출발점으로 둔다. 새로운 정보는 제한된 working memory를 거쳐 처리되고, 학습된 정보는 long-term memory에 schema로 저장된다. 한 번 schema가 long-term memory에 저장되면, 이후 비슷한 문제를 풀 때 working memory 부담이 크게 줄어든다.

LeetCode 학습에서 이 말은 명확하다. 초보자가 `sliding window` 문제를 처음 풀 때는 포인터 이동, 중복 처리, loop invariant, hash map update를 모두 따로 생각해야 한다. 하지만 schema가 생기면 “window가 valid할 때 확장하고 invalid할 때 축소한다”는 하나의 chunk로 다룰 수 있다.

학습 도구는 문제 수를 늘리는 것보다 schema 형성을 도와야 한다.

## 2. Cognitive Load의 세 가지 구분

전통적인 CLT는 cognitive load를 세 가지로 나눈다.

### 2.1 Intrinsic Load

Intrinsic load는 학습 내용 자체의 난이도다. LeetCode에서는 다음이 여기에 해당한다.

- graph traversal의 상태 공간
- dynamic programming의 state와 transition
- binary search의 invariant
- recursion stack과 backtracking decision tree
- greedy proof
- monotonic stack의 유지 조건

Intrinsic load는 문제 자체에서 오지만, 고정값은 아니다. learner의 prior knowledge에 따라 달라진다. `BFS` schema가 있는 학습자에게 shortest path 문제는 낮은 load지만, 처음 보는 학습자에게는 queue, visited, level, graph representation이 동시에 들어와 매우 높다.

### 2.2 Extraneous Load

Extraneous load는 학습과 직접 관련 없는 낭비다. LeetCode 학습 도구에서 특히 줄여야 할 대상이다.

예시는 다음과 같다.

- 문제 설명과 예제가 멀리 떨어진 layout
- code와 explanation이 분리되어 오가는 split attention
- 너무 긴 AI 답변
- solution만 던지고 decision process를 설명하지 않는 hint
- test failure가 어떤 invariant를 깨뜨렸는지 알려주지 않는 error message
- pattern taxonomy가 매번 다르게 불리는 inconsistent naming
- learner 수준과 맞지 않는 난이도 추천
- “정답/오답”만 보여주고 어떤 schema가 부족한지 알려주지 않는 feedback

제품에서 가장 먼저 줄여야 할 load는 extraneous load다.

### 2.3 Germane Processing

Germane processing은 schema 형성에 실제로 쓰이는 유의미한 사고다.

LeetCode에서는 다음이 여기에 해당한다.

- “이 문제는 왜 `two pointers`가 아니라 `prefix sum`인가?”
- “이 loop invariant는 무엇인가?”
- “어떤 조건에서 left pointer를 움직이는가?”
- “이 DP state는 어떤 subproblem을 대표하는가?”
- “이 edge case가 기존 solution을 깨뜨리는 이유는 무엇인가?”
- “이 문제와 이전 문제의 공통 구조는 무엇인가?”

주의할 점이 있다. 최신 CLT에서는 `germane load`를 독립된 세 번째 load로 보는 관점이 약해졌다. 일부 연구는 intrinsic/extraneous 중심의 dual framework를 사용하고, germane은 별도 load라기보다 intrinsic load를 다루는 데 투입된 productive processing으로 본다.

제품 설계에서는 이 논쟁을 복잡하게 노출할 필요가 없다. 다만 원칙은 분명하다.

> 모든 load를 낮추는 것이 목표가 아니라, 낭비되는 load를 줄이고 schema 형성에 필요한 사고를 남겨야 한다.

## 3. LeetCode 학습에 중요한 CLT Effects

### 3.1 Worked Example Effect

Worked example은 expert solution을 단계별로 보여주는 학습 방식이다. CLT에서 가장 반복적으로 검증된 instructional effect 중 하나다.

초보자가 빈 editor에서 바로 문제를 풀면 working memory 대부분이 means-end search에 쓰인다. 즉, “어떻게든 답까지 가기”에 정신 자원을 쓰고, 정작 reusable schema를 만드는 데 쓸 여력이 줄어든다.

LeetCode 도구에서는 초보자에게 다음 순서를 제공해야 한다.

1. 대표 문제의 worked example을 먼저 보여준다.
2. 문제를 어떤 pattern으로 인식했는지 설명한다.
3. 핵심 invariant와 data structure 선택 이유를 보여준다.
4. solution을 줄 단위가 아니라 decision 단위로 설명한다.
5. 같은 pattern의 유사 문제로 전이한다.

나쁜 worked example은 완성 코드만 보여준다. 좋은 worked example은 “왜 이 선택을 했는가”를 보여준다.

### 3.2 Completion Problem과 Fading

Completion problem은 일부가 채워진 solution을 learner가 완성하는 방식이다. 완전한 worked example과 독립 문제 풀이 사이의 중간 단계다.

LeetCode 학습에서 좋은 fading sequence는 다음과 같다.

1. 완성된 solution을 읽고 핵심 decision을 표시한다.
2. invariant 설명만 learner가 채운다.
3. pointer update 또는 state transition 한 줄만 채운다.
4. 핵심 loop body를 채운다.
5. 전체 solution을 pseudocode로 작성한다.
6. 전체 implementation을 작성한다.
7. 다른 surface story를 가진 같은 pattern 문제를 푼다.

이 접근은 초보자의 extraneous load를 줄이면서도 schema 형성에 필요한 사고를 유지한다.

### 3.3 Expertise Reversal Effect

같은 도움도 learner 수준에 따라 효과가 반대로 나타날 수 있다. 초보자에게는 worked example과 scaffold가 유익하지만, 숙련자에게는 redundant information이 되어 load를 늘릴 수 있다.

따라서 학습 도구는 모든 사용자에게 같은 explanation과 hint를 보여주면 안 된다.

설계 원칙은 다음과 같다.

- novice: worked example, visual trace, explicit pattern label, step-by-step hint
- intermediate: partial hint, invariant prompt, failing test explanation
- advanced: minimal hint, counterexample, complexity challenge, proof prompt

도구는 사용자에게 “도움이 필요합니까?”라고만 묻기보다, 현재 attempt에서 드러난 행동을 통해 scaffold 수준을 조절해야 한다.

### 3.4 Self-Explanation Effect

Worked example은 그냥 읽으면 피상적으로 지나갈 수 있다. Self-explanation은 learner가 예제의 각 decision을 자신의 말로 설명하게 하는 방식이다.

LeetCode 도구에서는 다음 prompt가 효과적이다.

- “이 `while` 조건이 유지하는 invariant는 무엇인가?”
- “왜 여기서 `right`가 아니라 `left`를 움직이는가?”
- “이 hash map에는 무엇이 저장되는가?”
- “이 DP table의 각 cell은 어떤 의미인가?”
- “이 test case가 없으면 어떤 bug를 놓치는가?”

Self-explanation은 모든 사용자에게 자유서술로 길게 요구하면 부담이 된다. 초보자에게는 선택형, 빈칸, 짧은 문장 형태가 낫다. 숙련자에게는 proof sketch나 counterexample 생성이 더 적합하다.

### 3.5 Parsons Problems

Parsons Problem은 섞인 code block을 올바른 순서로 배열하는 학습 방식이다. 초보자에게 syntax와 blank editor 부담을 줄이고, program structure와 control flow에 집중하게 만든다.

LeetCode 도구에서는 특히 다음 상황에 유용하다.

- learner가 pattern은 알지만 구현을 시작하지 못할 때
- syntax error가 반복되어 algorithm 사고가 방해될 때
- recursion/backtracking 흐름을 구조적으로 익힐 때
- DP initialization과 transition 순서를 익힐 때

Parsons Problem은 “쉬운 문제”가 아니다. code writing 전에 구조를 형성하게 하는 scaffold다.

### 3.6 Productive Failure

Productive Failure는 instruction 전에 먼저 문제를 시도하게 해서, 이후 instruction을 더 잘 이해하도록 만드는 접근이다. 최근 meta-analysis에서는 problem solving followed by instruction이 instruction followed by problem solving보다 유리한 경우가 있음을 보고한다.

그러나 LeetCode 도구에서 무작정 “먼저 풀어보세요”를 기본값으로 삼으면 위험하다. prior knowledge가 부족한 learner에게는 failure가 productive하지 않고 cognitive overload가 된다.

따라서 Productive Failure는 다음 조건에서 제한적으로 쓰는 편이 낫다.

- learner가 해당 pattern의 기본 schema를 이미 갖고 있다.
- 실패 후 즉시 consolidation이 제공된다.
- 실패가 너무 오래 지속되지 않는다.
- 실패 결과가 “어떤 지식이 부족했는지”로 연결된다.

초보자 onboarding의 기본값은 Productive Failure가 아니라 worked example과 completion problem이어야 한다.

## 4. 최신 트렌드

### 4.1 Individualization과 Adaptive Instruction

최근 CLT는 individual differences를 더 중요하게 다룬다. 특히 long-term memory에 이미 저장된 knowledge가 learner 간 차이를 만드는 핵심 요인으로 본다.

LeetCode 도구에 필요한 것은 단순한 난이도 추천이 아니다. 사용자의 schema 상태를 추정해야 한다.

예를 들면 다음 신호를 볼 수 있다.

- pattern label을 보고도 approach를 설명할 수 있는가
- brute force에서 optimized solution으로 이동할 수 있는가
- invariant를 말할 수 있는가
- 비슷한 문제로 transfer할 수 있는가
- syntax error인지, logic error인지, modeling error인지
- hint를 몇 단계까지 열어야 풀리는가
- 같은 pattern 문제에서 error type이 반복되는가

이 신호를 바탕으로 scaffold 수준을 바꿔야 한다.

### 4.2 AI는 Scaffold이자 Overload Source

Generative AI는 CLT 기반 학습 도구에 매우 유용하다. 하지만 AI가 항상 cognitive load를 줄이는 것은 아니다. 너무 긴 설명, premature solution, learner 수준과 맞지 않는 abstraction, 매번 다른 용어는 오히려 extraneous load를 만든다.

AI는 solution generator가 아니라 tutor 역할을 해야 한다.

좋은 AI 역할:

- learner의 current attempt를 읽고 misconception을 찾는다.
- full answer 대신 다음 decision만 묻는다.
- hint ladder를 단계적으로 연다.
- code line과 explanation을 연결한다.
- learner가 쓴 설명의 빈틈을 짚는다.
- 같은 pattern의 transfer problem을 추천한다.

나쁜 AI 역할:

- 정답 코드를 바로 제공한다.
- 긴 generic explanation을 반복한다.
- pattern 이름만 말하고 invariant를 설명하지 않는다.
- learner가 이해했는지 확인하지 않는다.
- 매번 다른 스타일의 solution을 제시한다.

AI 시대의 CLT 기반 도구는 “대신 풀어주는 도구”가 아니라 “schema 형성을 방해하지 않는 scaffold”여야 한다.

### 4.3 Cognitive Load Measurement의 정교화

CLT 연구에서는 cognitive load 측정 방법도 계속 발전하고 있다. 전통적으로는 subjective rating scale이 많이 쓰였고, 최근에는 performance, time-on-task, error type, eye-tracking, EEG, mouse dynamics, physiological signal 같은 objective 또는 behavioral signal도 함께 논의된다.

제품에서는 연구실 수준의 정확한 load 측정을 주장하면 안 된다. 대신 `load risk`를 추정하는 실용적 지표를 쓸 수 있다.

추천 지표:

- 문제당 time-on-task
- 첫 meaningful edit까지 걸린 시간
- compile/runtime error 횟수
- 같은 test failure 반복 횟수
- hint depth
- hint를 본 뒤 고친 line의 위치
- reset/restart 횟수
- code churn
- solution을 본 뒤 self-explanation 품질
- 유사 문제 transfer 성공 여부
- 짧은 post-task mental effort rating

중요한 점은 하나의 지표로 cognitive load를 단정하지 않는 것이다. 여러 signal을 조합해 “현재 scaffold가 부족한가, 과한가”를 판단하는 편이 낫다.

### 4.4 Self-Regulated Learning과 Metacognition

최근 CLT 논의는 learner가 자신의 load와 이해 상태를 monitor하는 능력도 중요하게 본다. LeetCode 학습 도구는 단순히 문제를 추천하는 것에서 끝나면 안 된다.

다음 reflection이 필요하다.

- “이번 문제에서 막힌 지점은 pattern 식별, invariant, implementation 중 무엇이었나?”
- “힌트 없이 다시 풀면 어느 단계까지 가능한가?”
- “이 문제와 같은 schema를 공유하는 이전 문제는 무엇인가?”
- “다음에 같은 pattern이 나오면 어떤 signal을 먼저 볼 것인가?”

Reflection은 길면 안 된다. 학습 직후 30초 안에 끝나는 짧은 prompt가 좋다.

### 4.5 Multimodal / Interface Design 관점

CLT는 e-learning과 multimedia learning에서도 강하게 쓰인다. LeetCode 도구에서는 interface 자체가 cognitive load를 만든다.

설계 원칙:

- code, trace, explanation을 같은 화면 맥락에 둔다.
- 시각화는 핵심 invariant를 보여줄 때만 쓴다.
- animation은 느리고 조작 가능해야 한다.
- color는 상태 구분에만 쓰고 장식으로 쓰지 않는다.
- problem statement는 parsing 가능한 chunk로 나눈다.
- constraints는 algorithm choice와 연결해 보여준다.
- solution explanation은 code line 옆에 붙인다.

학습 도구에서 UI는 단순한 껍데기가 아니다. UI가 곧 instructional design이다.

## 5. LeetCode 학습 도구를 위한 Product Principles

### Principle 1. Pattern을 SoT로 둔다

문제 목록 중심 설계는 learner에게 “많이 풀면 된다”는 신호를 준다. CLT 기반 도구는 pattern schema 중심이어야 한다.

핵심 domain objects:

- `AlgorithmPattern`
- `Problem`
- `WorkedExample`
- `CompletionTask`
- `Attempt`
- `HintStep`
- `Misconception`
- `Reflection`
- `MasterySignal`
- `CognitiveLoadSignal`

문제는 독립된 item이 아니라 pattern schema를 형성하기 위한 instance다.

### Principle 2. Blank Editor를 기본 시작점으로 두지 않는다

초보자에게 `문제 + 빈 editor`는 load가 높다. 초기 flow는 다음이 낫다.

1. pattern pretraining
2. worked example
3. line-level explanation
4. completion task
5. guided solve
6. independent solve
7. transfer problem

빈 editor는 목표 지점이지 시작 지점이 아니다.

### Principle 3. Hint는 Ladder여야 한다

좋은 hint는 정답을 숨기는 것이 아니라, learner가 다음 reasoning step을 직접 밟게 한다.

추천 hint ladder:

1. problem constraint 주목
2. brute force bottleneck 질문
3. pattern 후보 제시
4. invariant 질문
5. data structure 선택 질문
6. pseudocode skeleton
7. failing test와 원인 연결
8. partial code
9. full solution

힌트는 한 번에 많이 주면 extraneous load가 된다.

### Principle 4. Feedback은 Error가 아니라 Misconception에 붙인다

“Wrong Answer”는 학습 feedback이 아니다.

더 좋은 feedback:

- “window가 invalid해진 뒤에도 `left`가 이동하지 않았다.”
- “visited 처리가 enqueue 시점이 아니라 dequeue 시점이라 중복 방문이 생긴다.”
- “DP state가 index만 포함해서 remaining capacity 정보를 잃었다.”
- “binary search 종료 조건은 맞지만 answer candidate update가 빠졌다.”

Feedback은 code line보다 domain misconception에 연결되어야 한다.

### Principle 5. Mastery는 문제 수가 아니라 Transfer로 측정한다

Streak와 solved count는 engagement metric이지 mastery metric이 아니다.

CLT 관점의 mastery signal:

- 새로운 problem statement에서 pattern을 식별한다.
- 같은 pattern의 다른 surface story로 transfer한다.
- invariant를 설명한다.
- edge case를 스스로 만든다.
- complexity를 tradeoff와 함께 설명한다.
- hint depth가 줄어든다.
- 일정 시간이 지난 뒤 다시 풀 수 있다.

Mastery는 반복 횟수가 아니라 schema의 재사용 가능성이다.

### Principle 6. AI는 Learner를 대체하지 않는다

AI가 solution을 대신 만들면 immediate performance는 올라가지만 learning은 낮아질 수 있다. CLT 기반 AI는 learner의 working memory를 보호하되, 핵심 사고를 빼앗으면 안 된다.

AI의 기본 mode:

- “다음 한 단계만 도와주기”
- “현재 코드의 misconception 찾기”
- “왜 이 line이 필요한지 물어보기”
- “유사 문제와 연결하기”
- “solution을 짧은 schema card로 압축하기”

AI의 금지 mode:

- full solution auto-fill
- learner 수준과 무관한 긴 강의
- reasoning 없는 code rewrite
- solved count만 늘리는 자동화

## 6. Recommended Learning Flow

### 6.1 Novice Flow

대상: pattern schema가 거의 없는 learner

흐름:

1. Pattern card: 핵심 상황과 visual invariant
2. Worked example: 대표 문제 하나를 decision 단위로 설명
3. Self-explanation: 짧은 빈칸 또는 선택형 질문
4. Completion task: 핵심 line 일부만 채우기
5. Parsons problem: code block 순서 배열
6. Guided solve: hint ladder와 함께 유사 문제 풀기
7. Reflection: 막힌 지점과 schema 요약

피해야 할 것:

- 처음부터 timer
- 처음부터 blank editor
- full solution만 보여주기
- 어려운 transfer problem

### 6.2 Intermediate Flow

대상: pattern 이름은 알지만 적용이 흔들리는 learner

흐름:

1. Problem parsing
2. Pattern prediction
3. Brute force bottleneck 설명
4. Independent attempt
5. Failing test 기반 hint
6. Invariant check
7. Transfer problem
8. Reflection with misconception tag

피해야 할 것:

- 지나치게 자세한 worked example 반복
- 같은 유형만 계속 풀기
- 정답 코드 중심 리뷰

### 6.3 Advanced Flow

대상: 기본 schema가 있고 interview readiness를 높이려는 learner

흐름:

1. Timed solve
2. Complexity challenge
3. Counterexample generation
4. Alternative solution comparison
5. Proof sketch
6. Follow-up constraints
7. Mock interview explanation

피해야 할 것:

- redundant scaffold
- 모든 문제에 동일한 step-by-step explanation
- 쉬운 pattern drill의 과잉 반복

## 7. MVP 제안

CLT 기반 LeetCode 도구의 MVP는 기능을 많이 넣기보다 learning loop를 정확히 만들어야 한다.

### MVP Scope

- Pattern 중심 curriculum
- 각 pattern당 대표 worked example 1개
- completion task 2-3개
- guided solve 3-5개
- hint ladder
- attempt analysis
- misconception tag
- short reflection
- mastery signal dashboard

### MVP에서 제외해도 되는 것

- ranking
- social feed
- 대규모 문제 은행
- 복잡한 gamification
- 실시간 eye-tracking
- 완전 자동 AI tutor
- 모든 language 지원

초기에는 `two pointers`, `sliding window`, `hash map`, `binary search`, `BFS/DFS` 정도의 pattern만 제대로 다루는 편이 낫다.

## 8. 측정해야 할 Product Metrics

일반적인 solved count만 보면 학습이 왜곡된다. CLT 기반 도구는 다음 metric을 함께 봐야 한다.

### Learning Metrics

- first independent solve까지 걸린 세션 수
- 같은 pattern의 transfer success rate
- hint depth 감소율
- repeated misconception 감소율
- delayed retry success rate
- self-explanation quality

### Cognitive Load Risk Metrics

- 문제 시작 후 첫 edit까지 걸린 시간
- hint 없이 idle 상태가 지속되는 시간
- compile/runtime error 반복
- 같은 failing test 반복
- solution reveal 직전의 행동 패턴
- post-task mental effort rating

### Product Metrics

- worked example completion rate
- completion task conversion rate
- guided solve to independent solve conversion
- pattern별 drop-off
- reflection completion rate

좋은 product metric은 solved count가 아니라 “scaffold가 줄어도 transfer가 유지되는가”를 보여줘야 한다.

## 9. 주의할 점

### 9.1 Load를 무조건 낮추면 안 된다

CLT는 “편하게 만들라”는 이론이 아니다. 학습에 불필요한 load를 줄이고, 필요한 사고를 가능하게 만드는 이론이다.

너무 친절한 도구는 learner의 reasoning을 대신해버린다. 특히 AI solution generator는 immediate success를 만들지만 schema acquisition을 방해할 수 있다.

### 9.2 Pattern 이름 암기는 학습이 아니다

`sliding window`라고 맞히는 것과 sliding window invariant를 유지하는 것은 다르다. 도구는 pattern label recall보다 invariant explanation과 transfer를 더 중요하게 봐야 한다.

### 9.3 Novice와 Advanced를 같은 UX로 다루면 안 된다

초보자에게 좋은 scaffold는 숙련자에게 redundant load가 될 수 있다. 반대로 숙련자에게 좋은 productive struggle은 초보자에게 overload가 될 수 있다.

### 9.4 AI 설명은 짧고 위치 기반이어야 한다

긴 AI 설명은 친절해 보이지만, 실제로는 extraneous load를 만든다. Explanation은 code, test, state trace와 가까운 위치에 있어야 한다.

## 결론

CLT 기반 LeetCode 학습 도구의 본질은 adaptive scaffold다.

초보자에게는 worked example과 completion task로 means-end search를 줄이고, 중급자에게는 misconception feedback과 transfer problem으로 schema를 강화하고, 숙련자에게는 minimal hint와 proof/counterexample로 interview readiness를 높여야 한다.

가장 중요한 설계 원칙은 다음이다.

> LeetCode 학습의 단위는 문제가 아니라 algorithm schema다.

도구가 이 원칙을 지키면 solved count 중심의 grind tool이 아니라, cognitive load를 관리하며 problem solving schema를 형성하는 학습 도구가 될 수 있다.

## References

### Sweller, van Merriënboer, Paas - Cognitive Architecture and Instructional Design: 20 Years Later

URL: https://leadinglearner.me/wp-content/uploads/2019/02/sweller2019_article_cognitivearchitectureandinstru.pdf

Original quote:

> "capacity and duration limited working memory"

해석: CLT는 working memory의 제한과 long-term memory의 schema 형성을 instructional design의 핵심 제약으로 본다.

### Sweller, van Merriënboer, Paas - Cognitive Architecture and Instructional Design

URL: https://link.springer.com/article/10.1023/A%3A1022193728205

Original quote:

> "working memory load should be reduced and schema construction encouraged"

해석: instructional design은 불필요한 working memory 부담을 줄이고 schema construction을 촉진해야 한다.

### Sweller - Cognitive Load During Problem Solving

URL: https://www.sciencedirect.com/science/article/pii/0364021388900237

Original quote:

> "unavailable for schema acquisition"

해석: 초보자가 conventional problem solving에 바로 들어가면 cognitive capacity가 schema acquisition이 아니라 means-end search에 쓰일 수 있다.

### Paas, van Merriënboer - Cognitive-Load Theory: Methods to Manage Working Memory Load

URL: https://journals.sagepub.com/doi/10.1177/0963721420922183

Original quote:

> "substitute productive for unproductive cognitive load"

해석: CLT의 목표는 모든 load를 제거하는 것이 아니라, unproductive load를 productive processing으로 바꾸는 것이다.

### Sweller - Cognitive Load Theory and Individual Differences

URL: https://www.sciencedirect.com/science/article/pii/S1041608024000165

Original quote:

> "Learners with differential knowledge"

해석: learner의 long-term memory에 저장된 knowledge 차이가 instructional design의 차이를 만들어야 한다.

### Tetzlaff et al. - A Cornerstone of Adaptivity

URL: https://www.sciencedirect.com/science/article/pii/S0959475225000660

Original quote:

> "providing novices with assistance has a stronger effect"

해석: novice에게 scaffold를 제공하는 것은 특히 중요하다. 다만 expertise reversal 때문에 숙련자에게는 도움을 줄여야 한다.

### Martin et al. - Integrating Generative AI and Load Reduction Instruction

URL: https://www.sciencedirect.com/science/article/pii/S1041608025000998

Original quote:

> "GenAI can impose problematic cognitive burden"

해석: AI는 cognitive load를 줄일 수도 있지만, 잘못 설계하면 새로운 부담을 만든다.

### Krieglstein et al. - Subjective Cognitive Load Questionnaires Meta-analysis

URL: https://link.springer.com/article/10.1007/s10648-022-09683-4

Original quote:

> "reliably measured with currently available subjective questionnaires"

해석: subjective questionnaire는 cognitive load 측정에 여전히 유용하지만, construct validity와 해석에는 주의가 필요하다.

### Frontiers - Recent Approaches for Assessing Cognitive Load

URL: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.838422/full

Original quote:

> "validity of different approaches ... still under debate"

해석: cognitive load 측정은 단일 지표로 확정하기 어렵고, 목적과 맥락에 맞게 선택해야 한다.

### Darejeh et al. - Cognitive Load Measurement Methods for Usability Testing

URL: https://journals.sagepub.com/doi/10.1177/00187208261427867

Original quote:

> "combination of subjective and objective cognitive load measurement methods"

해석: 학습 도구에서도 self-report, behavior, performance signal을 함께 보는 방식이 더 실용적이다.

### Hou, Ericson, Wang - Using Adaptive Parsons Problems

URL: https://xinyinghou.org/assets/publications/papers/icer2022.pdf

Original quote:

> "limiting irrelevant cognitive load"

해석: Parsons Problem은 code writing 부담을 줄이고 learner가 structure와 reasoning에 집중하도록 돕는다.

### Hou, Ericson, Wang - Parsons Problems as Scaffolding

URL: https://arxiv.org/html/2311.18115v1

Original quote:

> "significantly higher practice performance"

해석: Parsons scaffolding은 특히 CS self-efficacy가 낮은 learner의 practice performance와 efficiency에 도움이 될 수 있다.

### JISE - Self-Explanation Effect in Teaching Basic Programming

URL: https://jise.org/Volume35/n3/JISE2024v35n3pp303-312.pdf

Original quote:

> "students without adequate prior knowledge may generate incorrect explanations"

해석: self-explanation은 유용하지만, 초보자에게는 guided prompt와 corrective feedback이 필요하다.

### Sinha, Kapur - When Problem Solving Followed by Instruction Works

URL: https://journals.sagepub.com/doi/10.3102/00346543211019105

Original quote:

> "significant, moderate effect in favor of PS-I"

해석: Productive Failure 계열 접근은 효과가 있을 수 있지만, prior knowledge와 consolidation 설계가 중요하다.
