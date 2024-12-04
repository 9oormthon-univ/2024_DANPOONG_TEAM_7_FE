import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/mypage/BusinessRegistrationOCR.module.css';
import * as pdfjs from 'pdfjs-dist';

import plus from '../../assets/images/mypage/file-plus.svg';
import enterpriseCertificationMark from '../../assets/images/mypage/enterpriseCertificationMark.svg';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BusinessRegistrationOCR = ({ onResultChange }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editedResult, setEditedResult] = useState({
    businessNumber: '',
    companyName: '',
    representative: ''
  });
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const GOOGLE_CLOUD_VISION_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
  const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

  // PDF를 이미지로 변환하는 함수
  const convertPdfToImage = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
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
      
      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (error) {
      throw new Error('PDF 변환 중 오류가 발생했습니다: ' + error.message);
    }
  };

  // 파일을 Base64로 변환하는 함수
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

  // 사업자등록증 정보를 추출하는 함수
  const extractBusinessInfo = (texts) => {
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

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
      
      try {
        if (selectedFile.type === 'application/pdf') {
          const pdfPreview = await convertPdfToImage(selectedFile);
          setPreview(pdfPreview);
        } else {
          setPreview(URL.createObjectURL(selectedFile));
        }
      } catch (err) {
        setError('파일 미리보기 생성 중 오류가 발생했습니다.');
        setFile(null);
        setPreview(null);
      }
    } else {
      setError('JPG, PNG 또는 PDF 파일만 업로드 가능합니다.');
      setFile(null);
      setPreview(null);
    }
  };

  const handlePreviewClick = () => {
    fileInputRef.current?.click();
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
      setEditedResult(extractedInfo);  // OCR 결과를 editedResult에도 설정

    } catch (err) {
      setError('OCR 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (field, value) => {
    const newResult = {
      ...editedResult,
      [field]: value
    };
    setEditedResult(newResult);
    onResultChange?.(newResult);
  };

  const handleManualInput = (field, value) => {
    const newResult = {
      ...editedResult,
      [field]: value
    };
    setEditedResult(newResult);
    onResultChange?.(newResult);
  };

  // input이 직접 입력될 때
  const handleInputChange = (field, value) => {
    const newResult = {
      ...editedResult,
      [field]: value
    };
    setEditedResult(newResult);
    onResultChange(newResult);
  };

  useEffect(() => {
    if (result) {
      onResultChange?.(result);
    }
  }, [result, onResultChange]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.content}>
          <div className={styles.previewBox} onClick={handlePreviewClick}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
          />
          {preview ? (
            <img src={preview} alt="미리보기" className={styles.previewImage} />
          ) : (
            <div className={styles.uploadPrompt}>
              <img src={plus} alt='plus' className={styles.plus}/>
              <span>파일 선택</span>
            </div>
          )}
          </div>

          <button 
            type="submit" 
            disabled={!file || loading}
            className={styles.submitButton}
          >
            {loading ? '처리중...' : '인식하기'}
          </button>
        </div>
        
        
        {file && (
            <div className={styles.fileName}>
              {file.name}
            </div>
          )}
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.result}>
        <img 
          src={enterpriseCertificationMark}
          alt='enterenterprise-certification-mark'
          className={styles.enterpriseCertificationMark}
        />
        <p className={styles.resultLabel}>사업자등록번호</p>
        <input
          type="text"
          className={styles.resultInput}
          value={editedResult.businessNumber}
          onChange={(e) => handleInputChange('businessNumber', e.target.value)}
          placeholder="사업자등록번호"
        />
        <p className={styles.resultLabel}>법인명</p>
        <input
          type="text"
          className={styles.resultInput}
          value={editedResult.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          placeholder="법인명"
        />
        <p className={styles.resultLabel}>대표자</p>
        <input
          type="text"
          className={styles.resultInput}
          value={editedResult.representative}
          onChange={(e) => handleInputChange('representative', e.target.value)}
          placeholder="대표자"
        />
      </div>
    </div>
  );
};

BusinessRegistrationOCR.defaultProps = {
  onResultChange: () => {} // 기본 props 설정
};


export default BusinessRegistrationOCR;