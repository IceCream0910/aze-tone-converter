"use client";
import { useState, useEffect, useRef } from "react";
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import TextTransition from './components/textTransition';
import toast, { Toaster } from 'react-hot-toast';


export default function Home() {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [aboutBottomSheetOpen, setAboutBottomSheetOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const inputRef = useRef(null);

  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, []);

  useEffect(() => {
    console.log(fontSize);
  }, [fontSize]);

  const adjustFontSize = () => {
    if (inputRef.current) {
      const inputWidth = inputRef.current.offsetWidth;
      const inputLength = inputRef.current.value.length || 10;
      const maxSize = Math.min(window.innerWidth / 10, 100);
      let newFontSize = Math.min(inputWidth / (inputLength + 1), maxSize);

      newFontSize = Math.max(newFontSize, 16);
      setFontSize(newFontSize);
    }
  };

  async function convert() {
    const input = inputRef.current.value;
    if (!input) {
      return alert('입력된 문장이 없습니다.');
    }

    setIsConverted(true);
    setConvertedText(input);
    setIsLoading(true);

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: input })
    });
    const data = await response.json();
    setConvertedText(data.choices[0].message.content);
    setIsLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(convertedText);
    toast.success('클립보드에 복사되었습니다.');
  }

  const handleAboutOpen = () => {
    if (window.innerWidth < 768) {
      setAboutBottomSheetOpen(true);
    } else {
      setAboutModalOpen(true);
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Toaster
        toastOptions={{
          style: {
            background: 'var(--hover)',
            color: 'white',
            borderRadius: '15px',
          },
        }} />
      <input
        ref={inputRef}
        type="text"
        style={{
          display: `${isConverted ? 'none' : 'block'}`,
          fontSize: `${fontSize}px`,
          textAlign: 'center',
        }}
        onChange={adjustFontSize}
        placeholder="문장을,,,입력해라,,~!"
      />

      {isConverted && <TextTransition fontSize={fontSize} text={convertedText} onCopy={copy} />}


      <div style={{ position: 'fixed', top: '20px', left: 0, padding: '0 20px', width: '100%', display: 'flex', justifyContent: 'end' }}>
        <button style={{ padding: '5px 10px', fontSize: '20px' }} onClick={handleAboutOpen}>🛈</button>
      </div>

      <div style={{ position: 'fixed', bottom: '20px', left: 0, padding: '0 20px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <button className="filed" onClick={() => copy()}><span className="emoji">📋</span>&nbsp;복사</button>
        {isConverted && <button className="filed" onClick={() => convert()} style={{ padding: '10px 15px' }}>⟳ 재생성</button>}
        <button className="filed" onClick={() => isConverted ? setIsConverted(false) : convert()} style={{ background: 'var(--primary-color)', fontWeight: 'bold', padding: '10px 15px' }}>
          {isLoading ? (<>
            <div style={{ display: 'inline-block', width: '15px', height: '15px', border: '3px solid white', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '-2px' }} />
            &nbsp;
            변환 중
          </>
          ) : isConverted ? '처음으로' : '변환 →'}
        </button>
      </div>

      {
        aboutModalOpen &&
        <div className="modal">
          <div className="modal-box">
            <h2>About</h2><br />
            <h3>아재 말투 변환기</h3>
            텍스트를 입력하면 아재 말투로 변환해줍니다.<br /><br />

            <h3>개발 기술 스택</h3>
            Frontend: Next.js<br />
            Deployment: Vercel<br />
            API: OpenAI GPT-4o-mini<br /><br />

            <h3>아재,,말투가.,,뭐인가요~?</h3>
            - 쉼표(,)와 마침표(.)를 많이 사용한다.<br />
            - 물결(~)이나 '^^', '~!' 등의 특수문자를 자주 사용한다.<br />
            - '~습니다'를 사용하려는 경우 '~읍니다'로 작성한다.<br />
            - 띄어쓰기는 되도록 생략한다.<br /><br />

            <h3>개발자</h3>
            <a href="https://yuntae.in/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>윤태인</a>&nbsp;&nbsp;
            <a href="https://github.com/IceCream0910/aze-tone-converter" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Github</a><br />

            <button className="primary" style={{ position: 'relative', bottom: 0, float: 'right' }} onClick={() => setAboutModalOpen(false)}>닫기</button>
          </div>
        </div>
      }

      <BottomSheet open={aboutBottomSheetOpen} expandOnContentDrag={false} scrollLocking={true} onDismiss={() => setAboutBottomSheetOpen(false)}>
        <div className="bottom-sheet">
          <h2>About</h2><br />
          <h3>아재 말투 변환기</h3>
          텍스트를 입력하면 아재 말투로 변환해줍니다.<br /><br />

          <h3>개발 기술 스택</h3>
          Frontend: Next.js<br />
          Deployment: Vercel<br />
          API: OpenAI GPT-4o-mini<br /><br />

          <h3>아재,,말투가.,,뭐인가요~?</h3>
          - 쉼표(,)와 마침표(.)를 많이 사용한다.<br />
          - 물결(~)이나 '^^', '~!' 등의 특수문자를 자주 사용한다.<br />
          - '~습니다'를 사용하려는 경우 '~읍니다'로 작성한다.<br />
          - 띄어쓰기는 되도록 생략한다.<br /><br />

          <h3>개발자</h3>
          <a href="https://yuntae.in/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>윤태인</a>&nbsp;&nbsp;
          <a href="https://github.com/IceCream0910/aze-tone-converter" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>Github</a><br /><br /><br />
          <button className="modal-btn" onClick={() => setAboutBottomSheetOpen(false)}>닫기</button>
        </div>
      </BottomSheet>
    </main >
  );
}
