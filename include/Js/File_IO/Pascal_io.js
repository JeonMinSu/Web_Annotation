class Pascal_IO
{
    constructor()
    {
        this.image = null
        this.bbox = null
    }
   
    static saveXML()
    {
        const zip = new JSZip()

        for (let imageName in bboxes)
        {
            this.image = images[imageName]
            const xmlName = imageName.split(".")

            xmlName[xmlName.length - 1] = "xml"

            const result = [
                "<?xml version=\"1.0\"?>",
                "<annotation>",
                `<folder>${imageName}</folder>`,
                `<filename>${imageName}</filename>`,
                "<path/>",
                "<source>",
                "<database>Unknown</database>",
                "</source>",
                "<size>",
                `<width>${this.image.width}</width>`,
                `<height>${this.image.height}</height>`,
                "<depth>3</depth>",
                "</size>",
                `<segmented>${bndcnt[imageName]}</segmented>`
            ]
            for (let className in bboxes[imageName]) {
                for (let i = 0; i < bboxes[imageName][className].length; i++) {
                    this.bbox = bboxes[imageName][className][i]

                    result.push("<object>")
                    result.push(`<name>${className}</name>`)
                    result.push("<pose>Unspecified</pose>")
                    result.push("<truncated>0</truncated>")
                    result.push("<occluded>0</occluded>")
                    result.push("<difficult>0</difficult>")

                    result.push("<bndbox>")
                    result.push(`<xmin>${this.bbox.x}</xmin>`)
                    result.push(`<ymin>${this.bbox.y}</ymin>`)
                    result.push(`<xmax>${this.bbox.x + this.bbox.width}</xmax>`)
                    result.push(`<ymax>${this.bbox.y + this.bbox.height}</ymax>`)
                    result.push("</bndbox>")

                    result.push("</object>")
                }
            }
            result.push("</annotation>")

            if (result.length > 15) { zip.file(xmlName.join("."), result.join("\n")) }
        }
        zip.generateAsync({type: "blob"}).then((blob) => { saveAs(blob, "Pascal_VOC.zip") })
    }

    static bboxLoad_VOC(files)
    {

        if(files.length > 0)
        {
            bboxes = {}
            bndcnt = {}
            for (let i = 0; i < files.length; i ++)
            {
                const reader = new FileReader()

                const extension = files[i].name.split(".").pop()
                
                reader.addEventListener("load", () => 
                {
                    if(extension === "xml")
                    {
                        this.parseVOCFormat(filename, reader.result)
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
                                    this.parseVOCFormat(filename, text)
                                }))
                            }                                
                        })
                    }
                })

                if(extension === "xml")
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

    static parseVOCFormat(filename, text)
    {
        const imgExtension = filename.split(".").pop()
        for (let i = 0; i < imgExtension.length; i++)
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
                this.XMLLineToShape(imageName, text)
            }
        }
 
    }

    static XMLLineToShape(imageName, text)
    {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        const objects = xmlDoc.getElementsByTagName("object")
        
        bndcnt[imageName] = xmlDoc.getElementsByTagName("segmented")[0].childNodes[0].nodeValue

        for(let  i = 0; i < objects.length; i++)
        {
            const objectName = objects[i].getElementsByTagName("name")[0].childNodes[0].nodeValue

            for (let className in classes)
            {
                if(className === objectName)
                {
                    if(typeof this.bbox[className] === "undefined")
                    {
                        this.bbox[className] = []
                    }

                    const bndBox = objects[i].getElementsByTagName("bndbox")[0]

                    const bndBoxX = bndBox.getElementsByTagName("xmin")[0].childNodes[0].nodeValue
                    const bndBoxY = bndBox.getElementsByTagName("ymin")[0].childNodes[0].nodeValue
                    const bndBoxMaxX = bndBox.getElementsByTagName("xmax")[0].childNodes[0].nodeValue
                    const bndBoxMaxY = bndBox.getElementsByTagName("ymax")[0].childNodes[0].nodeValue
                    
                    
                    this.bbox[className].push({
                        x: parseInt(bndBoxX),
                        y: parseInt(bndBoxY),
                        width: parseInt(bndBoxMaxX) - parseInt(bndBoxX),
                        height: parseInt(bndBoxMaxY) - parseInt(bndBoxY),
                        marked: false,
                        class: className,
                        score : 0
                    })
                    break
                }
            }
        }
    }
}