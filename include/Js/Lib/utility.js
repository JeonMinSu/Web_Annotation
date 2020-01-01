function formatBytes(bytes, decimals)
{
    if(bytes === 0)
    {
        return "0 Bytes"
    }
    const k = 1024
    const dm = decimals || 2
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]

}

function changeCursorByLocation()
{
    if(currentImage !== null)
    {
        const currentBboxes = bboxes[currentImage.name]

        for(let className in currentBboxes)
        {
            for(let i = 0; i < currentBboxes[className].length; i++)
            {
                const bbox = currentBboxes[className][i]

                const endX = bbox.x + bbox.width
                const endY = bbox.y + bbox.height

                if (mouse.realX >= (bbox.x + edgeSize) && mouse.realX <= (endX - edgeSize)
                    && mouse.realY >= (bbox.y + edgeSize) && mouse.realY <= (endY - edgeSize)) 
                {
                    document.body.style.cursor = "pointer"
                    break
                } 
                else
                {
                    document.body.style.cursor = "default"
                }
            }
        }

        if(currentBBox !== null)
        {
            const topLeftX = currentBBox.bbox.x
            const topLeftY = currentBBox.bbox.y
            const bottomLeftX = currentBBox.bbox.x
            const bottomLeftY = currentBBox.bbox.y + currentBBox.bbox.height
            const topRightX = currentBBox.bbox.x + currentBBox.bbox.width
            const topRightY = currentBBox.bbox.y
            const bottomRightX = currentBBox.bbox.x + currentBBox.bbox.width
            const bottomRightY = currentBBox.bbox.y + currentBBox.bbox.height

            if (mouse.realX >= (topLeftX + edgeSize) && mouse.realX <= (bottomRightX - edgeSize)
                && mouse.realY >= (topLeftY + edgeSize) && mouse.realY <= (bottomRightY - edgeSize)) {

                document.body.style.cursor = "move"
            } else if (mouse.realX >= (topLeftX - edgeSize) && mouse.realX <= (topLeftX + edgeSize)
                && mouse.realY >= (topLeftY - edgeSize) && mouse.realY <= (topLeftY + edgeSize)) {
                document.body.style.cursor = "nwse-resize"

            } else if (mouse.realX >= (bottomLeftX - edgeSize) && mouse.realX <= (bottomLeftX + edgeSize)
                && mouse.realY >= (bottomLeftY - edgeSize) && mouse.realY <= (bottomLeftY + edgeSize)) {

                document.body.style.cursor = "nesw-resize"
            } else if (mouse.realX >= (topRightX - edgeSize) && mouse.realX <= (topRightX + edgeSize)
                && mouse.realY >= (topRightY - edgeSize) && mouse.realY <= (topRightY + edgeSize)) {

                document.body.style.cursor = "nesw-resize"
            } else if (mouse.realX >= (bottomRightX - edgeSize) && mouse.realX <= (bottomRightX + edgeSize)
                && mouse.realY >= (bottomRightY - edgeSize) && mouse.realY <= (bottomRightY + edgeSize)) {

                document.body.style.cursor = "nwse-resize"
            }
        }
    }
}
