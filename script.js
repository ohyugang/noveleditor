/*
  웹 소설 편집기 기능 코드
  - 자동 저장
  - 글자 수 계산
  - 미리보기
  - 글꼴 크기 조절
  - 줄간격 조절
  - PDF 저장
*/

// HTML 요소를 가져옵니다.
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

const previewTitle = document.getElementById("previewTitle");
const previewContent = document.getElementById("previewContent");

const printTitle = document.getElementById("printTitle");
const printContent = document.getElementById("printContent");

// localStorage 저장 이름입니다.
const TITLE_KEY = "novelTitle";
const CONTENT_KEY = "novelContent";
const FONT_SIZE_KEY = "novelFontSize";
const LINE_HEIGHT_KEY = "novelLineHeight";

/*
  필수 요소가 제대로 연결되었는지 확인합니다.
  하나라도 없으면 콘솔에 에러를 보여줍니다.
*/
function checkElements() {
  const elements = [
    ["titleInput", titleInput],
    ["contentInput", contentInput],
    ["fontSizeInput", fontSizeInput],
    ["lineHeightInput", lineHeightInput],
    ["charCount", charCount],
    ["charCountNoSpace", charCountNoSpace],
    ["saveStatus", saveStatus],
    ["loadButton", loadButton],
    ["pdfButton", pdfButton],
    ["clearButton", clearButton],
    ["previewTitle", previewTitle],
    ["previewContent", previewContent],
    ["printTitle", printTitle],
    ["printContent", printContent],
  ];

  let hasError = false;

  elements.forEach(([name, element]) => {
    if (!element) {
      console.error(`${name} 요소를 찾을 수 없습니다. index.html의 id를 확인하세요.`);
      hasError = true;
    }
  });

  return !hasError;
}

/*
  글자 수 계산
*/
function updateCharCount() {
  const content = contentInput.value;

  charCount.textContent = content.length;

  const contentWithoutSpace = content.replace(/\s/g, "");
  charCountNoSpace.textContent = contentWithoutSpace.length;
}

/*
  글꼴 크기와 줄간격 적용
*/
function applyEditorStyle() {
  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  contentInput.style.fontSize = `${fontSize}px`;
  contentInput.style.lineHeight = lineHeight;

  previewContent.style.fontSize = `${fontSize}px`;
  previewContent.style.lineHeight = lineHeight;
}

/*
  미리보기 업데이트
*/
function updatePreview() {
  const title = titleInput.value.trim();
  const content = contentInput.value;

  previewTitle.textContent = title || "제목 없는 소설";
  previewContent.textContent = content || "여기에 본문 미리보기가 표시됩니다.";

  applyEditorStyle();
}

/*
  자동 저장
*/
function saveNovel() {
  localStorage.setItem(TITLE_KEY, titleInput.value);
  localStorage.setItem(CONTENT_KEY, contentInput.value);
  localStorage.setItem(FONT_SIZE_KEY, fontSizeInput.value);
  localStorage.setItem(LINE_HEIGHT_KEY, lineHeightInput.value);

  saveStatus.textContent = "자동 저장되었습니다.";
}

