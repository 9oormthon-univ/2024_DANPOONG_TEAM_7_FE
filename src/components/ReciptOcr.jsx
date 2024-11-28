import { useState } from 'react';
import styles from './ReceiptOCR.module.css';
import * as pdfjsLib from 'pdfjs-dist';

// worker 설정
const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

const ReceiptOCR = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const GOOGLE_CLOUD_VISION_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
  const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

  const preprocessImage = async (file) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = await createImageBitmap(file);
    
    const MAX_SIZE = 2000;
    let width = img.width;
    let height = img.height;
    
    if (width > MAX_SIZE || height > MAX_SIZE) {
      if (width > height) {
        height = (height / width) * MAX_SIZE;
        width = MAX_SIZE;
      } else {
        width = (width / height) * MAX_SIZE;
        height = MAX_SIZE;
      }
    }

    canvas.width = width;
    canvas.height = height;

    // 이미지 선명도 개선
    ctx.filter = 'contrast(1.2) brightness(1.1)';
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const convertToBase64 = async (file) => {
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        return canvas.toDataURL('image/jpeg').split(',')[1];
      } catch (error) {
        throw new Error('PDF 변환 중 오류가 발생했습니다: ' + error.message);
      }
    } else {
      try {
        const processedImage = await preprocessImage(file);
        return processedImage.split(',')[1];
      } catch (error) {
        throw new Error('이미지 처리 중 오류가 발생했습니다: ' + error.message);
      }
    }
  };

  const createPreview = async (file) => {
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        return canvas.toDataURL('image/jpeg');
      } catch (error) {
        throw new Error('PDF 미리보기 생성 중 오류가 발생했습니다.');
      }
    } else {
      try {
        return await preprocessImage(file);
      } catch (error) {
        throw new Error('이미지 미리보기 생성 중 오류가 발생했습니다.');
      }
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (
      selectedFile.type === 'image/jpeg' || 
      selectedFile.type === 'image/png' || 
      selectedFile.type === 'application/pdf'
    )) {
      setFile(selectedFile);
      setError(null);
      try {
        const previewUrl = await createPreview(selectedFile);
        setPreview(previewUrl);
      } catch (err) {
        setError('파일 미리보기 생성 중 오류가 발생했습니다.');
      }
    } else {
      setError('JPG, PNG 또는 PDF 파일만 업로드 가능합니다.');
      setFile(null);
      setPreview(null);
    }
  };

  const extractReceiptInfo = (texts) => {
    // 개선된 정규식 패턴
    const amountRegex = /(?:합계|총액|총금액|결제금액|금액|청구금액|Total)\s*:?\s*([\d,]+)/i;
    const dateRegex = /(?:\d{4}[-./]\d{2}[-./]\d{2})|(?:\d{2}[-./]\d{2}[-./]\d{2})/;
    const storeNameRegex = /(?:상호|업체|가맹점|Store)\s*:?\s*([^\n]+)/i;
    const paymentMethodRegex = /(?:현금|카드|체크카드|신용카드|Credit|Card|Cash)/i;

    // 여러 매칭 시도
    let amount = texts.match(amountRegex)?.[1];
    if (!amount) {
      const lines = texts.split('\n');
      for (const line of lines) {
        if (line.includes('합계') || line.includes('총액')) {
          const numbers = line.match(/\d[\d,]*/g);
          if (numbers) {
            amount = numbers[numbers.length - 1];
            break;
          }
        }
      }
    }

    const date = texts.match(dateRegex)?.[0];
    let storeName = texts.match(storeNameRegex)?.[1]?.trim();
    const paymentMethod = texts.match(paymentMethodRegex)?.[0];

    // 상호명이 없을 경우 첫 줄에서 찾기 시도
    if (!storeName) {
      const firstLine = texts.split('\n')[0]?.trim();
      if (firstLine && !firstLine.match(/[0-9]/)) {
        storeName = firstLine;
      }
    }

    // 결과 검증
    const validated = {
      amount: amount?.replace(/[^\d]/g, ''),
      date: date,
      storeName: storeName || null,
      paymentMethod: paymentMethod || null
    };

    return validated;
  };

  const retryOCR = async (base64Image, maxRetries = 3) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const requestBody = {
          requests: [{
            image: {
              content: base64Image
            },
            features: [{
              type: 'TEXT_DETECTION',
              maxResults: 1
            }],
            imageContext: {
              languageHints: ['ko'],
              textDetectionParams: {
                enableTextDetectionConfidenceScore: true
              }
            }
          }]
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.responses[0].error) {
          throw new Error(data.responses[0].error.message);
        }

        return data.responses[0].fullTextAnnotation.text;
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw lastError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const base64Image = await convertToBase64(file);
      const detectedText = await retryOCR(base64Image);
      const extractedInfo = extractReceiptInfo(detectedText);
      setResult(extractedInfo);

    } catch (err) {
      setError('OCR 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>영수증 OCR 인식</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        
        {preview && (
          <div className={styles.preview}>
            <img src={preview} alt="미리보기" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </div>
        )}

        <button 
          type="submit" 
          disabled={!file || loading}
          className={styles.submitButton}
        >
          {loading ? '처리중...' : '인식하기'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h3>인식 결과</h3>
          <p>상호명: {result.storeName || '인식 실패'}</p>
          <p>결제금액: {result.amount ? `${Number(result.amount).toLocaleString()}원` : '인식 실패'}</p>
          <p>날짜: {result.date || '인식 실패'}</p>
          <p>결제수단: {result.paymentMethod || '인식 실패'}</p>
        </div>
      )}
    </div>
  );
};

export default ReceiptOCR;