# 아재 말투 변환기
텍스트를 입력하면 아재 말투로 변환해줍니다.

[직접 원하는 텍스트를 바꿔보세요](https://aze.yuntae.in)

## 기술 스택
Frontend: Next.js

Deployment: Vercel

API: OpenAI GPT-4o-mini

## 개발 과정
### 아재 말투의 특징
- 쉼표(,)와 마침표(.)를 많이 사용한다.
- 물결(\~)이나 '^^', '~!' 등의 특수문자를 자주 사용한다.
- '~습니다'를 사용하려는 경우 '~읍니다'로 작성한다.
- 띄어쓰기는 되도록 생략한다.

### AI 모델 Fine-Tuning
#### 학습 Data 생성

일반적인 문체의 문장과 아재 말투로 변환된 문장 쌍으로 구성된 데이터셋 생성
```json
{"messages": [{"role": "user", "content": "오늘 날씨가 좋아요. 나들이를 갑시다"}, {"role": "assistant", "content": "오늘,날씨가..,,좋아요,^^..나들이를..갑시다~!~"}]}
{"messages": [{"role": "user", "content": "이 음식 정말 맛있네요. 어떻게 만드셨어요?"}, {"role": "assistant", "content": "이.음식..,,정말,,,맛있네요^^;;어떻게..만드셨어요~!"}]}
{"messages": [{"role": "user", "content": "주말에 영화 보러 갈까요? 새로 나온 영화가 있어요."}, {"role": "assistant", "content": "주말에,,,영화.보러..갈까요~^^;;새로.나온,,영화가..있어요~!"}]}
{"messages": [{"role": "user", "content": "안녕하세요. 오늘 하루 어떠셨나요?"}, {"role": "assistant", "content": "안녕하세요,,. 오늘. 하루..어떠셨나요~!"}]}
{"messages": [{"role": "user", "content": "저는 오늘 회사에서 열심히 일했어요."}, {"role": "assistant", "content": "저는..오늘,, 회사에서.열심히.. 일했읍니다~"}]}
{"messages": [{"role": "user", "content": "주말에는 가족들과 함께 영화를 볼 계획입니다."}, {"role": "assistant", "content": "주말에는,, 가족들과..함께,, 영화를.볼계획입니다..~!"}]}
{"messages": [{"role": "user", "content": "새로운 프로젝트를 시작하게 되어 기쁩니다."}, {"role": "assistant", "content": "새로운,,프로젝트를. 시작하게,,되어. 기쁩니다~^^"}]}
{"messages": [{"role": "user", "content": "오늘 저녁은 무엇을 먹을까요?"}, {"role": "assistant", "content": "오늘..저녁은,, 무엇을.먹을까요~!"}]}
{"messages": [{"role": "user", "content": "날씨가 좋아서 산책을 다녀왔어요."}, {"role": "assistant", "content": "날씨가..좋아서,, 산책을.다녀왔읍니다~"}]}
{"messages": [{"role": "user", "content": "이번 주말에 친구들과 모임이 있어요."}, {"role": "assistant", "content": "이번.주말에,,친구들과. 모임이..있읍니다~!"}]}
{"messages": [{"role": "user", "content": "새로 나온 스마트폰이 정말 좋아 보여요."}, {"role": "assistant", "content": "새로. 나온,,스마트폰이.. 정말.좋아보이네요..^^"}]}
...
(후략)
```

#### 학습 진행
GPT-4o-mini 모델을 기반으로 Fine-Tuning 진행
![image](https://i.imgur.com/jl5yXaJ.png)

## 라이센스
이 프로젝트는 MIT 라이센스를 따릅니다. 자유롭게 사용, 수정, 배포하실 수 있습니다.
