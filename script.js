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

const printArea = document.getElementById("printArea");
const printTitle = document.getElementById("printTitle");
const printContent = document.getElementById("printContent");

const TITLE_KEY = "novelTitle";
const CONTENT_KEY = "novelContent";
const FONT_SIZE_KEY = "novelFontSize";
const LINE_HEIGHT_KEY = "novelLineHeight";

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
  즉시 저장
*/
function saveNovel() {
  localStorage.setItem(TITLE_KEY, titleInput.value);
  localStorage.setItem(CONTENT_KEY, contentInput.value);
  localStorage.setItem(FONT_SIZE_KEY, fontSizeInput.value);
  localStorage.setItem(LINE_HEIGHT_KEY, lineHeightInput.value);

  saveStatus.textContent = "저장됨";
}

/*
  화면 전체 즉시 갱신
  글을 입력할 때마다 이 함수가 실행됩니다.
*/
function updateAllNow() {
  updateCharCount();
  updatePreview();
  saveNovel();
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
  PDF 영역 스타일 초기화
*/
function resetPrintAreaStyle() {
  printArea.style.display = "none";
  printArea.style.position = "";
  printArea.style.left = "";
  printArea.style.top = "";
  printArea.style.width = "";
  printArea.style.minHeight = "";
  printArea.style.padding = "";
  printArea.style.background = "";
  printArea.style.color = "";
  printArea.style.zIndex = "";
}

/*
  PDF로 만들 영역 준비
*/
function preparePrintArea() {
  const title = titleInput.value.trim() || "제목 없는 소설";
  const content = contentInput.value || "";

  printTitle.textContent = title;
  printContent.textContent = content;

  printContent.style.fontSize = `${fontSizeInput.value}px`;
  printContent.style.lineHeight = lineHeightInput.value;

  printArea.style.display = "block";
  printArea.style.position = "fixed";
  printArea.style.left = "-9999px";
  printArea.style.top = "0";
  printArea.style.width = "794px";
  printArea.style.minHeight = "1123px";
  printArea.style.padding = "72px 64px";
  printArea.style.background = "#ffffff";
  printArea.style.color = "#000000";
  printArea.style.zIndex = "-1";
}

/*
  파일 이름에 쓸 수 없는 문자 제거
*/
function makeSafeFileName(fileName) {
  return fileName.replace(/[\\/:*?"<>|]/g, "_");
}

/*
  PDF 바로 저장
*/
function saveAsPdf() {
  if (typeof html2pdf === "undefined") {
    alert("PDF 라이브러리를 불러오지 못했어요. 인터넷 연결을 확인해주세요.");
    return;
  }

  updateAllNow();

  saveStatus.textContent = "PDF를 만드는 중입니다...";

  preparePrintArea();

  const title = titleInput.value.trim() || "제목 없는 소설";
  const safeFileName = makeSafeFileName(title);

  const options = {
    margin: 0,
    filename: `${safeFileName}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "px",
      format: [794, 1123],
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"]
    }
  };

  html2pdf()
    .set(options)
    .from(printArea)
    .save()
    .then(() => {
      resetPrintAreaStyle();
      saveStatus.textContent = "PDF 파일을 다운로드했습니다.";
    })
    .catch((error) => {
      console.error("PDF 생성 중 오류:", error);
      resetPrintAreaStyle();
      saveStatus.textContent = "PDF 생성 중 오류가 발생했습니다.";
      alert("PDF 생성 중 오류가 발생했어요.");
    });
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
  붙여넣기, 한글 입력, 모바일 입력까지 최대한 바로 반영되게 이벤트를 여러 개 연결합니다.
*/
document.addEventListener("DOMContentLoaded", () => {
  loadNovel();

  titleInput.addEventListener("input", updateAllNow);
  titleInput.addEventListener("keyup", updateAllNow);
  titleInput.addEventListener("change", updateAllNow);
  titleInput.addEventListener("paste", () => {
    setTimeout(updateAllNow, 0);
  });
  titleInput.addEventListener("compositionend", updateAllNow);

  contentInput.addEventListener("input", updateAllNow);
  contentInput.addEventListener("keyup", updateAllNow);
  contentInput.addEventListener("change", updateAllNow);
  contentInput.addEventListener("paste", () => {
    setTimeout(updateAllNow, 0);
  });
  contentInput.addEventListener("compositionend", updateAllNow);

  fontSizeInput.addEventListener("input", updateAllNow);
  fontSizeInput.addEventListener("change", updateAllNow);

  lineHeightInput.addEventListener("input", updateAllNow);
  lineHeightInput.addEventListener("change", updateAllNow);

  loadButton.addEventListener("click", loadNovel);
  pdfButton.addEventListener("click", saveAsPdf);
  clearButton.addEventListener("click", clearNovel);
});
