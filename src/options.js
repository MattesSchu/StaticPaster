let copyTextListContainer = document.getElementById("copy-text-list");
const presetCopyText = "Enter Text here";

/**
 * Create a uuidv4.
 * @returns uuid string
 */
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let backend = {
  syncList: function (i_list) {
    let copyTextList = i_list;
    chrome.storage.sync.set({ copyTextList });
  }
}

let visual = {
  visualList: [],

  initList: function () {
    chrome.storage.sync.get("copyTextList", (data) => {
      this.visualList = data.copyTextList;
      for (const element of data.copyTextList) {
        visual.addListEntry(visual.createListEntry(element));
      }
    });
  },

  initElements: function () {
    this.initList();
    this.initAddNewButton();
  },

  createEmptyElement: function () {
    let element = { text: "", uuid: uuidv4() };
    return element;
  },

  removeListEntry: function (e) {
    let target = e.target;
    let entry = target.className === "fa fa-trash"
      ? target.parentElement.parentElement.parentElement
      : target.parentElement.parentElement;
    // Delete from Entry in visual list
    let idx = visual.visualList.map(function (el) { return el.uuid; }).indexOf(entry.id);
    visual.visualList.splice(idx, 1);
    // Delete from frontend list
    entry.remove();
    // Update storage
    backend.syncList(visual.visualList);
  },

  changeText: function (e) {
    let uuid = e.target.parentElement.id;
    let idx = visual.visualList.map(function (el) { return el.uuid; }).indexOf(uuid);
    visual.visualList[idx].text = e.target.value;
    backend.syncList(visual.visualList);
  },

  createListEntry: function (i_element) {
    // Wrap textarea and button
    let entry = document.createElement("div");
    entry.className = "list-entry";
    entry.id = i_element.uuid;

    // textarea
    let element = document.createElement("textarea");
    element.className = "options-textarea";
    // element.rows = 2.5; //TODO: check
    element.innerHTML = i_element.text;
    if (i_element.text === "") {
      element.placeholder = presetCopyText;
    }
    element.addEventListener("change", this.changeText)

    // delete button
    let buttonContainer = document.createElement("div");
    buttonContainer.className = "delete-button";
    let button = document.createElement("button");
    button.className = "icon-button";
    button.addEventListener("click", this.removeListEntry);
    let icon = document.createElement("i");
    icon.className = "fa fa-trash";
    icon.ariaHidden = "true";
    button.appendChild(icon);
    buttonContainer.appendChild(button);

    // Combine
    entry.appendChild(element);
    entry.appendChild(buttonContainer);
    return entry;
  },

  addListEntry: function (i_entry) {
    copyTextListContainer.appendChild(i_entry);
  },

  addNewEntry: function () {
    // check if limit of 10 elements was reached
    if (this.visualList.length >= 10) {
      console.log("Unable to create more than 10 list entries.")
      return;
    }
    let entry = this.createEmptyElement();
    copyTextListContainer.appendChild(this.createListEntry(entry));
    this.visualList.push(entry);
    backend.syncList(this.visualList);
  },

  handleAddNewEntry: function (e) {
    visual.addNewEntry();
  },

  initAddNewButton: function () {
    let button = document.getElementById("add-new-element");
    button.addEventListener("click", this.handleAddNewEntry);
  },
}

visual.initElements();
