

let color = "#3aa757";
let copyTextList = [
  { text: "This is one predefined text. Please replace me 😊", uuid: "af6afc0b-f12a-4674-b232-55f24c00f6a4" }
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.sync.set({ copyTextList });
  console.log("The static Text list was initialized with: ", copyTextList);
});

chrome.commands.onCommand.addListener(function (command, tab) {
  console.log("Command:", command);
  console.log("Tab:", tab.id);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: testMatti,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function testMatti() {
  let myValue = "Hello World!";
  let myMy = document.activeElement;

  if (myMy.selectionStart || myMy.selectionStart == "0") {
    var startPos = myMy.selectionStart;
    var endPos = myMy.selectionEnd;
    myMy.value =
      myMy.value.substring(0, startPos) +
      myValue +
      myMy.value.substring(endPos, myMy.value.length);
  }
}
