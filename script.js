/*
  HTML에서 필요한 요소들을 가져옵니다.
*/
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");

const fontSizeInput = document.getElementById("fontSizeInput");
const lineHeightInput = document.getElementById("lineHeightInput");

const charCount = document.getElementById("charCount");
const charCountNoSpace = document.getElementById("charCountNoSpace");
const saveStatus = document.getElementById("saveStatus");

const loadButton = document.getElementById("loadButton");
const pdfButton = document.getElementById("pdfButton");
const clearButton = document.getElementById("clearButton");

const printTitle = document.getElementById("printTitle");
const printContent = document.getElementById("printContent");

/*
  localStorage에 저장할 때 사용할 이름입니다.
  브라우저 안에 이 이름으로 저장됩니다.
*/
const TITLE_KEY = "novelTitle";
const CONTENT_KEY = "novelContent";
const FONT_SIZE_KEY = "novelFontSize";
const LINE_HEIGHT_KEY = "novelLineHeight";

/*
  글자 수를 계산하는 함수입니다.
*/
function updateCharCount() {
  const content = contentInput.value;

  // 공백 포함 글자 수
  charCount.textContent = content.length;

  // 공백 제외 글자 수
  // /\s/g는 모든 공백, 줄바꿈, 탭 등을 의미합니다.
  const contentWithoutSpace = content.replace(/\s/g, "");
  charCountNoSpace.textContent = contentWithoutSpace.length;
}

/*
  글꼴 크기와 줄간격을 본문 입력창에 적용하는 함수입니다.
*/
function applyEditorStyle() {
  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  // 본문 입력창에 선택한 글꼴 크기를 적용합니다.
  contentInput.style.fontSize = `${fontSize}px`;

  // 본문 입력창에 선택한 줄간격을 적용합니다.
  contentInput.style.lineHeight = lineHeight;
}

/*
  현재 입력된 제목, 본문, 설정값을 브라우저에 저장하는 함수입니다.
*/
function saveNovel() {
  const title = titleInput.value;
  const content = contentInput.value;
  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  localStorage.setItem(TITLE_KEY, title);
  localStorage.setItem(CONTENT_KEY, content);
  localStorage.setItem(FONT_SIZE_KEY, fontSize);
  localStorage.setItem(LINE_HEIGHT_KEY, lineHeight);

  saveStatus.textContent = "자동 저장되었습니다.";
}

/*
  저장된 글과 설정값을 불러오는 함수입니다.
*/
function loadNovel() {
  const savedTitle = localStorage.getItem(TITLE_KEY);
  const savedContent = localStorage.getItem(CONTENT_KEY);
  const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
  const savedLineHeight = localStorage.getItem(LINE_HEIGHT_KEY);

  if (savedTitle !== null) {
    titleInput.value = savedTitle;
  }

  if (savedContent !== null) {
    contentInput.value = savedContent;
  }

  if (savedFontSize !== null) {
    fontSizeInput.value = savedFontSize;
  }

  if (savedLineHeight !== null) {
    lineHeightInput.value = savedLineHeight;
  }

  applyEditorStyle();
  updateCharCount();

  saveStatus.textContent = "저장된 글을 불러왔습니다.";
}

/*
  PDF 저장을 준비하는 함수입니다.
  실제 PDF 저장은 브라우저의 인쇄 창에서 진행됩니다.
*/
function saveAsPdf() {
  const title = titleInput.value.trim() || "제목 없는 소설";
  const content = contentInput.value || "";

  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  // 인쇄용 제목에 현재 제목을 넣습니다.
  printTitle.textContent = title;

  // 인쇄용 본문에 현재 본문을 넣습니다.
  printContent.textContent = content;

  // PDF 본문에도 선택한 글꼴 크기와 줄간격을 적용합니다.
  printContent.style.fontSize = `${fontSize}px`;
  printContent.style.lineHeight = lineHeight;

  // 저장을 한 번 더 해둡니다.
  saveNovel();

  /*
    브라우저의 인쇄 창을 엽니다.
    여기서 대상을 "PDF로 저장"으로 선택하면 PDF 파일로 저장할 수 있습니다.
  */
  window.print();

  saveStatus.textContent = "PDF 저장 창을 열었습니다.";
}

/*
  전체 삭제 함수입니다.
*/
function clearNovel() {
  const confirmClear = confirm("정말 전체 내용을 삭제할까요? 저장된 내용도 함께 삭제됩니다.");

  if (confirmClear) {
    titleInput.value = "";
    contentInput.value = "";

    // 기본 설정으로 되돌립니다.
    fontSizeInput.value = "17";
    lineHeightInput.value = "1.8";

    localStorage.removeItem(TITLE_KEY);
    localStorage.removeItem(CONTENT_KEY);
    localStorage.removeItem(FONT_SIZE_KEY);
    localStorage.removeItem(LINE_HEIGHT_KEY);

    applyEditorStyle();
    updateCharCount();

    saveStatus.textContent = "전체 내용이 삭제되었습니다.";
  }
}

/*
  제목 입력 시 자동 저장
*/
titleInput.addEventListener("input", () => {
  saveNovel();
});

/*
  본문 입력 시 글자 수 계산 + 자동 저장
*/
contentInput.addEventListener("input", () => {
  updateCharCount();
  saveNovel();
});

/*
  글꼴 크기 변경 시 스타일 적용 + 자동 저장
*/
fontSizeInput.addEventListener("change", () => {
  applyEditorStyle();
  saveNovel();
});

/*
  줄간격 변경 시 스타일 적용 + 자동 저장
*/
lineHeightInput.addEventListener("change", () => {
  applyEditorStyle();
  saveNovel();
});

/*
  버튼 클릭 이벤트
*/
loadButton.addEventListener("click", loadNovel);
pdfButton.addEventListener("click", saveAsPdf);
clearButton.addEventListener("click", clearNovel);

/*
  페이지를 처음 열었을 때 자동으로 저장된 글을 불러옵니다.
*/
loadNovel();
