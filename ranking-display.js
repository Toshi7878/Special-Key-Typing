class RankingDisplay{
	constructor(){
		this.timeRanking
	}

	loadRankingData(event){
		if(!this.timeRanking){
			firebase.database().ref('ranking/'+ option.wordMode).once('value').then(rankingData => {

				rankingDisplay.timeRanking = Object.values(rankingData.val())
				rankingDisplay.timeRanking = rankingDisplay.timeRanking.sort(function(a, b) {
					return (a.clearTime < b.clearTime) ? -1 : 1;  //オブジェクトの昇順ソート
				  });
				  document.getElementById("event-name").textContent = document.querySelector("#word-mode [selected]").textContent
				  for(let i=0;i<this.timeRanking.length;i++){
					this.addRankingTable(this.timeRanking[i],i)
				}
			})
	
		//firebase.database().ref('ranking/'+ option.wordMode).limitToLast(0).on('child_added', this.rankingAdd.bind(rankingDisplay))


		}
	}

	rankingAdd(snapShot){
		this.timeRanking.push(snapShot.val())
		this.timeRanking = this.timeRanking.sort(function(a, b) {
			return (a.clearTime < b.clearTime) ? -1 : 1;  //オブジェクトの昇順ソート
		  });
	}

	addRankingTable(data,i){

		document.querySelector("#ranking-table tbody").insertAdjacentHTML("beforeend",
		`<tr>
			<td class="rank">${i+1}位</td>
			<td class="name">${data.name}</td>
			<td class="time">${data.clearTime.toFixed(3)}秒</td>
			<td class="kps">${data.kps}</td>
			<td class="miss">${data.miss}</td>
		</tr>`)

	}
}
MicroModal.init();
let rankingDisplay = new RankingDisplay()
document.getElementById("ranking-button").addEventListener("click", rankingDisplay.loadRankingData.bind(rankingDisplay))