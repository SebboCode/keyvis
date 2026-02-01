document.addEventListener("DOMContentLoaded", runScript);
window.addEventListener("resize", runScript);

const canvas_container = document.getElementsByClassName("canvas_container");
const item = document.getElementsByClassName("item");
const itemWide = document.getElementsByClassName("item-wide");
const itemNarrow = document.getElementsByClassName("item-narrow");
const klammer = document.getElementsByClassName("klammer");
const zeichen = [
    ...document.getElementsByClassName("mal"),
    ...document.getElementsByClassName("plus-neben"),
    ...document.getElementsByClassName("gleich-neben"),
];

function getBoundingClientRectWithMargin(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    const marginTop = parseFloat(style.marginTop) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    const marginBottom = parseFloat(style.marginBottom) || 0;
    const marginLeft = parseFloat(style.marginLeft) || 0;

    return {
        top: rect.top - marginTop,
        left: rect.left - marginLeft,
        bottom: rect.bottom + marginBottom,
        right: rect.right + marginRight,
        width: rect.width + marginLeft + marginRight,
        height: rect.height + marginTop + marginBottom,
    };
}

function runScript() {
    if (!itemWide[0] || !itemNarrow[0] || !klammer[0]) return;

    const max_width_px = 320;
    // 40% aber nicht mehr als max_width_px 
    const cc_w = Math.min(itemWide[0].getBoundingClientRect().width * 0.4, max_width_px);
    const cc_h = cc_w * (9 / 16);

    // Nur setzen, wenn Wert sich ändert
    for (let cc of canvas_container) {
        if (cc.style.width !== cc_w + "px") cc.style.width = cc_w + "px";
    }

    for (let k of klammer) {
        if (k.style.top !== cc_h + "px") k.style.top = cc_h + "px";
    }

    for (let z of zeichen) {
        if (z.style.height !== cc_h + "px") z.style.height = cc_h + "px";
    }

    const klammerMitMargin = getBoundingClientRectWithMargin(klammer[0]);
    const newHeight = cc_h * 2 + klammerMitMargin.height + 10 + "px";
    for (let i_w of itemWide) {
        if (i_w.style.height !== newHeight) i_w.style.height = newHeight;
    }

    const narrowHeight = cc_h + 10 + "px";
    if (itemNarrow[0].style.height !== narrowHeight) itemNarrow[0].style.height = narrowHeight;
}
