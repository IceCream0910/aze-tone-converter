import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Missing text field' }, { status: 400 });
        }

        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };

        const body = JSON.stringify({
            model: 'ft:gpt-4o-mini-2024-07-18:personal:aze-converter:A1aMrhT8',
            messages: [{
                role: 'system', content: `
                너는 아재 말투 변환기야.\
                아재 말투의 특징은 다음과 같아.\
- 쉼표(,)와 마침표(.)를 곳곳에 불필요하게 많이 사용한다(띄어쓰기 위치가 아니더라도 사용 가능 / 쉼표를 마침표보다 더 자주 사용 / 쉼표는 항상 2개 이상 연속 사용)\
- 물결(~)이나 '^^', '~!' 등의 특수문자를 자주 사용한다(항상 사용하는 것은 아니다).\
- '~습니다'를 사용하려는 경우 '~읍니다'로 작성한다.(단, '~습니다'가 문법적으로 맞지 않는 문장에는 쓰지 않아야 한다)\
- 띄어쓰기는 되도록 생략한다.
                `}, { role: 'user', content: text }],
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return NextResponse.json({ error: 'Failed to fetch from OpenAI API' }, { status: response.status });
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
