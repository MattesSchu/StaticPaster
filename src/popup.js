
let popup = {

  copyText: function (e) {
    let target = e.target;
    let text = target.className === "fa fa-clipboard"
      ? target.parentElement.parentElement.previousElementSibling.textContent
      : target.parentElement.previousElementSibling.textContent;
    text = text.replace(/(\r\n|\n|\r)/gm, "");
    text = text.replace(/\t/g, ' ');
    text = text.replace(/ +(?= )/g,'');
    navigator.clipboard.writeText(text)
      .then(() => {
          alert('Copied to clipboard: ' + text);
      })
  },

  addListEntry: function(i_entry) {
    let container = document.getElementById("copy-text-list");
    let entry = document.createElement("div");
    entry.className = "list-entry";

    // paragraph
    let element = document.createElement("p");
    element.className = "popup-text";
    element.innerHTML = i_entry.text;

    // copy button
    let buttonContainer = document.createElement("div");
    buttonContainer.className = "copy-button";
    let button = document.createElement("button");
    button.className = "icon-button";
    button.addEventListener("click", this.copyText);
    let icon = document.createElement("i");
    icon.className = "fa fa-clipboard";
    icon.ariaHidden = "true";
    button.appendChild(icon);
    buttonContainer.appendChild(button);

    // Combine
    entry.appendChild(element);
    entry.appendChild(buttonContainer);
    container.appendChild(entry);
  },

  initList: function () {
    chrome.storage.sync.get("copyTextList", (data) => {
      for (const element of data.copyTextList) {
        popup.addListEntry(element);
      }
    });
  },
}

document.addEventListener('DOMContentLoaded', function() {
  popup.initList();
});

