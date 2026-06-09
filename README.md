# 개인 프로젝트용 아이콘팩

## 사용 방법

1. `/source` 폴더에 하위 카테고리 폴더 생성.
2. 생성한 하위 카테고리 폴더에 아이콘으로 사용할 SVG 파일 추가.
3. `/packer.js` 실행.
4. `/output` 폴더에 생성된 css 파일과 json 파일을 활용.

## 개인화 방법

`/packer.js`에서 일부 변수를 수정하여 개인화 가능.

- `sourcedir`: 소스로 사용할 SVG 파일이 정리된 폴더의 주소.
- `outputdirs[]`: 결과물을 출력할 주소.
- `outputName`: 출력물의 이름.
- `nameHeader`: 변환된 아이콘 이미지의 CSS 변수명 접두사.

## 아이콘 규격

- 아이콘은 SVG 형식의 이미지일 것.
- 16×16px 또는 32×32px 권장.
- 아이콘은 `<i class="iconname"></i>` 형태로 사용 가능.
- 아이콘은 `mask-image` 형태로 적용되며, 아이콘의 색상은 `background-color`에 `var(--icon)`으로 적용됨. CSS 변수 --icon이 지정되어 있지 않을 경우 표시되지 않을 수 있음.
- 크기를 변경하거나 색상으로 사용할 변수명을 바꾸려면 `header.css`를 수정할 것.