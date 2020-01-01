class FILE_IO
{
    constructor()
    {

    }

    static saveFile()
    {   
        document.getElementById("save").addEventListener("click", () =>
        {
            const formats = document.getElementsByName("format")
            for(let i = 0; i < formats.length; i++)
            {
                if(formats[i].checked === true)
                {
                    if(formats[i].value === "YOLO")
                    {
                        YOLO_IO.saveYOLO();
                        return ;
                    }
                    else if(formats[i].value === "VOC")
                    {
                        Pascal_IO.saveXML();
                        return ;
                    }
                    YOLO_IO.saveYOLO();
                    Pascal_IO.saveXML();
                }
            } 
        })
    }

    static bboxFile_Load()
    {   
        const bboxesElement = document.getElementById("file_load")
        const formats = document.getElementsByName("format")
        

        bboxesElement.addEventListener("click", () => 
        {
            for(let i = 0; i < formats.length; i++)
            {
                if(formats[i].checked === true)
                {
                    if(formats[i].value === "ALL")
                    {
                        return;
                    }
                }
            }
            bboxesElement.value = null
        })

        bboxesElement.addEventListener("change", (event) =>
        {
            const files = event.target.files
            for(let i = 0; i < formats.length; i++)
            {
                if(formats[i].checked === true)
                {
                    if(formats[i].value === "YOLO")
                    {
                        YOLO_IO.bboxLoad_YOLO(files);
                        return ;
                    }
                    else if(formats[i].value === "VOC")
                    {
                        Pascal_IO.bboxLoad_VOC(files);
                        return ;
                    }
                }
            } 
        })
    }
}