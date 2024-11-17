# soenter-FE


### 깃허브 태그명💫

| Title           | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| Start           | Start New Project                                                                             |
| Feat            | 새로운 기능을 추가                                                                            |
| Fix             | 버그 수정                                                                                     |
| Design          | CSS 등 사용자 UI 디자인 변경                                                                  |
| BREAKING CHANGE | 커다란 API 변경의 경우                                                                        |
| HOTFIX          | 급하게 치명적인 버그를 고쳐야하는 경우                                                        |
| Refactor        | 코드 리팩토링                                                                                 |
| Settings        | Changing configuration files                                                                  |
| Comment         | 필요한 주석 추가 및 변경                                                                      |
| Docs            | 문서 수정                                                                                     |
| Test            | 테스트 코드, 리펙토링 테스트 코드 추가, Production Code(실제로 사용하는 코드) 변경 없음       |
| Chore           | 빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트, Production Code 변경 없음 |
| Deploy          | Deploying stuff                                                                               |
| Rename          | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우                                            |
| Remove          | 파일을 삭제하는 작업만 수행한 경우                                                            |


### 프로젝트 폴더 구조📁
```
📦src
 ┣ 📂assets
 ┣ 📂axios
 ┣ 📂components (컴포넌트들 파일들을 위한 폴더)
 ┣ 📂hooks (커스텀 훅(함수)을 위한 폴더)
 ┣ 📂pages (페이지 jsx 들을 위한 폴더)
 ┣ 📂redux
 ┣ 📂services
 ┣ 📂styles (css style을 정의하기 위한 폴더 (module.css))
 ┣ 📂utils
 ┣ 📜App.css
 ┣ 📜App.jsx
 ┣ 📜index.css
 ┗ 📜main.jsx
```

### 코드 컨벤션💻
- 폴더 네이밍: 모두 소문자로 통일
- 파일명(page, style, components): 파스칼 케이스 ex.`PascalCase.jsx` / `PascalCase.module.css`
- hook 파일명: use로 시작하며 카멜 케이스 사용 ex. `useProfile.jsx`
- image 파일명: 케밥 케이스 사용 ex. `back-btn.svg`
- props 이름: 카멜 케이스 ex. `myProp`
- 함수 이름: 카멜 케이스 ex. `handleSubmit`
- 이벤트 핸들러: on 또는 handle 접두사 사용 ex. `onClick`, `handleSubmit`

