/* since this is a new blog, the following sets up default settings for header image
    and title. If the title or image aren't manipulated, these defaults get passed
    to backend */

var currentImage;
var gradient = false;
var titleStyle = {
  fontSize: 5,
  top: 50,
  left: 50,
  color: "white"
};
var currentStyle = {
  url: currentImage,
  backgroundPositionX: 0,
  backgroundPositionY: 0,
  backgroundSize: 0
};
document.querySelector(".blog__header__image").style.border = "1px solid grey";
/* puts all content and settings into a form for submission to backend */

function copyContent() {
  console.log("running copyContent");
  document.querySelector(
    ".editor__textarea--hidden"
  ).value = document.querySelector(".editor__textarea").innerHTML;
  document.querySelector(".blog__header-img__positionX--hidden").value =
    currentStyle.backgroundPositionX;
  document.querySelector(".blog__header-img__positionY--hidden").value =
    currentStyle.backgroundPositionY;
  document.querySelector(".blog__header-img__size--hidden").value =
    currentStyle.backgroundSize;
  document.querySelector(
    ".blog__header-img__gradient--hidden"
  ).value = gradient;
  document.querySelector(".blog__title__fontTop--hidden").value =
    titleStyle.top;
  document.querySelector(".blog__title__fontLeft--hidden").value =
    titleStyle.left;
  document.querySelector(".blog__title__fontColor--hidden").value =
    titleStyle.color;
  document.querySelector(".blog__title__fontSize--hidden").value =
    titleStyle.fontSize;

  if (!document.querySelector(".editor__textarea--hidden").value) {
    console.log("return false");
    return false;
  } else {
    console.log("submitting");
    console.log(
      "\n currentStyles:" +
        currentStyle.backgroundPositionX +
        "\n" +
        currentStyle.backgroundPositionY +
        "\n text styles: " +
        titleStyle.fontSize
    );
    return true;
  }
}

/* image carousel for previously uploaded images that can be reused in new blog post */

function imageSelector(mode) {
  console.log("clicked!");
  if (document.querySelector(".editor__image-selector")) {
    return;
  }
  var images = document
    .querySelector(".imageVar")
    .getAttribute("data-imageVariable");
  var user = document
    .querySelector(".userVar")
    .getAttribute("data-userVariable");

  /* user images are found in the blog route using shelljs and put into a string,
        the following code cleans up filenames and puts them into an array for use */

  images = images
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .replace(/\"/g, "");
  var imageArray = images.split(",");

  var imageDiv = document.createElement("div");

  imageDiv.classList.add("editor__image-selector");

  for (let i = 0; i < imageArray.length; i++) {
    var imageGrid = document.createElement("div");
    imageGrid.classList.add("editor__image--thumbnail");

    if (mode === "new") {
      var imageSelection = "../bionicUser/" + user + "/" + imageArray[i];
    } else {
      var imageSelection = "../../bionicUser/" + user + "/" + imageArray[i];
    }
    let img = new Image();

    img.src = imageSelection;
    img.style.height = "100px";
    img.style.width = "100px";
    var imageInput = document.createElement("input");

    imageInput.setAttribute("type", "radio");
    if (mode === "edit") {
      imageInput.setAttribute("name", "blog[pickedImage]");
    } else {
      imageInput.setAttribute("name", "pickedImage");
    }
    imageInput.setAttribute("value", imageSelection);
    imageInput.classList.add("editor__image__input--radio");

    // sets selection as background iamge for div
    imageInput.addEventListener("change", function(e) {
      document.querySelector(".editor__image__input--upload").value = "";
      var styles = document.getElementById("bpStyles");
      console.log(styles.sheet);

      styles.sheet.insertRule(
        ".blog__header__image { background-image: url(" + this.value + ")}",
        styles.sheet.cssRules.length
      );
      currentImage = this.value;
    });

    imageGrid.appendChild(img);
    imageGrid.appendChild(imageInput);

    imageDiv.appendChild(imageGrid);
  }

  var editorImg = document.querySelector(".editor__image-selection-controls");
  editorImg.insertAdjacentElement("afterend", imageDiv);
}

/************************************** */
/* preview uploaded image in hero image */
/************************************* */
window.onload = function() {
  var fileInput = document.querySelector(".editor__image__input--upload");
  var fileDisplayArea = document.querySelector(".blog__header__image");

  fileInput.addEventListener("change", function(e) {
    var radio = document.querySelectorAll(".editor__image__input--radio");
    for (let i = 0; i < radio.length; i++) {
      //clears radio selction in favor of upload
      radio[i].checked = false;
    }

    var file = fileInput.files[0];
    var imageType = /image.*/;

    if (file.type.match(imageType)) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var img = new Image();
        img.src = reader.result;

        var styles = document.getElementById("bpStyles");

        styles.sheet.insertRule(
          ".blog__header__image { background-image: url(" + img.src + ")}",
          styles.sheet.cssRules.length
        );
        currentImage = img.src;
      };

      reader.readAsDataURL(file);
    } else {
      fileDisplayArea.innerHTML = "File not supported!";
    }
  });
};

