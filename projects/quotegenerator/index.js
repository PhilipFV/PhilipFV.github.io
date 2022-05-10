// variable decliration
var quoteCard, blockQuote, customBG, index, wordlList,
    backgroundImages = ["./resources/0.jpg", "./resources/1.jpg", "./resources/2.jpg", "./resources/3.jpg"]
    ,bgIndex = 0
    ,backgroundSize = 100;
document.addEventListener('DOMContentLoaded', function () {
    // load json and initilize site
    fetch("./wordlist-min.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            wordlList = jsondata;
            blockQuote = document.getElementById("Quote");
            // enable button
            document.getElementById("GenerateButton").disabled = false;
            index = 0;
            GenerateQuote();
        });
    // Download Button
    SetupDownload();
    // Upload Button
    SetpUpload();
    // Editor Buttons
    SetupEditor();

    SetBackground(0);
});

function SetupDownload() {
    quoteCard = document.getElementById('quoteCard');
    var downloadBtn = document.getElementById('DownloadButton');
    downloadBtn.onclick = function () {
        // domtoimage.toBlob(quoteCard)
        //     .then(function (blob) {
        //         var a = document.createElement('a');
        //         a.href = URL.createObjectURL(blob);
        //         a.download = 'github.philipv.tech/quotegenerator';
        //         a.click();
        //         a.remove();
        //     });
        // Extremely jank mobile fix
        // var cloneQuote = quoteCard.cloneNode(true);
        // cloneQuote.style.width = '500px';
        // cloneQuote.style.height = '600px';
        // cloneQuote.style.position = 'absolute';
        // cloneQuote.style.top = '0px';
        // cloneQuote.style.zIndex = '-1000';
        // cloneQuote.style.zIndex = '-1000';
        // document.body.appendChild(cloneQuote);
        domtoimage.toJpeg(quoteCard, { quality: 0.95 })
            .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'my-image-name.jpeg';
            link.href = dataUrl;
            link.click();
        });
        delete(cloneQuote);
    }
}

function SetpUpload() {
    var uploadButton = document.getElementById('uploadButton');
    var fileInput = document.getElementById('BGUpload');
    var customBGButton = document.getElementById('custombgbutton');

    fileInput.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            customBG = reader.result;
            quoteCard.style.backgroundImage = `url(${customBG})`;
            customBGButton.disabled = false;
            customBGButton.classList.remove('disabled');
            customBGButton.classList.add('shadow-transform');
            customBGButton.addEventListener('click', () => SetBackground(-1))
            // fileInput.style.backgroundImage = `url(${customBG})`;
     });
        reader.readAsDataURL(this.files[0]);
     });

    uploadButton.addEventListener('click', () => {
        fileInput.click(); // activate upload
        console.log(fileInput.files);
    });
}

function BGZoomIn() {
    backgroundSize += 25;
    UpdateBG();
}

function BGZoomOut() {
    backgroundSize -= 25;
    UpdateBG();
}

function UpdateBG() {
    backgroundSize = Math.min(Math.max(backgroundSize, 25), 600);
    quoteCard.style.backgroundSize = `${backgroundSize}%`
}

function SetBackground(index) {
    if (index === -1) {
        quoteCard.style.backgroundImage = `url(${customBG})`;
        return;
    }
    quoteCard.style.backgroundImage = `url(${backgroundImages[index]})`;
}

function SetupEditor() {
    // editor-hidden
    var toggleEditorButton = document.getElementById("OpenEditorButton");
    var editorOptionsPanel = document.getElementById("editorOptions");
    var toggleImageEditorButton = document.getElementById("OpenImageEditorButton");
    var imageOptionsPanel = document.getElementById("imageOptions");
    var editorOptions = document.getElementsByClassName("editorButton");
    var borderToggle = editorOptions[1];
    // fonts
    var constrastToggle = editorOptions[2];
    var fontToggle = editorOptions[3];
    var underlineToggle = editorOptions[4];
    var positionToggle = editorOptions[5];
    var backgroundSwitcher = editorOptions[9];
    var zoomIn = editorOptions[10];
    var zoomOut = editorOptions[11];

    var textPosition = 1;

    toggleEditorButton.onclick = () => {
        imageOptionsPanel.classList.add("editor-hidden");
        editorOptionsPanel.classList.toggle("editor-hidden");

    }
    toggleImageEditorButton.onclick = () => {
        editorOptionsPanel.classList.add("editor-hidden");
        imageOptionsPanel.classList.toggle("editor-hidden");
    };
    
    zoomIn.onclick = () => BGZoomIn();
    zoomOut.onclick = () => BGZoomOut();
    
    constrastToggle.onclick = () => quoteCard.classList.toggle("dark-color");
    borderToggle.onclick = () => quoteCard.classList.toggle("rounded-borders");
    fontToggle.onclick = () => quoteCard.classList.toggle("sans-serif");
    underlineToggle.onclick = () => quoteCard.classList.toggle("underline");
    positionToggle.onclick = () => {
        if (++textPosition == 1) {
            quoteCard.classList.add("text-top");
            quoteCard.classList.remove("text-bottom");
            return;
        }
        quoteCard.classList.remove("text-top");
        if (textPosition == 2) {
            quoteCard.classList.remove("text-bottom");
            return;
        }
        if (textPosition == 3) {
            quoteCard.classList.add("text-bottom");
            return
        }
        textPosition = 0;
        quoteCard.classList.remove("text-bottom");
    }

    backgroundSwitcher.onclick = () => {
        if (++bgIndex >= backgroundImages.length )
            bgIndex = 0;
        SetBackground(bgIndex);
    }

}

function GenerateQuote() {
    blockQuote.innerText = GetQuoteText();
}

var nn_a = ["will", "can", "may", "could"];

function GetQuoteText() {
    // if you *verb* *noun* then you *verb*
    var w = wordlList;
    var r = ranItem;
    var quoteStructures = [
        `If ${r(w.subjects)}${r(w.verbs)}${r([r(w.nouns), r(w.nouns_p)]).replace(/ /g, '')}. You will ${r(w.verbs)}${r(w.nouns_p, 't')} `,
        `${r(w.quantity, 't')}${r([`${r(w.verbs).replace(/(e | )/g, '')}ing`, r(w.tions)])} ${r(nn_a)}${r(w.frequency, 't')}bring ${r(w.subjects)}${r(w.quantity)}${r([r(w.tions), r(w.verbs)])}`
    ]
    var newquote = format(r(quoteStructures));
    return newquote
}

function format(str) {
    str = str.slice(0, -3) + "."
    str = capitalize(str);
    return str;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function ranItem(array, randomexclude = null, addSpace = true) {
    if (randomexclude && Math.random() < 0.5) return "";
    return array[Math.floor(Math.random() * array.length)] + " ";
}