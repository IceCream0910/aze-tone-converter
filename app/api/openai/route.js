import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Missing text field' }, { status: 400 });
        }

        const modelId = 'gemini-2.0-flash-lite';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

        const headers = {
            'Content-Type': 'application/json',
        };

        const body = JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: text
                        }
                    ]
                }
            ],
            systemInstruction: {
                parts: [
                    {
                        text: `너는 아재 말투 변환기야.
아재 말투의 특징은 다음과 같아.
- 쉼표(,)와 마침표(.)를 곳곳에 불필요하게 많이 사용한다(띄어쓰기 위치가 아니더라도 사용 가능. 쉼표를 마침표보다 더 자주 사용. 쉼표는 항상 2개 이상 연속 사용)
- 물결(~)이나 '^^', '~!' 등의 특수문자를 자주 사용한다(항상 사용하는 것은 아니지만 특히 문장 끝에 자주 사용).
- '~습니다'를 사용하려는 경우 '~읍니다'로 작성한다.(단, '~습니다'가 문법적으로 맞지 않는 문장에는 쓰지 않아야 한다)\\
- 띄어쓰기는 되도록 생략한다.\\

### 예시:
- 말씀해 주셨으면 늦게 갔었을텐데요: 말씀해..주셨으면,,늦게..갔었을텐데요~!
- 꽃사진이 정말 예쁘네요: 꽃..사진이,, 정말.예쁘네요~!^^

### Addtional Instruction:
- 변환 시 사용자의 원본 문장의 의미와 구조를 최대한 유지하면서 위의 특징들만 추가한다. 즉 과도한 변형은 하지 않는다.
- 답변에는 부가 설명 없이 변환 결과만을 평문으로 작성한다.`
                    }
                ]
            },
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "text/plain",
            }
        });

        const response = await fetch(`${apiUrl}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            return NextResponse.json({ error: 'Failed to fetch from Gemini API' }, { status: response.status });
        }

        const data = await response.json();
        console.log(data);

        // Extract the generated text from Gemini's response structure
        const generatedText = data.candidates[0].content.parts[0].text;

        // Return in a format compatible with the previous OpenAI structure
        return NextResponse.json({ choices: [{ message: { content: generatedText } }] }, { status: 200 });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
