let currentLyrics, currentId;

const _onProcessLyrics = window.onProcessLyrics ?? ((x) => x);
window.onProcessLyrics = async (lyrics, id) => {
    let newLyrics = lyrics;
    try{
        //获得该歌曲的THB信息
        let lInfo = await httpGet(`https://thb.liyuu.plus/netease/detail/${id}/thb`,"json");
        if(lInfo && lInfo.code == 200)
        {
            let data = lInfo.data;
            //存入window待使用
            window.thbInfo = data;
            let lyricData = data.lyricInfo;
            if(lyricData)
            {
                let lyricInfo = await httpGet(lyricData.lyricUrl);
                lyricInfo += "[999:999:999]本歌词来自THBWiki";
                let tlyricInfo = await httpGet(lyricData.transLyricUrl);
                tlyricInfo += "[999:999:999]lyrics.thwiki.cc";
                if(lyricInfo)
                {
                    newLyrics = { status: 200, lrc: { lyric: lyricInfo, version: 1 }, tlyric: { lyric: tlyricInfo, version: 1 } };
                }
            }
        }
        else{
            window.thbInfo = null;
        }
    }
    catch{
        newLyrics = lyrics;
    }
    return _onProcessLyrics(newLyrics);
}

const httpGet = (url,retType = 'text') =>{
    let error = {
        status:503,
        trace:null
    };
    return new Promise(async (resolve,reject)=>{
        let result = await fetch(url).then(async(res)=>{
            if(res.status == 200)
            {
                switch(retType)
                {
                    case "json":{
                        let rJson = await res.json();
                        return resolve(rJson);
                    }break;
                    default:{
                        let rText = await res.text();
                        return resolve(rText);
                    }
                }
            }
            else
            {
                error.status == res.status;
                return reject(error);
            }
        }).catch(err=>{
            error.trace = err;
            return reject(error);
        })
    });
}