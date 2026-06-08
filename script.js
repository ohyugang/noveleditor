/*
  HTML에서 필요한 요소들을 가져옵니다.
  document.getElementById("아이디")는 HTML에 있는 특정 요소를 찾는 명령입니다.
*/

const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const charCount = document.getElementById("charCount");
const charCountNoSpace = document.getElementById("charCountNoSpace");
const saveStatus = document.getElementById("saveStatus");

const loadButton = document.getElementById("loadButton");
const downloadButton = document.getElementById("downloadButton");
const clearButton = document.getElementById("clearButton");

/*
  localStorage에 저장할 때 사용할 이름입니다.
  브라우저 안에 "novelTitle", "novelContent"라는 이름으로 저장됩니다.
*/
const TITLE_KEY = "novelTitle";
const CONTENT_KEY = "novelContent";

/*
  글자 수를 계산하는 함수입니다.
*/
function updateCharCount() {
  const content = contentInput.value;

  // 공백 포함 글자 수
  charCount.textContent = content.length;

  // 공백 제거 후 글자 수
  // /\s/g는 모든 공백, 줄바꿈, 탭 등을 의미합니다.
  const contentWithoutSpace = content.replace(/\s/g, "");
  charCountNoSpace.textContent = contentWithoutSpace.length;
}

/*
  현재 입력된 제목과 본문을 브라우저에 저장하는 함수입니다.
*/
function saveNovel() {
  const title = titleInput.value;
  const content = contentInput.value;

  localStorage.setItem(TITLE_KEY, title);
  localStorage.setItem(CONTENT_KEY, content);

  saveStatus.textContent = "자동 저장되었습니다.";
}

/*
  저장된 글을 불러오는 함수입니다.
*/
function loadNovel() {
  const savedTitle = localStorage.getItem(TITLE_KEY);
  const savedContent = localStorage.getItem(CONTENT_KEY);

  if (savedTitle !== null) {
    titleInput.value = savedTitle;
  }

  if (savedContent !== null) {
    contentInput.value = savedContent;
  }

  updateCharCount();
  saveStatus.textContent = "저장된 글을 불러왔습니다.";
}

/*
  TXT 파일로 다운로드하는 함수입니다.
*/
function downloadTxtFile() {
  const title = titleInput.value.trim() || "제목 없는 소설";
  const content = contentInput.value;

  // txt 파일 안에 들어갈 내용입니다.
  const fileText = `${title}\n\n${content}`;

  // 파일 데이터를 만듭니다.
  const blob = new Blob([fileText], { type: "text/plain;charset=utf-8" });

  // 다운로드용 주소를 임시로 만듭니다.
  const url = URL.createObjectURL(blob);

  // a 태그를 코드로 만들어서 클릭한 것처럼 처리합니다.
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.txt`;

  document.body.appendChild(link);
  link.click();

  // 사용이 끝난 임시 요소와 주소를 정리합니다.
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  saveStatus.textContent = "TXT 파일을 다운로드했습니다.";
}

/*
  전체 삭제 함수입니다.
*/
function clearNovel() {
  const confirmClear = confirm("정말 전체 내용을 삭제할까요? 저장된 내용도 함께 삭제됩니다.");

  if (confirmClear) {
    titleInput.value = "";
    contentInput.value = "";

    localStorage.removeItem(TITLE_KEY);
    localStorage.removeItem(CONTENT_KEY);

    updateCharCount();
    saveStatus.textContent = "전체 내용이 삭제되었습니다.";
  }
}

/*
  제목이나 본문을 입력할 때마다 자동으로 실행됩니다.
  input 이벤트는 사용자가 글자를 입력할 때마다 발생합니다.
*/
titleInput.addEventListener("input", () => {
  saveNovel();
});

contentInput.addEventListener("input", () => {
  updateCharCount();
  saveNovel();
});

/*
  버튼 클릭 이벤트입니다.
*/
loadButton.addEventListener("click", loadNovel);
downloadButton.addEventListener("click", downloadTxtFile);
clearButton.addEventListener("click", clearNovel);

/*
  페이지를 처음 열었을 때 자동으로 저장된 글을 불러옵니다.
*/
loadNovel();
