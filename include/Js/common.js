"use strict"

let classes = {};
let canvas = null;
let images = {};
let bboxes = {};
let bndcnt = {};
let fontColors = {};
let borderColors = {};
let graphON = false;

let currentImage = null;
let currentClass = null;
let currentBBox = null;
let currentModel = {};


let mouse = {
    x : 0,
    y : 0,
    realX : 0,
    realY : 0,
    buttonL : false,
    buttonR : false,
    startRealX : 0,
    startRealY : 0
};

const drawCanvas = new DrawCanvas(30, fontColor, borderColor, backgroundColor, markedFontColor, markedBorderColor, markedBackgroundColor, scale);
const classesManager = new Classes(drawCanvas);
const bboxesManager = new BBox(drawCanvas);
const modelGraph = new ModelGraph();

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

const isSupported = () =>
{
    try
    {
        const key = "__some_random_key_1234%(*^()^)___";

        localStorage.setItem(key, key);
        localStorage.removeItem(key);

        return true;
    }
    catch(e)
    {
        return false;
    }
};

if (isSupported() === true)
{
    setInterval(() =>
    {
        if(Object.keys(bboxes).length > 0)
        {
            localStorage.setItem("bboxes", JSON.stringify(bboxes));
        }
    }, saveInterval * 1000);
}
else
{
    alert("Restore function is not supported. If you need it, use Chrome or Firefox instead.");
}

document.onreadystatechange = () =>{
    if (document.readyState === "complete")
    {
        // drawCanvas.listenCanvas();
        
        canvas = new Canvas("canvas", document.getElementById("center").clientWidth, window.innerHeight - 20)
        
        canvas.on("draw", (context) =>
        {
            drawCanvas.listenCanvas(context);
            modelGraph.drawModelGraph();
            modelGraph.currentBboxesScoreBar();
        }).start()


        drawCanvas.mouseMotionEvent();
        drawCanvas.canvasImageLoad();
        drawCanvas.imageSelect();

        
        classesManager.classesLoad();
        classesManager.classesSelect();

        FILE_IO.saveFile();
        FILE_IO.bboxFile_Load();

        modelGraph.modelGraphLoad()

        drawCanvas.zoomUI();
        drawCanvas.imageMovementUI();
        drawCanvas.eventKeyboard();
        drawCanvas.searchImage();     

    }
}