const radiosKeyAuswahl = document.querySelectorAll('input[name="Key-Auswahl"]');
radiosKeyAuswahl.forEach((radio) => radio.addEventListener("change", changeKey));
function changeKey(event) {
    keyart = event.target.value;

    // hue-knob nur wenn choma
    const chromaEinstellungen = document.querySelector("#chomaEinstellungen");
    if (keyart == "chroma") {
        chromaEinstellungen.style.display = "block";
        // Einstellungsleiste etwas breiter machen, damit die hue-knob reinpasst
        // document.getElementById("Einstellungsleiste").style.width = "min(calc(100% - 30px), 800px)";
    } else {
        chromaEinstellungen.style.display = "none";
        // Einstellungsleiste wieder schmaler machen
        // document.getElementById("Einstellungsleiste").style.width = "min(calc(100% - 30px), 735px)";
    }
    berechnen();
}

const radiosSourceAuswahl = document.querySelectorAll('input[name="Source-Auswahl"]');
radiosSourceAuswahl.forEach((radio) => radio.addEventListener("change", changeKeySrc));
async function changeKeySrc(event) {
    source = event.target.value;
    if (source === "self") KeyQuelleBild = FillBild;
    else if (source === "auto") KeyQuelleBild = await key_source_auto();

    berechnen();
}

const preMultiplied_check = document.querySelector("#preMultiplied");
preMultiplied_check.checked = false;
preMultiplied_check.addEventListener("input", function () {
    preMultiplied = preMultiplied_check.checked;
    berechnen();

    // Darstellung:
    const elms = [];
    // elms.push(document.querySelector("#multi1")); // ACHNUNG ACHNUNG BUG FIX
    elms.push(document.querySelector("#klammer1"));
    elms.push(document.querySelector("#KEY_canvas_container"));
    elms.push(document.querySelector("#FILL_x_KEY_canvas_container"));

    const btns = [document.querySelector("#KEY_canvas_button"), document.querySelector("#FILL_x_KEY_canvas_button")];

    if (preMultiplied) {
        elms.forEach((elm) => (elm.style.opacity = "20%"));
        btns.forEach((elm) => (elm.style.display = "none"));
    } else {
        elms.forEach((elm) => (elm.style.opacity = "100%"));
        btns.forEach((elm) => (elm.style.display = "block"));
    }
});

function beschriftungen(elm) {
    const beschriftungen = document.querySelectorAll(".canvas-lable");
    console.log(beschriftungen);
    beschriftungen.forEach((element) => {
        if (elm.checked) element.style.visibility = "visible";
        else element.style.visibility = "hidden";
    });
}


function fullscreen(id) {
    const elem = document.getElementById(id);

    if (!document.fullscreenElement) {
        if (normCanvRes !== fullscreenCanvRes) reloadRes(fullscreenCanvRes);

        elem.requestFullscreen().catch(err =>
            alert(`Error attempting fullscreen: ${err.message} (${err.name})`)
        );
    } else {
        document.exitFullscreen();
    }
}

let lastFullscreenEl = null;

document.addEventListener("fullscreenchange", () => {
    const isFullscreen = !!document.fullscreenElement;

    // Buttons
    document.querySelectorAll(".fullscreen-button").forEach(e =>
        e.style.backgroundImage = isFullscreen
            ? "url('IconExitFullscreen.png')"
            : "url('IconFullscreen.png')"
    );

    // Dropdown
    document.querySelectorAll(".dynamic-select-header")
        .forEach(e => e.classList.toggle("hidden-important", isFullscreen));

    // Beschriftung
    document.querySelectorAll(".canvas-lable")
        .forEach(e => e.style.fontSize = isFullscreen ? "5.5rem" : "1.2rem");

    if (isFullscreen) {
        lastFullscreenEl = document.fullscreenElement;
        lastFullscreenEl.classList.add("hide-border-important");

        if (navigator.userAgent.includes("Edg")) {
            overlay.style.display = "block";
        }
    } else {
        reloadRes(normCanvRes);

        lastFullscreenEl?.classList.remove("hide-border-important");

        // Safari Bugfix
        if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
            location.reload();
        }

        // Edge Bugfix
        overlay.style.display = "none";
    }
});

