class RankingDisplay{
	constructor(){
	}

	loadRankingData(event){
		if(!this[option.wordMode]){
			firebase.database().ref('ranking/'+ option.wordMode).once('value').then(rankingData => {
				document.getElementById("modal-1-content").insertAdjacentHTML("beforeend",
				`<table id="${option.wordMode}-ranking-table" class="ranking" name="${option.wordMode}">
				<tbody>
						<td>順位</td>
						<td>名前</td>
						<td>タイム</td>
						<td>打/秒</td>
						<td>ミス数</td>
				</tbody>
			</table>`)
			document.getElementById("event-name").insertAdjacentHTML("beforeend",
			`<span name="${option.wordMode}"></span>`)
				rankingDisplay[option.wordMode] = Object.values(rankingData.val())
				rankingDisplay[option.wordMode] = rankingDisplay[option.wordMode].sort(function(a, b) {
					return (a.clearTime < b.clearTime) ? -1 : 1;  //オブジェクトの昇順ソート
				  });
				  document.getElementById("event-name").querySelector(`[name=${option.wordMode}]`).textContent = document.querySelector("#word-mode").selectedOptions[0].textContent
				  for(let i=0;i<this[option.wordMode].length;i++){
					this.addRankingTable(this[option.wordMode][i],i)
				}
			})
	
		//firebase.database().ref('ranking/'+ option.wordMode).limitToLast(0).on('child_added', this.rankingAdd.bind(rankingDisplay))


		}
	}

	rankingAdd(snapShot){
		this[option.wordMode].push(snapShot.val())
		this[option.wordMode] = this[option.wordMode].sort(function(a, b) {
			return (a.clearTime < b.clearTime) ? -1 : 1;  //オブジェクトの昇順ソート
		  });
	}

	addRankingTable(data,i){

		document.querySelector(`[name=${option.wordMode}] tbody`).insertAdjacentHTML("beforeend",
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