/*
  저장된 글 불러오기
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

  updateCharCount();
  updatePreview();
  applyEditorStyle();

  saveStatus.textContent = "저장된 글을 불러왔습니다.";
}

/*
  PDF 저장
*/
/*
  PDF 파일을 바로 다운로드하는 함수입니다.
  인쇄 창을 열지 않고, html2pdf.js를 이용해 PDF를 생성합니다.
*/
function saveAsPdf() {
  const title = titleInput.value.trim() || "제목 없는 소설";
  const content = contentInput.value || "";

  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  // PDF로 만들 영역에 현재 제목과 본문을 넣습니다.
  printTitle.textContent = title;
  printContent.textContent = content;

  // PDF 본문에도 선택한 글꼴 크기와 줄간격을 적용합니다.
  printContent.style.fontSize = `${fontSize}px`;
  printContent.style.lineHeight = lineHeight;

  // PDF 출력 영역을 잠깐 화면 밖에서 보이게 만듭니다.
  // display: none 상태면 PDF 라이브러리가 내용을 제대로 못 읽는 경우가 있습니다.
  const printArea = document.getElementById("printArea");

  printArea.style.display = "block";
  printArea.style.position = "fixed";
  printArea.style.left = "-9999px";
  printArea.style.top = "0";
  printArea.style.width = "794px";
  printArea.style.padding = "60px";
  printArea.style.background = "#ffffff";
  printArea.style.color = "#000000";

  // 저장을 한 번 더 해둡니다.
  saveNovel();

  // 파일 이름에 사용할 수 없는 문자를 안전하게 바꿉니다.
  const safeFileName = title.replace(/[\\/:*?"<>|]/g, "_");

  // html2pdf 설정입니다.
  const options = {
    margin: 10,
    filename: `${safeFileName}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"]
    }
  };

  // PDF 생성 후 바로 다운로드합니다.
  html2pdf()
    .set(options)
    .from(printArea)
    .save()
    .then(() => {
      // PDF 저장이 끝나면 다시 숨깁니다.
      printArea.style.display = "none";
      printArea.style.position = "";
      printArea.style.left = "";
      printArea.style.top = "";
      printArea.style.width = "";
      printArea.style.padding = "";
      printArea.style.background = "";
      printArea.style.color = "";

      saveStatus.textContent = "PDF 파일을 다운로드했습니다.";
    })
    .catch((error) => {
      console.error("PDF 생성 중 오류:", error);

      // 오류가 나도 다시 숨깁니다.
      printArea.style.display = "none";
      printArea.style.position = "";
      printArea.style.left = "";
      printArea.style.top = "";
      printArea.style.width = "";
      printArea.style.padding = "";
      printArea.style.background = "";
      printArea.style.color = "";

      saveStatus.textContent = "PDF 생성 중 오류가 발생했습니다.";
      alert("PDF 생성 중 오류가 발생했어요. 콘솔을 확인해주세요.");
    });
}
  const title = titleInput.value.trim() || "제목 없는 소설";
  const content = contentInput.value || "";

  printTitle.textContent = title;
  printContent.textContent = content;

  printContent.style.fontSize = `${fontSizeInput.value}px`;
  printContent.style.lineHeight = lineHeightInput.value;

  saveNovel();

  // 인쇄 창을 엽니다. 여기서 "PDF로 저장"을 선택하면 됩니다.
  window.print();

  saveStatus.textContent = "PDF 저장 창을 열었습니다.";
}

/*
  전체 삭제
*/
function clearNovel() {
  const result = confirm("정말 전체 내용을 삭제할까요? 저장된 내용도 함께 삭제됩니다.");

  if (!result) {
    return;
  }

  titleInput.value = "";
  contentInput.value = "";
  fontSizeInput.value = "17";
  lineHeightInput.value = "1.8";

  localStorage.removeItem(TITLE_KEY);
  localStorage.removeItem(CONTENT_KEY);
  localStorage.removeItem(FONT_SIZE_KEY);
  localStorage.removeItem(LINE_HEIGHT_KEY);

  updateCharCount();
  updatePreview();
  applyEditorStyle();

  saveStatus.textContent = "전체 내용이 삭제되었습니다.";
}

/*
  페이지가 완전히 준비된 뒤 실행합니다.
*/
document.addEventListener("DOMContentLoaded", () => {
  const isReady = checkElements();

  if (!isReady) {
    alert("HTML과 JavaScript 연결에 문제가 있어요. index.html의 id 이름을 확인해주세요.");
    return;
  }

  titleInput.addEventListener("input", () => {
    updatePreview();
    saveNovel();
  });

  contentInput.addEventListener("input", () => {
    updateCharCount();
    updatePreview();
    saveNovel();
  });

  fontSizeInput.addEventListener("change", () => {
    applyEditorStyle();
    updatePreview();
    saveNovel();
  });

  lineHeightInput.addEventListener("change", () => {
    applyEditorStyle();
    updatePreview();
    saveNovel();
  });

  loadButton.addEventListener("click", loadNovel);
  pdfButton.addEventListener("click", saveAsPdf);
  clearButton.addEventListener("click", clearNovel);

  loadNovel();
});
