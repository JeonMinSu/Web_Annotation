/**
 * 스크립트 기반 POST 전송
 * @param action - URL
 * @param params - JSON
 * @returns
 */
class MODEL_POST_IO
{
    constructor()
    {
    }

    static sendPost(action, params) 
    {    
        $.ajax({
            url: action,
            type: 'POST',
            headers: { 
                'Content-Type': 'application/json'
             },
            datatype: 'json',
            data : JSON.stringify(params),
            traditional : true,

            success:function(data)
            {   
                const JsonDatas = JSON.parse(data);
                const parseScores = JsonDatas['param']['value']['scores'];
                
                if(typeof bboxes[currentImage.name] === "undefined")
                {
                    bboxes[currentImage.name] = {}
                }
                if(typeof bndcnt[currentImage.name] === "undefined")
                {
                    bndcnt[currentImage.name] = 0
                }
                let score = 0

                for(let i = 0; i < parseScores.length; i ++)
                {
                    if(parseScores[i] > limitBboxScore)
                    {
                        let parseBbox = JsonDatas['param']['value']['boxes'][i];
                        const className = String(JsonDatas['param']['value']['classes'][i])

                        let score = 0;

                        if(parseScores[i] > 0.75)
                        {
                            const width = (parseBbox[3] - parseBbox[1]) * currentImage.width;
                            const height = (parseBbox[2] - parseBbox[0]) * currentImage.height;
     
                            const x = parseBbox[1] * currentImage.width;
                            const y = parseBbox[0] * currentImage.height;            
     

                            if(typeof bboxes[currentImage.name][className] === "undefined")
                            {
                                bboxes[currentImage.name][className] = [];
                            }
                            
                            score = Math.floor(parseScores[i] * 100)

                            const bbox = {
                                x : Math.floor(x),
                                y : Math.floor(y),
                                width : Math.floor(width),
                                height : Math.floor(height),
                                marked : false,
                                class : className,
                                score : score
                            };

                            console.log(bbox);

                            if(currentBBox !== null)
                            {
                                currentBBox.bbox.marked = false;
                                currentBBox = null
                            }
    
                            bboxes[currentImage.name][className].push(bbox);
                            bndcnt[currentImage.name]++;
                        
                        }
                        
                    }
                }
                const model = params['param']['model']
                currentModel[currentImage.name][model] = true;
            },    
            error:function(request, error)
            {
                const model = params['param']['model']
                currentModel[currentImage.name][model] = false;
                console.log(params)
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });

    }
    
}