////////////////////////// stylesfor background image //////////////
function tinter() {
  var styles = document.getElementById("bpStyles");
  if (gradient === false) {
    styles.sheet.insertRule(
      ".blog__header__image { background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(" +
        currentImage +
        ")}",
      styles.sheet.cssRules.length
    );
    gradient = true;
  } else {
    styles.sheet.insertRule(
      ".blog__header__image { background-image: url(" + currentImage + ")}",
      styles.sheet.cssRules.length
    );
    gradient = false;
  }
}

function move(dir) {
  var bgImage = currentImage;
  console.log("move" + dir);
  var styles = document.getElementById("bpStyles");
  switch (dir) {
    case "up":
      console.log("move" + dir);
      currentStyle.backgroundPositionY -= 10;
      break;
    case "down":
      currentStyle.backgroundPositionY += 10;
      break;
    case "left":
      currentStyle.backgroundPositionX -= 10;
      break;
    case "right":
      currentStyle.backgroundPositionX += 10;
      break;
  }
  console.log(
    currentStyle.backgroundPositionX +
      " and " +
      currentStyle.backgroundPositionY
  );
  styles.sheet.insertRule(
    ".blog__header__image { background-position: " +
      currentStyle.backgroundPositionX +
      "px " +
      currentStyle.backgroundPositionY +
      "px}",
    styles.sheet.cssRules.length
  );
}

function size(dir) {
  var styles = document.getElementById("bpStyles");
  switch (dir) {
    case "up":
      currentStyle.backgroundSize += 1;
      break;
    case "down":
      currentStyle.backgroundSize -= 1;
      break;
  }
  styles.sheet.insertRule(
    ".blog__header__image { padding-top: " +
      currentStyle.backgroundSize +
      "%}",
    styles.sheet.cssRules.length
  );
}

//////////////////title manipulation///////////////

function moveT(dir) {
  var title = document.querySelector(".blog__title");
  var styles = document.getElementById("bpStyles");

  switch (dir) {
    case "up":
      titleStyle.top--;
      break;
    case "left":
      titleStyle.left--;
      break;
    case "down":
      titleStyle.top++;
      break;
    case "right":
      titleStyle.left++;
      break;
  }
  styles.sheet.insertRule(
    ".blog__title { top: " + titleStyle.top + "%}",
    styles.sheet.cssRules.length
  );
  styles.sheet.insertRule(
    ".blog__title { left: " + titleStyle.left + "%}",
    styles.sheet.cssRules.length
  );
}

function fontManip(effect) {
  var styles = document.getElementById("bpStyles");
  switch (effect) {
    case "up":
      titleStyle.fontSize++;
      break;
    case "down":
      titleStyle.fontSize--;
      break;
  }
  styles.sheet.insertRule(
    ".blog__title { font-size: " + titleStyle.fontSize + "em}",
    styles.sheet.cssRules.length
  );
}

var colorPicker = document.querySelector(".font__color");
colorPicker.addEventListener("input", function(e) {
  styles = document.getElementById("bpStyles");
  titleStyle.color = this.value;
  styles.sheet.insertRule(
    ".blog__title { color: " + titleStyle.color + "}",
    styles.sheet.cssRules.length
  );
});

// preview title
var title = document.querySelector(".input__title");
title.addEventListener("keyup", function(e) {
  document.querySelector(".blog__title").innerHTML = this.value;
});

/**************************** */
/*text editor
/*************************** */
/**** function called onclick from buttons */

function edit(command) {
  var textarea = document.querySelector(".editor__textarea");
  textarea.designMode = "On";
  console.log(document.queryCommandEnabled(command));
  // textarea.select();
  switch (command) {
    case "bold":
      document.execCommand("bold", false, null);
      break;

    case "italic":
      document.execCommand("italic", false, null);
      break;

    case "undo":
      document.execCommand("undo", false, null);
      break;

    case "justifyLeft":
      document.execCommand("justifyLeft", false, null);
      break;

    case "justifyRight":
      document.execCommand("justifyRight", false, null);
      break;

    case "justifyCenter":
      document.execCommand("justifyCenter", false, null);
      break;

    case "superscript":
      document.execCommand("superscript", false, null);
      break;

    case "insertImage":
      document.execCommand("insertImage", true);
      break;

    case "underline":
      document.execCommand("underline", false, null);
      break;

    case "strikeThrough":
      document.execCommand("strikeThrough", false, null);
      break;

    case "redo":
      document.execCommand("redo", false, null);
      break;

    case "indent":
      document.execCommand("indent", false, null);
      break;

    case "insertUnorderedList":
      document.execCommand("insertUnorderedList", false, null);
      break;

    case "insertOrderedList":
      document.execCommand("insertOrderedList", false, null);
      break;
  }
  textarea.focus();
}
