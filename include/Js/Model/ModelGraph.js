class ModelGraph
{
    constructor()
    {
    }

    modelGraphLoad()
    {
        document.getElementById("MD_Load").addEventListener("click", ()=>
        {
            let graph = document.getElementById("graph");

            let bbox = document.getElementById("annotaion_ui");
            let model_list = document.getElementById("model_list");
            let image_list = document.getElementById("imageForm");
            let class_list = document.getElementById("classesForm");

            if(bbox.style.display === 'none')
            {                
                bbox.style.display = 'block';
                graph.style.display = 'none';

                model_list.style.cssText = 'margin-top:calc(44% * 3); transition:1s'
                image_list.style.cssText = 'margin-bottom:calc(14% * 2); transition:1s'
                class_list.style.cssText = 'margin-bottom:calc(14% * 2); transition:1s'
            }
            else
            {
                bbox.style.display = 'none';
                graph.style.display = 'block';
                model_list.style.cssText = 'margin-top:calc(5% * 3); transition:1s'
                image_list.style.cssText = 'margin-bottom:calc(4% * 2); transition:1s'
                class_list.style.cssText = 'margin-bottom:calc(4% * 2); transition:1s'
            }
        })
    }

    currentBboxesScoreBar()
    {
        if(graphON)
        {
            if(currentImage !== null)
            {
                const currentBboxes = bboxes[currentImage.name];
                if(typeof currentBboxes === 'undefined') 
                {
                    this.resetModelGraphScoreBar();
                    return;
                }

                for(let className in classes)
                {
                    let score = 0;
                    
                    if(typeof currentBboxes[className] !== 'undefined')
                    {
                        currentBboxes[className].forEach(bbox =>
                        {
                            score = bbox.score;
                        });
                    }
                    this.updateModelGraphScoreBar(className, score);
                }
            }
        }
    }

    drawModelGraph()
    {
        if(!graphON)
        {
            const g_cols = document.getElementById("g_cols");

            this.resetModelGraph()
            let score = 0;

            for(let className in classes)
            {
                let rows = document.createElement("li");
                rows.className="rows"

                let g_item = document.createElement("span");
                g_item.className="g_item";
                g_item.innerHTML = className;

                let g_bar = document.createElement("span");
                g_bar.className="g_bar";
                g_bar.id = className;
                g_bar.style.cssText = `width:calc(${score / 2}% * 2); transition:${2}s`

                let s_bar = document.createElement("span");
                s_bar.className = className;
                s_bar.innerHTML = `${score}%`;

                g_bar.appendChild(s_bar);

                rows.appendChild(g_item);  
                rows.appendChild(g_bar);                  
                
                g_cols.appendChild(rows);
            }
            graphON = true;
        }
    }

    resetModelGraphScoreBar()
    {
        for(let className in classes)
        {
            this.updateModelGraphScoreBar(className, 0);
        }
    }
    
    updateModelGraphScoreBar(className, score)
    {
        let g_bar = document.getElementById(className)
        if(g_bar)
        {
            g_bar.style.cssText = `width:calc(${score / 2}% * 2); 
            background-color:${borderColors[className]}; transition:${2}s; ` 
            let s_bar = g_bar.firstChild
            s_bar.innerHTML = `${score}%`;   
        }
    }

    resetModelGraph()
    {
        const g_cols = document.getElementById("g_cols");
        while(g_cols.hasChildNodes())
        {
            g_cols.removeChild(g_cols.firstChild);
        }
        graphON = false;
    }

}