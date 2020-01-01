class Classes extends Observer
{

    constructor(observable)
    {
        super(observable);
        let classListIdx = 0;
    }
    
    notify(observable, ...args)
    {   
        [...args].forEach((arg) =>
        {
            this.notifyFn(observable, arg);
        })
    }

    notifyFn(observable, arg)
    {
        if(arg === "classUp")
        {
            this.mouseWheelUpChangeClass()
        }
        else if(arg === "classDown")
        {
            this.mouseWheelDownChangeClass()
        }
    }

    classesLoad()
    {
        const classesElement = document.getElementById("classes")
        classesElement.addEventListener("click", () =>
        {
            classesElement.value = null
        })

        classesElement.addEventListener("change", (event)=>
        {
            const files = event.target.files


            if(files.length > 0)
            {
                    
                if(currentBBox !== null)
                {
                    currentBBox.bbox.marked = false;
                    currentBBox = null;
                }

                this.resetClassList()
                const nameParts = files[0].name.split(".")
            
                if(nameParts[nameParts.length - 1] === "txt")
                {
                    const reader = new FileReader()

                    reader.addEventListener("load", () =>
                    {
                        const lines = reader.result
                        const rows = lines.split(/[\r\n]+/) 

                        if(rows.length > 0)
                        {
                            const classList = document.getElementById("classList")

                            for(let i = 0; i < rows.length; i++)
                            {
                                rows[i] = rows[i].trim()

                                if(rows[i] !== "")
                                {
                                    if(colors.length - 1 > i)
                                    {
                                        fontColors[rows[i]] = colors[i]
                                        borderColors[rows[i]] = colors[i]
                                    }
                                    else
                                    {
                                        fontColors[rows[i]] = colors[colors.length-1]
                                        borderColors[rows[i]] = colors[colors.length-1]
                                    }

                                    classes[rows[i]] = i
                                    const option = document.createElement("option")
                                    option.value = i
                                    option.innerHTML = rows[i]

                                    if(i == 0)
                                    {
                                        option.selected = true
                                        currentClass = rows[i]
                                    }
                                    classList.appendChild(option)
                                }
                            }

                            this.changeClasses()
                                            
                            if(Object.keys(images).length > 0)
                            {
                                document.getElementById("file_load").disabled = false
                            }
                        }
                    })
                    reader.readAsText(files[0])
                }
            }        
        })
    }

    classesSelect()
    {
        const classList = document.getElementById("classList")
        const defualtClass = document.getElementById("defualt_class")

        classList.addEventListener("change", () =>
        {
            this.changeClasses()
        })

        defualtClass.addEventListener("input", () =>
        {
            this.changeClasses()
        })
    }

    changeClasses()
    {
       const classList = document.getElementById("classList")
       const defualtClass = document.getElementById("defualt_class")

       if(defualtClass.value !== "")
        {
            for(let i = 0; i < classList.options.length; i++)
            {
                if(classList.options[i].text === defualtClass.value)
                {
                    currentClass = classList.options[i].text
                    this.classListIdx = i;
                    return;
                }
            }
        }

        if(classList.options.length > 0)
        {
            this.classListIdx = classList.selectedIndex
            currentClass = classList.options[classList.selectedIndex].text
            this.updateBboxAfterClass()
        }
    }
    
    mouseWheelUpChangeClass()
    {
        const classList = document.getElementById("classList")
        if (classList.length > 1)
        {
            classList.options[this.classListIdx].selected = false;
            if(this.classListIdx === classList.length - 1)
            {
                this.classListIdx = 0;
            }
            else
            {
                this.classListIdx++;
            }
            classList.options[this.classListIdx].selected = true;
            classList.selectedIndex = this.classListIdx;            
            this.changeClasses()
        }
    }

    mouseWheelDownChangeClass()
    {
        const classList = document.getElementById("classList")
        if (classList.length > 1)
        {
            classList.options[this.classListIdx].selected = false;
            if(this.classListIdx === 0)
            {
                this.classListIdx = classList.length - 1;
            }
            else
            {
                this.classListIdx--;
            }
            classList.options[this.classListIdx].selected = true;
            classList.selectedIndex = this.classListIdx;            
            this.changeClasses()
        }

    }

    updateBboxAfterClass()
    {
        if(currentBBox !== null)
        {
            const prevClass = currentBBox.bbox.class;

            if(typeof bboxes[currentImage.name][currentClass] === "undefined")
            {
                bboxes[currentImage.name][currentClass] = []
            }
            
            currentBBox.bbox.class = currentClass;
            bboxes[currentImage.name][prevClass].splice(currentBBox.index, 1);
            bboxes[currentImage.name][currentClass].push(currentBBox.bbox)
            currentBBox.index = bboxes[currentImage.name][currentClass].length - 1;
        }
    }

    resetClassList()
    {
        document.getElementById("classList").innerHTML = "";
        classes = {};
        fontColors = {};
        currentClass = null;
        graphON = false;
    }

}