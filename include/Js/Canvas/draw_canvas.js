class DrawCanvas extends Observable
{

    constructor(_fontSize, _fontColor, _borderColor, _backgroundColor, _markedFontColor,  _markedBorderColor, _markedBackgroundColor, _scale)
    {
        super()
        
        this.canvasX = 0
        this.canvasY = 0
        this.screenX = 0
        this.screenY = 0

        this.imageListIdx = 0

        this.fontBaseSize = _fontSize;
        this.fontColor = _fontColor
        this.borderColor = _borderColor
        this.backgroundColor = _backgroundColor

        this.markedFontColor = _markedFontColor
        this.markedBorderColor = _markedBorderColor
        this.markedBackgroundColor = _markedBackgroundColor

        this.scale = _scale
        this.defaultScale = 0.5

        this.minZoom = 0.1
        this.maxZoom = 5
        this.scrollSpeed = 1.1

        this.movedWidth = 0
        this.movedHeight = 0 
         
        this.drawCenterX = true // Whether to draw a cross in the middle of bbox
        this.drawGuidelines = true // Whether to draw guidelines for cursor

        this.drawBBoxReady = true;
    }

    listenCanvas(context)
    {
        if(currentImage !== null)
        {
            this.drawImage(context)
            this.drawNewBbox(context)
            this.drawExistingBboxes(context)
            this.drawCross(context)
        }
        else
        {
            this.drawIntro(context)
        }
    }

    drawImage = (context) =>
    {
        context.drawImage(currentImage.object, this.zoomX(0), this.zoomY(0), this.zoom(currentImage.width), this.zoom(currentImage.height))
        
    }

    drawIntro = (context) =>
    {
        context.fillStyle = "#454a60"
        context.font = "bold 40px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(40)}px`)
        context.fillText("사용법", this.zoomX(40), this.zoomY(50))
        context.fillText("1. 이미지를 불러오기", this.zoomX(80), this.zoomY(110))
        context.fillText("2. 레이블 불러오기", this.zoomX(80), this.zoomY(170))
        context.fillText("3. 이미지 선택 및 레이블 선택하기", this.zoomX(80), this.zoomY(230))
        context.fillText("4. 박스 그리기", this.zoomX(80), this.zoomY(290))
        context.fillText("5. 원하는 확장자 선택하여 박스 저장 및 불러오기", this.zoomX(80), this.zoomY(350))

        context.font = "bold 28px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(28)}px`)
        context.fillText("박스 불러올 때 ALL 선택 시 박스 불러오기가 되지 않습니다.", this.zoomX(140), this.zoomY(392))
        context.fillText("YOLO type file를 불러와서 VOC로 저장하게 되면 file type이 VOC로 전환됩니다.", this.zoomX(140), this.zoomY(422))
        

        context.font = "bold 40px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(40)}px`)
        context.fillText("7. Model Load 버튼을 클릭하여 학습된 AI모델 연동하기", this.zoomX(80), this.zoomY(475))
        
        context.font = "bold 40px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(40)}px`)
        context.fillText("단축기", this.zoomX(40), this.zoomY(650)) 

        
        context.font = "bold 28px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(28)}px`)
        context.fillText("Mouse Wheel : 레이블 바꾸기", this.zoomX(80), this.zoomY(700))
        context.fillText("위쪽 방향키 : 이미지 줌인", this.zoomX(80), this.zoomY(740))
        context.fillText("아래쪽 방향키 : 이미지 줌아웃", this.zoomX(80), this.zoomY(780))
        context.fillText("왼쪽 방향키 : 이전 이미지", this.zoomX(80), this.zoomY(820))
        context.fillText("오른쪽 방향키 : 다음 이미지", this.zoomX(80), this.zoomY(860))
        context.fillText("Ctrl : 이미지 사이즈 화면에 맞추기", this.zoomX(80), this.zoomY(900))
        context.fillText("Del : 박스 지우기", this.zoomX(80), this.zoomY(940))

        context.font = context.font.replace(/\d+px/, `${this.zoom(35)}px`)
        context.fillText("지원하는 브라우저 : Chrome, Opera", this.zoomX(40), this.zoomY(1200))

        
        context.font = context.font.replace(/\d+px/, `${this.zoom(28)}px`)
        context.fillText("* 현재 Model Load 버튼은 수정 중에 있습니다. *", this.zoomX(40), this.zoomY(1280))
    }
    
    
    drawNewBbox(context)
    {
        if(mouse.buttonL === true && currentClass !== null && this.drawBBoxReady)
        {

            if(currentBBox !== null)
            {
                if(currentBBox.resizing !== null)
                {
                    this.drawBBoxReady = false;
                    return;
                }
            }
            const width = (mouse.realX - mouse.startRealX)
            const height = (mouse.realY - mouse.startRealY)

            this.setBBoxStyles(context, true, 0)
            context.strokeRect(this.zoomX(mouse.startRealX), this.zoomY(mouse.startRealY), this.zoom(width), this.zoom(height))
            context.fillRect(this.zoomX(mouse.startRealX), this.zoomY(mouse.startRealY), this.zoom(width), this.zoom(height))
            
            
            this.drawX(context, mouse.startRealX, mouse.startRealY, width, height)

            this.setBBoxCoordinates(mouse.startRealX, mouse.startRealY, width, height)

        }
    }

    drawExistingBboxes(context)
    {
        const currentBboxes = bboxes[currentImage.name]

        for(let className in currentBboxes)
        {
            
            currentBboxes[className].forEach(bbox => 
            {
                context.lineWidth = 5;

                this.setFontStyles(context, bbox.marked, className);

                if(bbox.score  > 0)
                {
                    context.fillText(className + " - [" + bbox.score + "%]", this.zoomX(bbox.x), this.zoomY(bbox.y - 5));
                }
                else
                {
                    context.fillText(className, this.zoomX(bbox.x), this.zoomY(bbox.y - 5));
                }
                

                this.setBBoxStyles(context, bbox.marked, className);
                context.strokeRect(this.zoomX(bbox.x), this.zoomY(bbox.y), this.zoom(bbox.width), this.zoom(bbox.height));
                context.fillRect(this.zoomX(bbox.x), this.zoomY(bbox.y), this.zoom(bbox.width), this.zoom(bbox.height));


                this.drawX(context, bbox.x, bbox.y, bbox.width, bbox.height);

                if(bbox.marked === true)
                {
                    this.setBBoxCoordinates(bbox.x, bbox.y, bbox.width, bbox.height);
                }
            })
        }
    }

    drawX(context, x, y, width, height)
    {
        if(this.drawCenterX === true)
        {
            const centerX = x + width / 2;
            const centerY = y + height / 2;

            context.beginPath();
            context.moveTo(this.zoomX(centerX), this.zoomY(centerY - 10));
            context.lineTo(this.zoomX(centerX), this.zoomY(centerY + 10));
            context.stroke();

            context.beginPath();
            context.moveTo(this.zoomX(centerX - 10), this.zoomY(centerY));
            context.lineTo(this.zoomX(centerX + 10), this.zoomY(centerY));
            context.stroke();
        }
    }

    drawCross(context)
    {
        if(this.drawGuidelines === true)
        {
            context.lineWidth = 3;           
            context.strokeStyle = "#66ff31";
            context.setLineDash([5])

            context.beginPath()
            context.moveTo(this.zoomX(mouse.realX), this.zoomY(0))
            context.lineTo(this.zoomX(mouse.realX), this.zoomY(currentImage.height))
            context.stroke()

            context.beginPath()
            context.moveTo(this.zoomX(0), this.zoomY(mouse.realY))
            context.lineTo(this.zoomX(currentImage.width), this.zoomY(mouse.realY))
            context.stroke()

        }
    }
    

    canvasImageLoad()
    {
        document.getElementById("images").addEventListener("change", (event) =>
        {
            const imageList = document.getElementById("imageList")

            const files = event.target.files

            if(files.length > 0)
            {
                this.initImageList()

                // document.body.style.cursor = "Wait"

                for(let i = 0; i < files.length; i++)
                {
                    const nameParts = files[i].name.split(".")

                    if (extensions.indexOf(nameParts[nameParts.length - 1]) !== -1)
                    {
                        images[files[i].name] = {
                            meta : files[i],
                            index : i
                        }
                        
                        const option = document.createElement("option")
                        option.value = files[i].name
                        option.innerHTML = files[i].name

                        if(i === 0)
                        {
                            option.selected = true
                        }
                        imageList.appendChild(option)
                    }
                }

                const imageArray = Object.keys(images)

                let async = imageArray.length
                
                for(let image in images)
                {
                    const reader = new FileReader()

                    reader.addEventListener("load", () =>
                    {
                        const imgObj = new Image()

                        imgObj.addEventListener("load", (event) =>
                        {
                            images[image].width = event.target.width
                            images[image].height = event.target.height

                            if(--async === 0)
                            {
                                // document.body.cursor = "default"
                                this.setCurrentImage(images[imageArray[0]])
                                if (Object.keys(classes).length > 0)
                                {
                                    document.getElementById("file_load").disabled = false;
                                }
                            }
                        })
                        imgObj.src = reader.result
                    })
                    reader.readAsDataURL(images[image].meta)
                }
             }
        })
    }

    imageSelect()
    {
        const imageList = document.getElementById("imageList")

        imageList.addEventListener("change", () =>
        {
            this.imageListIdx = imageList.selectedIndex
            this.setCurrentImage(images[imageList.options[this.imageListIdx].innerHTML])
        })
    }

    setCurrentImage(curImg)
    {
        if(resetCanvasOnChange === true)
        {
            this.initCavnas()
        }

        if (fittedZoom === true)
        {
            this.fitZoom(curImg)
        }

        const reader = new FileReader()

        reader.addEventListener("load", () =>
        {
            const dataURL = reader.result
            const imgObj = new Image()
            imgObj.addEventListener("load", () =>
            {
                currentImage = {
                    name : curImg.meta.name,
                    object : imgObj,
                    width : curImg.width,
                    height : curImg.height
                }

                const is_Model_Load = document.getElementById("MD_Load").checked;

                if(is_Model_Load)
                {
                    const modules_model =  document.getElementById("model_sel").value.split(",");

                    if(typeof currentModel[currentImage.name] === "undefined")
                    {
                        currentModel[currentImage.name] = [];
                    }
                    if(typeof currentModel[currentImage.name][modules_model[1]] === "undefined")
                    {
                        currentModel[currentImage.name][modules_model[1]] = false;
                    }

                    if(currentModel[currentImage.name][modules_model[1]] === false)
                    {

                        var params = 
                        {
                            "method" : "detection",
                            "type" : modules_model[0],
                            'param': {
                                'model' : modules_model[1],
                                'encoded_image': currentImage.object.currentSrc.split(",")[1] //base64 인코딩 되어 있는
                            }
                        };
                        MODEL_POST_IO.sendPost(serverIP, params);
                    }
                }
            })
            imgObj.src = dataURL
            document.getElementById("imageInformation").innerHTML = 
                    `${Object.keys(images).length} Images, ${curImg.width}x${curImg.height}, ${formatBytes(curImg.meta.size)}`
        })
        reader.readAsDataURL(curImg.meta)
    }

    searchImage()
    {
        document.getElementById("imageSearch").addEventListener("input", (event) => 
        {
            const value = event.target.value

            for(let imageName in images)
            {
                if(imageName.indexOf(value) !== -1)
                {
                    document.getElementById("imageList").selected = images[imageName].index
                    this.setCurrentImage(images[imageName])
                    break
                }
            }
        })
    }
    

    mouseMotionEvent()
    {
        canvas.element.addEventListener("wheel", this.eventWheel, {passive: false})
        canvas.element.addEventListener("mousemove", this.eventPointer)
        canvas.element.addEventListener("mousedown", this.eventPointer)
        canvas.element.addEventListener("mouseup", this.eventPointer)
        canvas.element.addEventListener("mouseout", this.eventPointer)
    }    

    
    eventPointer = (event) =>
    {
        mouse.bounds = canvas.element.getBoundingClientRect();
        mouse.x = event.clientX - mouse.bounds.left;
        mouse.y = event.clientY - mouse.bounds.top;

        const xx = mouse.realX;
        const yy = mouse.realY;

        mouse.realX = this.zoomXInv(mouse.x);
        mouse.realY = this.zoomYInv(mouse.y);

        if (event.type === "mousedown")
        {
            mouse.startRealX = mouse.realX;
            mouse.startRealY = mouse.realY;

            if(currentBBox !== null)
            {
                const endX = currentBBox.bbox.x + currentBBox.bbox.width;
                const endY = currentBBox.bbox.y + currentBBox.bbox.height;
                if((mouse.startRealX < currentBBox.bbox.x || mouse.startRealX > endX) ||
                    (mouse.startRealY < currentBBox.bbox.y || mouse.startRealY > endY))
                {
                    if(currentBBox.moving === false)
                    {
                        this.drawBBoxReady = true;
                    }
                }
            }
            else
            {
                this.drawBBoxReady = true;
            }

            if(event.which === 3)
            {
                mouse.buttonR = true;
            }
            else if(event.which === 1)
            {
                mouse.buttonL = true;
            }
        }
        else if(event.type === "mouseup" || event.type === "mouseout")
        {
            if(mouse.buttonL === true  && currentImage !== null && currentClass !== null)
            {
                this.movedWidth = Math.max((mouse.startRealX - mouse.realX), (mouse.realX - mouse.startRealX));
                this.movedHeight = Math.max((mouse.startRealY - mouse.realY), (mouse.realY - mouse.startRealY));

                if(this.movedWidth > minBBoxWidth && this.movedHeight > minBBoxHeight)
                {
                    if(currentBBox === null)
                    {
                        this.notify_observers("registerBox");
                    }
                    else
                    {
                        const endX = currentBBox.bbox.x + currentBBox.bbox.width;
                        const endY = currentBBox.bbox.y + currentBBox.bbox.height;
                        if((mouse.startRealX < currentBBox.bbox.x || mouse.startRealX > endX) ||
                            (mouse.startRealY < currentBBox.bbox.y || mouse.startRealY > endY))
                        {
                            if(currentBBox.moving === false && currentBBox.resizing === null)
                            {
                                this.notify_observers("registerBox");
                            }
                            else
                            {
                                this.notify_observers("updateBox");
                            }          
                        }
                        else
                        {
                            this.notify_observers("updateBox");
                        }
                    }
                }
                else
                {
                    this.notify_observers("markedsetBox");
                    if(currentBBox !== null)
                    {
                        this.notify_observers("updateBox");
                    }
                }
            }
            this.drawBBoxReady = false;
            mouse.buttonL = false;
            mouse.buttonR = false;
        }
        this.notify_observers("moveBox");
        this.notify_observers("resizeBox");
        changeCursorByLocation();
        this.panImage(xx, yy);
    }

    eventWheel = (event) =>
    {
        if(Object.keys(classes).length > 0)
        {
            if(event.deltaY < 0)
            {
                this.notify_observers("classDown")
            }
            else
            {
                this.notify_observers("classUp")
            }
        }
        event.preventDefault()
    }

    eventKeyboard()
    {
        const imageList = document.getElementById("imageList")

        document.addEventListener("keydown", (event) => 
        {
            const key = event.keyCode || event.charCode
            if (key === 46 || (key === 8 && event.metaKey === true))
            {
                if(currentBBox !== null)
                {
                    bboxes[currentImage.name][currentBBox.bbox.class].splice(currentBBox.index, 1)
                    bndcnt[currentImage.name]--;
                    currentBBox = null
                    document.body.style.cursor ="default"
                }

                event.preventDefault()
            }
            

            if(key === 37)
            {
                this.prevImage(imageList)
                event.preventDefault()
            }

            if(key === 38)
            {
                this.scale = Math.min(this.maxZoom, this.scale * this.scrollSpeed)

                this.canvasX = mouse.realX
                this.canvasY = mouse.realY
                this.screenX = mouse.x
                this.screenY = mouse.y
        
                mouse.realX = this.zoomXInv(mouse.x)
                mouse.realY = this.zoomYInv(mouse.y)

            }

            if(key === 39)
            {
                this.nextImage(imageList)
                event.preventDefault()
            }

            if(key === 40)
            {
                this.scale = Math.max(this.minZoom,  this.scale * (1 / this.scrollSpeed))

                this.canvasX = mouse.realX
                this.canvasY = mouse.realY
                this.screenX = mouse.x
                this.screenY = mouse.y
        
                mouse.realX = this.zoomXInv(mouse.x)
                mouse.realY = this.zoomYInv(mouse.y)
                event.preventDefault()
            }

            if(key === 17)
            {
                if(currentImage !== null)
                {
                    this.fitZoom(currentImage)
                    event.preventDefault()
                }
            }
        })
    }
    
    zoomUI()
    {
        document.getElementById("zoom_out").addEventListener("click", () =>
        {
            this.scale = Math.max(this.minZoom,  this.scale * (1 / this.scrollSpeed))
        })

        document.getElementById("zoom_in").addEventListener("click", () =>
        {
            this.scale = Math.min(this.maxZoom, this.scale * this.scrollSpeed)
        })

        this.canvasX = mouse.realX
        this.canvasY = mouse.realY
        this.screenX = mouse.x
        this.screenY = mouse.y

        mouse.realX = this.zoomXInv(mouse.x)
        mouse.realY = this.zoomYInv(mouse.y)
    }

    nextImage()
    {
        const imageList = document.getElementById("imageList")
        if(imageList.length > 1)
        {
            if(currentBBox !== null) 
            {
                currentBBox.bbox.marked = false;
                currentBBox = null;
            }
            imageList.options[this.imageListIdx].selected= false;

            if(this.imageListIdx === imageList.length - 1)
            {
                this.imageListIdx = 0;
            }
            else
            {
                this.imageListIdx++;
            }
            imageList.options[this.imageListIdx].selected = true;
            imageList.selectedIndex = this.imageListIdx;
            
            this.setCurrentImage(images[imageList.options[this.imageListIdx].innerHTML]);
            document.body.style.cursor = "default";
        }
    }

    prevImage()
    {
        const imageList = document.getElementById("imageList")
        if(imageList.length > 1)
        {
            if(currentBBox !== null) 
            {
                currentBBox.bbox.marked = false;
                currentBBox = null;
            }

            imageList.options[this.imageListIdx].selected = false;

            if(this.imageListIdx === 0)
            {
                this.imageListIdx = imageList.length - 1;
            }
            else
            {
                this.imageListIdx--;
            }
            imageList.options[this.imageListIdx].selected = true;
            imageList.selectedIndex = this.imageListIdx;

            this.setCurrentImage(images[imageList.options[this.imageListIdx].innerHTML]);
            document.body.style.cursor = "default"
        }
    }

    setBBoxCoordinates (x, y, width, height)
    {
        const x2 = x + width
        const y2 = x + height

        document.getElementById("bboxInformation").innerHTML = `${bndcnt[currentImage.name]} Bboxs ,${width}x${height} (${x}, ${y}) (${x2}, ${y2})`
    }

    setBBoxStyles(context, marked, fontIndex)
    {
        context.setLineDash([])
        if (marked === false)
        {
            context.strokeStyle = borderColors[fontIndex];
            context.fillStyle = this.backgroundColor
        }
        else
        {
            context.strokeStyle = this.markedBorderColor
            context.fillStyle = this.markedBackgroundColor
        }
    }

    
    setFontStyles(context, marked, fontIndex)
    { 
        if(marked === false)
        {
            context.fillStyle = fontColors[fontIndex]
        }
        else
        {
            context.fillStyle = this.markedFontColor
        }
        
        context.font = "bold 20px '맑은 고딕'"
        context.font = context.font.replace(/\d+px/, `${this.zoom(this.fontBaseSize)}px`)
    }


    panImage(xx, yy)
    {
        if(mouse.buttonR === true)
        {
            this.canvasX -= mouse.realX - xx
            this.canvasY -= mouse.realY - yy

            mouse.realX = this.zoomXInv(mouse.x)
            mouse.realY = this.zoomYInv(mouse.y)
        }
        
    }

    zoom(_num,)
    {
        return Math.floor(_num * this.scale)
    }
    
    zoomX(_num)
    {
        return Math.floor((_num - this.canvasX) * this.scale + this.screenX)
    }

    zoomY(_num)
    {
        return Math.floor((_num - this.canvasY) * this.scale + this.screenY)
    }

    zoomXInv(_num)
    {
        return Math.floor((_num - this.screenX) * (1 / this.scale) + this.canvasX)
    }

    zoomYInv(_num)
    {
        return Math.floor((_num - this.screenY) * (1 / this.scale) + this.canvasY)
    }

    fitZoom(image)
    {
        if(image.width > image.height)
        {
            this.scale = canvas.width / image.width;
        }
        else
        {
            this.scale = canvas.height / image.height;
        }
    }

    imageMovementUI()
    {
        document.getElementById("prev_img").addEventListener("click", () => 
        {
            this.prevImage();
        })

        document.getElementById("next_img").addEventListener("click", ()=>
        {
            this.nextImage();
        })
    }
    


    initImageList()
    {
        const imageList = document.getElementById("imageList")
        imageList.innerHTML = ""
        images = {}
        bboxes = {}
        currentImage = null
    }

    initCavnas()
    {
        this.scale = this.defaultScale
        this.canvasX = 0
        this.canvasY = 0
        
        this.screenX = 0 
        this.screenY = 0

        mouse.x = 0
        mouse.y = 0
        mouse.nowX = 0
        mouse.nowY = 0
        mouse.oldX = 0
        mouse.oldY = 0
        
        mouse.buttonL = false
        mouse.buttonR = false

    }


}