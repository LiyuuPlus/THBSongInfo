let currentLyrics, currentId;

const _onProcessLyrics = window.onProcessLyrics ?? ((x) => x);
window.onProcessLyrics = async (lyrics, id) => {
    let newLyrics = lyrics;
    try{
        //获得该歌曲的THB信息
        let lRes = await fetch(`https://thb.liyuu.plus/netease/detail/${id}/thb`);
        let lInfo = await lRes.json();
        if(lInfo.code == 200)
        {
            let data = lInfo.data;
            //存入window待使用
            window.thbInfo = data;
            let lyricData = data.lyricInfo;
            if(lyricData)
            {
                let lyric = await fetch(lyricData.lyricUrl);
                let lyricInfo = await lyric.text();
                lyricInfo += "[999:999:999]本歌词来自THBWiki";
                let tlyric = await fetch(lyricData.transLyricUrl);
                let tlyricInfo = await tlyric.text();
                tlyricInfo += "[999:999:999]lyrics.thwiki.cc";
                newLyrics = { status: 200, lrc: { lyric: lyricInfo, version: 1 }, tlyric: { lyric: tlyricInfo, version: 1 } };
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