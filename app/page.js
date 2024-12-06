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
      // 현재 화면 크기에 따라 maxSize의 유동적으로 적용. 양자택일이 아닌 계산식에 넣어 산출. 최대 크기는 100
      const maxSize = Math.min(window.innerWidth / 10, 100);
      let newFontSize = Math.min(inputWidth / (inputLength + 1), maxSize);

      newFontSize = Math.max(newFontSize, 16); // 최소 폰트 크기
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

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: input })
    });
    const data = await response.json();
    setConvertedText(data.choices[0].message.content);
  }

  function copy() {
    navigator.clipboard.writeText(convertedText);
    toast.success('클립보드에 복사되었습니다.');
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


      <div style={{ position: 'fixed', bottom: '20px', left: 0, padding: '0 20px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <button className="filed" onClick={() => copy()}><span className="emoji">📋</span>&nbsp;복사</button>
        {isConverted && <button className="filed" onClick={() => convert()} style={{ padding: '10px 15px' }}>⟳ 재생성</button>}
        <button className="filed" onClick={() => isConverted ? setIsConverted(false) : convert()} style={{ background: 'var(--primary-color)', fontWeight: 'bold', padding: '10px 15px' }}>{isConverted ? '처음으로' : '변환 →'}</button>
      </div>

      {
        aboutModalOpen &&
        <div className="modal">
          <div className="modal-box">
            <h2>정보</h2>
            <button className="primary" style={{ position: 'relative', bottom: 0, float: 'right' }} onClick={() => setAboutModalOpen(false)}>닫기</button>
          </div>
        </div>
      }

      <BottomSheet open={aboutBottomSheetOpen} expandOnContentDrag={false} scrollLocking={true} onDismiss={() => setAboutBottomSheetOpen(false)}>
        <div className="bottom-sheet">
          <h2>정보</h2>
          <button className="modal-btn" onClick={() => setAboutBottomSheetOpen(false)}>닫기</button>
        </div>
      </BottomSheet>
    </main >
  );
}
