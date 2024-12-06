import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TextTransition = ({ fontSize = 16, text, onCopy }) => {
    const [prevText, setPrevText] = useState('');
    const [animatedText, setAnimatedText] = useState([]);

    useEffect(() => {
        const changes = getDifferences(prevText, text);
        setAnimatedText(changes);
        setPrevText(text);
    }, [text]); // prevText를 의존성 배열에서 제거

    // 이전 텍스트와 새로운 텍스트의 차이를 반환하는 함수
    const getDifferences = (oldText, newText) => {
        const oldChars = oldText.split('');
        const newChars = newText.split('');
        // 변경된 글자와 그 여부를 판단하여 반환
        return newChars.map((char, index) => ({
            char,
            shouldAnimate: oldChars[index] !== char,
            key: `${char}-${index}-${oldChars[index] !== char}`, // 유니크한 key 생성
        }));
    };

    const handleTextClick = () => {
        onCopy();
    };

    return (
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', wordBreak: 'break-word', whiteSpace: 'pre-wrap', margin: '0 20px' }} onClick={handleTextClick}>
            {animatedText.map((item) => (
                <motion.span
                    key={item.key}
                    initial={{ y: item.shouldAnimate ? 20 : 0, opacity: item.shouldAnimate ? 0 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ display: 'inline-block', fontSize: `${fontSize}px` }}
                >
                    {item.char}
                </motion.span>
            ))}
        </div>
    );
};

export default TextTransition;
