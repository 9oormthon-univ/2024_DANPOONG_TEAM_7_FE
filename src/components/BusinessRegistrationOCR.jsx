import { useState } from 'react';
import styles from './BusinessRegistrationOCR.module.css';
import * as pdfjs from 'pdfjs-dist';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BusinessRegistrationOCR = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const GOOGLE_CLOUD_VISION_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
  const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

  const convertPdfToImage = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1); // 첫 페이지만 처리
      
      const viewport = page.getViewport({ scale: 2.0 }); // 고품질을 위해 스케일 증가
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (error) {
      throw new Error('PDF 변환 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
      
      try {
        // PDF 파일인 경우 미리보기 생성
        if (selectedFile.type === 'application/pdf') {
          const pdfPreview = await convertPdfToImage(selectedFile);
          setPreview(pdfPreview);
        } else {
          // 이미지 파일인 경우 직접 미리보기 URL 생성
          setPreview(URL.createObjectURL(selectedFile));
        }
      } catch (err) {
        setError('파일 미리보기 생성 중 오류가 발생했습니다.');
      }
    } else {
      setError('JPG, PNG 또는 PDF 파일만 업로드 가능합니다.');
      setFile(null);
      setPreview(null);
    }
  };

  const extractBusinessInfo = (texts) => {
    // 수정된 정규표현식
    const businessNumberRegex = /등록번호\s*(\d{3}-\d{2}-\d{5})/;
    const companyNameRegex = /상\s*호\s*:\s*([^\n②]+)/;
    const representativeRegex = /성\s*명\s*:\s*([^\n]+)/;
  
    const businessNumber = texts.match(businessNumberRegex)?.[1];
    const companyName = texts.match(companyNameRegex)?.[1];
    const representative = texts.match(representativeRegex)?.[1];
  
    return {
      businessNumber: businessNumber?.trim(),
      companyName: companyName?.trim(),
      representative: representative?.trim(),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      let base64Image;
      if (file.type === 'application/pdf') {
        const pdfImage = await convertPdfToImage(file);
        base64Image = pdfImage.split(',')[1];
      } else {
        base64Image = await convertToBase64(file);
      }
      
      const requestBody = {
        requests: [{
          image: {
            content: base64Image
          },
          features: [{
            type: 'TEXT_DETECTION',
            maxResults: 1
          }]
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

      const detectedText = data.responses[0].fullTextAnnotation.text;
      const extractedInfo = extractBusinessInfo(detectedText);
      setResult(extractedInfo);

    } catch (err) {
      setError('OCR 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>사업자등록증 OCR 인식</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
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
          <p>사업자등록번호: {result.businessNumber}</p>
          <p>상호: {result.companyName}</p>
          <p>대표자: {result.representative}</p>
        </div>
      )}
    </div>
  );
};

export default BusinessRegistrationOCR;