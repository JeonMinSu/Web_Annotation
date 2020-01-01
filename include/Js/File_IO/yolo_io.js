class YOLO_IO
{
    constructor()
    {
        this.image = null
        this.bbox = null
    }

    static saveYOLO()
    {
        const zip = new JSZip()

        for(let imageName in bboxes)
        {
            this.image = images[imageName]
            const name = imageName.split(".")

            name[name.length - 1] = "txt"

            const result = []

            for(let className in bboxes[imageName])
            {
                for(let i = 0; i < bboxes[imageName][className].length; i ++)
                {
                    this.bbox = bboxes[imageName][className][i]

                    const x = (this.bbox.x + this.bbox.width / 2) / this.image.width
                    const y = (this.bbox.y + this.bbox.height / 2) / this.image.height

                    const width = (this.bbox.width) / this.image.width
                    const height = (this.bbox.height) / this.image.height

                    result.push(`${classes[className]} ${x} ${y} ${width} ${height}`)
                }
            }
            zip.file(name.join("."), result.join("\n"))
        }
        zip.generateAsync({type: "blob"}).then((blob) => 
        {
            saveAs(blob, "Yolo.zip")
        })
    }

    static bboxLoad_YOLO(files)
    {
        if(files.length > 0)
        {
            bboxes = {}
            bndcnt = {}
            for (let i = 0; i < files.length; i++)
            {
                const reader = new FileReader()

                const extension = files[i].name.split(".").pop()

                reader.addEventListener("load", () => 
                {
                    if(extension === "txt")
                    {
                        this.parseYoloFormat(files[i].name, reader.result)
                    }
                    else if(extension === "zip")
                    {
                        const zip = new JSZip()
                        zip.loadAsync(reader.result).then((result) =>
                        {
                            for(let filename in result.files)
                            {
                                result.file(filename).async("string").then((text =>
                                { 
                                    this.parseYoloFormat(filename, text)
                                }))
                            }                                
                        })
                    }
                    else
                    {
                        alert("Invalid extension")
                        return;
                    }
                })

                if(extension === "txt")
                {
                    reader.readAsText(files[i])
                }
                else
                {
                    reader.readAsArrayBuffer(event.target.files[i])
                }
            }
        }
    }

    static parseYoloFormat(filename, text)
    {
        const imgExtension = filename.split(".").pop()
        for(let i=0; i < extensions.length; i++)
        {
            const imageName = filename.replace(`.${imgExtension}`, `.${extensions[i]}`)
            if(typeof images[imageName] !== "undefined")
            {
                this.image = images[imageName]
                if(typeof bboxes[imageName] === "undefined")
                {
                    bboxes[imageName] = {}
                }
                if(typeof bndcnt[imageName] === "undefined")
                {
                    bndcnt[imageName] = 0
                }
                this.bbox = bboxes[imageName]
                this.yoloLineToShape(imageName, text)
            }
        }        
    }


    static yoloLineToShape(imageName, text)
    {
        const rows = text.split(/[\r\n]+/)

        for(let i = 0; i < rows.length; i++)
        {
            const cols = rows[i].split(" ")
            cols[0] = parseInt(cols[0])
        
            for (let className in classes)
            {
                if(classes[className] === cols[0])
                {
                    if(typeof this.bbox[className] === "undefined")
                    {
                        this.bbox[className] = []
                    }
        
                    const width = cols[3] * this.image.width
                    
                    const x = cols[1] *  this.image.width - width * 0.5
        
                    const height = cols[4] *  this.image.height
                    const y = cols[2] * this.image.height - height * 0.5
        
                    this.bbox[className].push({
                        x : Math.floor(x),
                        y : Math.floor(y),
                        width : Math.floor(width),
                        height : Math.floor(height),
                        marked : false,
                        class : className,
                        score : 0
                    })
                    bndcnt[imageName]++;
                    break
                }
            }
        }
    }
}