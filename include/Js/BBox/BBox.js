class BBox extends Observer
{
    constructor(observable)
    {
        super(observable)
    }

    notify(observable, ...args)
    {   
        [...args].forEach((arg) =>
        {
            this.notifyFn(observable, arg)
        })
    }

    notifyFn(observable, arg)
    {
        if(arg === "registerBox")
            this.registerNewBbox(observable.movedWidth, observable.movedHeight)    
        else if(arg === "updateBox")
            this.updateBboxAfterTransform()
        else if(arg === "markedsetBox")
            this.setBboxMarkedState()
        else if(arg === "moveBox")
            this.moveBbox()
        else if(arg === "resizeBox")
            this.resizeBbox()
    }

    setBboxMarkedState()
    {
        if(currentBBox === null || (currentBBox.moving === false && currentBBox.resizing === null))
        {
            const currentBBoxes = bboxes[currentImage.name]

            let wasInside = false
            let smallesBbox = Number.MAX_SAFE_INTEGER

            for (let className in currentBBoxes)
            {
                for(let  i = 0; i < currentBBoxes[className].length; i++)
                {
                    const bbox = currentBBoxes[className][i]

                    bbox.marked = false

                    const endX = bbox.x + bbox.width
                    const endY = bbox.y + bbox.height
                    const size = bbox.width *  bbox.height

                    if(mouse.startRealX >= bbox.x && mouse.startRealX <= endX 
                        && mouse.startRealY >= bbox.y && mouse.startRealY <= endY)
                    {
                        wasInside = true
                        if(size < smallesBbox)
                        {
                            smallesBbox = size
                            currentBBox = {
                                bbox : bbox,
                                index : i,
                                originalX : bbox.x,
                                originalY : bbox.y,
                                originalWidth : bbox.width, 
                                originalHeight : bbox.height,
                                moving : false,
                                resizing : null
                            }
                        }
                    }
                }
            }
            if(wasInside === false)
            {
                currentBBox = null 
            }
        }
    }

    registerNewBbox (movedWidth, movedHeight)
    {
        if(currentBBox !== null)
        {
            currentBBox.bbox.marked = false;
            currentBBox = null;
        }

        const bbox = {
            x : Math.min(mouse.startRealX, mouse.realX),
            y : Math.min(mouse.startRealY, mouse.realY),
            width : movedWidth,
            height : movedHeight,
            marked : true,
            class : currentClass,
            score : 0
        };

        if(typeof bboxes[currentImage.name] === "undefined")
        {
            bboxes[currentImage.name] = {};
        }
        
        if(typeof bboxes[currentImage.name][currentClass] === "undefined")
        {
            bboxes[currentImage.name][currentClass] = [];
        }

        if(typeof bndcnt[currentImage.name] === "undefined")
        {
            bndcnt[currentImage.name] = 0
        }
        
        bboxes[currentImage.name][currentClass].push(bbox)
        bndcnt[currentImage.name]++;

        currentBBox = {
            bbox : bbox,
            index : bboxes[currentImage.name][currentClass].length - 1,
            originalX : bbox.x,
            originalY : bbox.y,
            originalWidth : bbox.width,
            originalHeight : bbox.height,
            moving : false,
            resizing : null
        }

    }

    
    updateBboxAfterTransform() 
    {
        if (currentBBox.resizing !== null)
        {
            if (currentBBox.bbox.width < 0) {
                currentBBox.bbox.width = Math.abs(currentBBox.bbox.width)
                currentBBox.bbox.x -= currentBBox.bbox.width
            }

            if (currentBBox.bbox.height < 0) {
                currentBBox.bbox.height = Math.abs(currentBBox.bbox.height)
                currentBBox.bbox.y -= currentBBox.bbox.height
            }

            currentBBox.resizing = null
        }

        currentBBox.bbox.marked = true
        currentBBox.originalX = currentBBox.bbox.x
        currentBBox.originalY = currentBBox.bbox.y
        currentBBox.originalWidth = currentBBox.bbox.width
        currentBBox.originalHeight = currentBBox.bbox.height
        currentBBox.moving = false

    }

    moveBbox ()
    {
        if(mouse.buttonL === true && currentBBox !== null)
        {
            const endX = currentBBox.bbox.x + currentBBox.bbox.width
            const endY = currentBBox.bbox.y + currentBBox.bbox.height

            if(mouse.startRealX >= (currentBBox.bbox.x + edgeSize) && mouse.startRealX <= (endX - edgeSize)
                && mouse.startRealY >= (currentBBox.bbox.y + edgeSize) && mouse.startRealY <= (endY - edgeSize))
            {
                currentBBox.moving = true
            }
            if(currentBBox.moving === true)
            {
                currentBBox.bbox.x = currentBBox.originalX + (mouse.realX - mouse.startRealX)
                currentBBox.bbox.y = currentBBox.originalY + (mouse.realY - mouse.startRealY)
            }
        }
    }

    resizeBbox()
    {
        if(mouse.buttonL === true && currentBBox !== null)
        {
            const topLeftX = currentBBox.bbox.x
            const topLeftY = currentBBox.bbox.y

            const bottomLeftX = currentBBox.bbox.x
            const bottomLeftY = currentBBox.bbox.y + currentBBox.bbox.height

            const topRightX = currentBBox.bbox.x + currentBBox.bbox.width
            const topRightY = currentBBox.bbox.y

            const bottomRightX = currentBBox.bbox.x + currentBBox.bbox.width
            const bottomRightY = currentBBox.bbox.y + currentBBox.bbox.height

            if (mouse.startRealX >= (topLeftX - edgeSize) && mouse.startRealX <= (topLeftX + edgeSize)
                && mouse.startRealY >= (topLeftY - edgeSize) && mouse.startRealY <= (topLeftY + edgeSize))
            {
                currentBBox.resizing = "topLeft"
            }
            else if (mouse.startRealX >= (bottomLeftX - edgeSize) && mouse.startRealX <= (bottomLeftX + edgeSize)
                && mouse.startRealY >= (bottomLeftY - edgeSize) && mouse.startRealY <= (bottomLeftY + edgeSize))
            {
                currentBBox.resizing = "bottomLeft"
            } 
            else if (mouse.startRealX >= (topRightX - edgeSize) && mouse.startRealX <= (topRightX + edgeSize)
                && mouse.startRealY >= (topRightY - edgeSize) && mouse.startRealY <= (topRightY + edgeSize))
            {
                currentBBox.resizing = "topRight"
            } 
            else if (mouse.startRealX >= (bottomRightX - edgeSize) && mouse.startRealX <= (bottomRightX + edgeSize)
                && mouse.startRealY >= (bottomRightY - edgeSize) && mouse.startRealY <= (bottomRightY + edgeSize))
            {
                 currentBBox.resizing = "bottomRight"
            }


            if(currentBBox.resizing === "topLeft")
            {
                currentBBox.bbox.x = mouse.realX
                currentBBox.bbox.y = mouse.realY

                currentBBox.bbox.width = currentBBox.originalX + currentBBox.originalWidth - mouse.realX
                currentBBox.bbox.height = currentBBox.originalY + currentBBox.originalHeight - mouse.realY
            }

            else if(currentBBox.resizing === "bottomLeft")
            {
                currentBBox.bbox.x = mouse.realX
                currentBBox.bbox.y = mouse.realY - (mouse.realY - currentBBox.originalY)
                currentBBox.bbox.width = currentBBox.originalX + currentBBox.originalWidth - mouse.realX
                currentBBox.bbox.height = mouse.realY - currentBBox.originalY
            }
            else if(currentBBox.resizing === "topRight")
            {               

                currentBBox.bbox.x = mouse.realX - (mouse.realX - currentBBox.originalX)
                currentBBox.bbox.y = mouse.realY
                
                currentBBox.bbox.width =  mouse.realX - currentBBox.originalX
                currentBBox.bbox.height = currentBBox.originalY + currentBBox.originalHeight - mouse.realY
            }

            else if(currentBBox.resizing === "bottomRight")
            {

                
                currentBBox.bbox.x = mouse.realX - (mouse.realX - currentBBox.originalX)
                currentBBox.bbox.y = mouse.realY - (mouse.realY - currentBBox.originalY)

                currentBBox.bbox.width = mouse.realX - currentBBox.originalX
                currentBBox.bbox.height = mouse.realY - currentBBox.originalY
            }
        }
    }

}