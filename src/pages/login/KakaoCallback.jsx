import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingLottie from "../../assets/images/lottie/loadingLottie.json";

const KakaoCallback = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false); // 추가 상태로 중복 처리 방지
  const navigate = useNavigate();

  useEffect(() => {
    if (isRedirecting) return; // 이미 리다이렉트 중이면 실행 방지
    setIsRedirecting(true); // 리다이렉트 상태 설정

    const code = searchParams.get("code");
    console.log("인증 코드:", code);

    if (code) {
      fetch("https://ssoenter.store/api/kakao/token", {
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
          console.log("서버 응답 전체:", responseText);

          if (responseText) {
            return JSON.parse(responseText);
          }
          throw new Error("응답이 비어있습니다.");
        })
        .then((data) => {
          console.log("토큰 저장 전 데이터:", data);

          if (!data.accessToken) {
            throw new Error("토큰이 없습니다");
          }

          // 토큰 저장
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("kakaoAccessToken", data.kakaoAccessToken);

          console.log("저장된 토큰:", localStorage.getItem("accessToken"));

          // Lottie 애니메이션을 더 오래 표시
          setTimeout(() => {
            const returnPath = location.state?.from || "/age";
            navigate(returnPath, { replace: true });
          }, 1000); // 3초 대기 후 홈으로 이동
        })
        .catch((error) => {
          console.error("로그인 에러:", error);
        })
        .finally(() => {
          
        });
    }
  }, [searchParams, navigate, isRedirecting]); // `isRedirecting`를 의존성으로 추가

  if (isLoading) {
    // 로딩 중 상태
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Lottie animationData={loadingLottie} loop={true} />
      </div>
    );
  }

  if (errorMessage) {
    // 에러 발생 시 메시지 표시
    return <h1>{errorMessage}</h1>;
  }

  return null; // 모든 작업이 끝난 후 렌더링할 내용 없음
};

export default KakaoCallback;