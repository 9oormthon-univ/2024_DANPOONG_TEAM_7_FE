import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState(null);
  const [message, setMessage] = useState("로그인 처리 중...");
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("인증 코드:", code);

    if (code) {
      const formData = new URLSearchParams();
      formData.append('code', code);

      fetch("https://api.ssoenter.store/api/kakao/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code, // 카카오에서 받은 인증 코드 전달
        }),
      })
        .then(async (response) => {
          const responseText = await response.text();
          console.log('서버 응답 전체:', responseText);
          
          if (responseText) {
            return JSON.parse(responseText);
          }
          throw new Error('응답이 비어있습니다.');
        })
        .then((data) => {
          console.log("토큰 저장 전 데이터:", data); // 데이터 확인
          
          if (!data.accessToken) {
            throw new Error('토큰이 없습니다');
          }

          // 토큰 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("kakaoAccessToken", data.kakaoAccessToken);
          
          setAccessToken(data.accessToken);
          setMessage("로그인 성공!");

          // 토큰 저장 확인
          console.log("저장된 토큰:", localStorage.getItem("accessToken"));
          
          // 홈으로 이동 전 약간의 지연
          // KakaoCallback.jsx
        setTimeout(() => {
          const returnPath = location.state?.from || '/age';
          navigate(returnPath, { replace: true });
        }, 1000);
        })
        .catch((error) => {
          console.error("로그인 에러:", error);
          setMessage("로그인 실패. 다시 시도해주세요.");
        });
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>{message}</h1>
      {accessToken && <p>로그인 성공! 홈으로 이동합니다...</p>}
    </div>
  );
};

export default KakaoCallback;