const inverse_check = document.querySelector("#Inverse");
inverse_check.checked = false;
inverse_check.addEventListener("input", function () {
    inverse = inverse_check.checked;
    berechnen();
});

const clip_slider = document.querySelector("#clip");
clip_slider.addEventListener("input", function () {
    clip = +this.value / 100; // 0 ... 1
    document.getElementById("clip-value").innerText = (+this.value).toFixed(0);
    berechnen();
});

const gain_slider = document.querySelector("#gain");
gain_slider.addEventListener("input", function () {
    gain = (-this.value + 100) / 200; // 0 ... 1
    document.getElementById("gain-value").innerText = (+this.value).toFixed(0);
    berechnen();
});

const hue_slider = document.querySelector("#hue");
hue_slider.addEventListener("input", function () {
    hue = this.value;

    // Normalisiere den Wert auf 0...359
    hue = ((+hue % 360) + 360) % 360;

    // document.getElementById("Farbvorschau").style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    var el = document.getElementById("hue-value");
    el.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    if (hue >= 200 || hue <= 30) el.style.setProperty("color", "white", "important");
    else el.style.setProperty("color", "black", "important");
    el.innerText = +hue + "°";
    berechnen();
});

// const color_picker = document.querySelector("#color_picker");
// color_picker.addEventListener("input", function () {
//     let rgb = hex_to_rgb(this.value);
//     hue = rgb_to_hsl(rgb[0], rgb[1], rgb[2])[0];

//     let hueRangeInput = document.querySelector("#hue");
//     hueRangeInput.setValue(hue.toFixed(1));
//     //              ^
//     //              +--- Das dauert einen moment und kann bei sehr extremer benutzung zu verzögerungen führen

//     document.getElementById("Farbvorschau").style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
//     document.getElementById("hue-value").innerText = +hue + "°";
//     berechnen();
// });

const density_slider = document.querySelector("#density");
density_slider.addEventListener("input", function () {
    density = this.value;
    document.getElementById("density-value").innerText = (+this.value).toFixed(0);
    berechnen();
});

async function changeImg(menuName, selectedValue) {
    if (menuName === "bildauswahl_fuer_FILL") {
        // console.log(FillBild);
        FillBild = await Bild_als_ImageData("img/" + selectedValue + ".png");
        FillBildValue = selectedValue;
        console.log(FillBild);
        if (source != "split") splitRef = FillBild;

        if (source === "self") KeyQuelleBild = FillBild;
        else if (source === "auto") KeyQuelleBild = await key_source_auto();
    } else if (menuName === "bildauswahl_fuer_BG") {
        BGBild = await Bild_als_ImageData("img/" + selectedValue + ".png");
        BGBildValue = selectedValue;
    }
    berechnen();
}

function changeNormCanvRes(auswahl) {
    normCanvRes = eval(auswahl.options[auswahl.selectedIndex].value);
    reloadRes(normCanvRes);
    berechnen();
}

function changeFullscreenCanvRes(auswahl) {
    fullscreenCanvRes = eval(auswahl.options[auswahl.selectedIndex].value);
}

function openErklaerung(id) {
    document.getElementById(id).style.setProperty("display", "flex", "important");
}

function closeErklaerung(id) {
    document.getElementById(id).style.setProperty("display", "none", "important");
}

document.addEventListener("click", (e) => {
    let erklaerDiv = document.getElementById("KnobsExplanation");
    let btn = document.getElementById("KnobsQuestion");

    if (!erklaerDiv.contains(e.target) && !btn.contains(e.target)) {
        erklaerDiv.style.display = "none";
    }
});

function setLinearKey() {
    // set Key-Type Luminanz
    document.querySelector('input[name="Key-Auswahl"][value="luma"]').checked = true;
    keyart = "luma";
    const chromaEinstellungen = document.querySelector("#chomaEinstellungen");
    chromaEinstellungen.style.display = "none";

    // set Gain -100
    gain_slider.setValue(-100);
    gain = 1;
    document.getElementById("gain-value").innerText = -100;

    // set Clip 100
    clip_slider.setValue(100);
    clip = 1;
    document.getElementById("clip-value").innerText = 100;
    
    // set Density 100
    density_slider.setValue(100);
    density = 100;
    document.getElementById("density-value").innerText = 100;

    berechnen();
}
