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

function updateCharCount() {
  const content = contentInput.value;

  charCount.textContent = content.length;

  const contentWithoutSpace = content.replace(/\s/g, "");
  charCountNoSpace.textContent = contentWithoutSpace.length;
}

function applyEditorStyle() {
  const fontSize = fontSizeInput.value;
  const lineHeight = lineHeightInput.value;

  contentInput.style.fontSize = `${fontSize}px`;
  contentInput.style.lineHeight = lineHeight;

  previewContent.style.fontSize = `${fontSize}px`;
  previewContent.style.lineHeight = lineHeight;
}

function updatePreview() {
  const title = titleInput.value.trim();
  const content = contentInput.value;

  previewTitle.textContent = title || "제목 없는 소설";
  previewContent.textContent = content || "여기에 본문 미리보기가 표시됩니다.";

  applyEditorStyle();
}

function saveNovel() {
  localStorage.setItem(TITLE_KEY, titleInput.value);
  localStorage.setItem(CONTENT_KEY, contentInput.value);
  localStorage.setItem(FONT_SIZE_KEY, fontSizeInput.value);
  localStorage.setItem(LINE_HEIGHT_KEY, lineHeightInput.value);

  saveStatus.textContent = "자동 저장되었습니다.";
}

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

function makeSafeFileName(fileName) {
  return fileName.replace(/[\\/:*?"<>|]/g, "_");
}

function saveAsPdf() {
  if (typeof html2pdf === "undefined") {
    alert("PDF 라이브러리를 불러오지 못했어요. 인터넷 연결이나 script 순서를 확인해주세요.");
    return;
  }

  saveStatus.textContent = "PDF를 만드는 중입니다...";

  saveNovel();
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

document.addEventListener("DOMContentLoaded", () => {
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
