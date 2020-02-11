console.log(`--------------------------------




  `)
const fetch = require('node-fetch');
fetch('http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes')
  .then((response) => response.json())
  .then((json) => {
    // console.log(json);
    let totalDurationSec = 0;
    let id = json.id;
    let episodes = []
    let seasonCount=[]

    json._embedded.episodes.forEach((item, index, array) => {
      const epId = item.id;
      let summary = item.summary ? item.summary.replace(/(<([^>]+)>)/ig,"") : 'no summary';
      summary = summary.split('. ', 1)[0]
      seasonCount.push(item.season)
      let newEpisode = {
        [epId] :{
          sequenceNumber:`s${item.season}e${item.number}`,
          shortTitle: item.name ? item.name.split(':').pop() : 'no title',// "... // Title without &quot;Chapter XXX:&quot; prefix"
          airTimestamp: `${item.airStamp}`, //"... // Air timestamp in epoch time (seconds)"
          shortSummary: summary //"... // First sentence of the summary, without HTML tags"
        }
      }
      const season1 = seasonCount.filter(x => x==1).length;
      const season2 = seasonCount.filter(x => x==2).length;
      const season3 = seasonCount.filter(x => x==3).length;
      const av = (season1 + season2 + season3)/3

      episodes.push(newEpisode)
      totalDurationSec += item.runtime*60;

      if(index === array.length -1) {
        let thing = {
          [id] : {
            totalDurationSec,
            averageEpisodesPerSeason: av.toFixed(1),
            episodes
          }
        }
        console.dir(thing, {depth: null, colors: true});
      }
    })
  });