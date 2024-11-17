module.exports = {
    root: true, // 최상위 ESLint 설정 파일로 지정
    env: { browser: true, es2020: true }, // 브라우저 환경과 최신 JavaScript 기능 지원
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime", // 최신 React JSX 런타임 지원
      "plugin:react-hooks/recommended", // React 훅 권장 규칙 추가
      "plugin:prettier/recommended", // Prettier와 연동하여 코드 스타일 일관성 유지
    ],
    parserOptions: {
      ecmaVersion: "latest", // 최신 ECMAScript 문법 지원
      sourceType: "module", // ES 모듈 사용
    },
    settings: {
      react: {
        version: "detect", // React 버전을 자동으로 감지
      },
    },
    plugins: ["react-refresh"], // HMR을 위한 플러그인 추가
    rules: {
      "prettier/prettier": ["error"], // Prettier 규칙을 ESLint에서 오류로 처리
      "react/jsx-no-target-blank": "off", // JSX에서 target="_blank" 사용 시 보안 경고 비활성화
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ], // HMR 설정 시 컴포넌트만 내보낼 것을 권고
    },
  };
  