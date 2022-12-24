const separator = `<span class="separator">_</span>`


class KeyType {
  constructor() {
    this.startTime = 0
    this.typeCount = 0
    this.missCount = 0
    this.keySec = 0
    this.clearTime = 0
  }

  keyDown(event) {
    console.log(event.key)
    if (document.activeElement.id == "word-length" || document.activeElement.type == "text" || result.firstChild == null) {
      if (event.key == "Enter") {
        event.preventDefault();
      }
      return;
    }
    if (result.firstChild.id) {
      if (event.ctrlKey && result.firstChild.id == "Ctrl-key") {
        document.getElementById("Ctrl-key").classList.add("gold")
      } else if (event.altKey && result.firstChild.id == "Alt-key") {
        document.getElementById("Alt-key").classList.add("gold")
      }
      if (event.shiftKey && (result.children[0].id == "Shift-key" || result.children[1].id == "Shift-key")) {
        document.getElementById("Shift-key").classList.add("gold")
      }
    }


    const key = (createWord.keyReName[event.key] ? createWord.keyReName[event.key] : event.key).toLowerCase();
    let check
    if (typeof createWord.displayWords[0] == 'object') {
      check = createWord.displayWords[0].slice(-1)[0].toLowerCase() == key && createWord.displayWords[0].slice(1).length == document.getElementsByClassName('gold').length
    } else {
      check = createWord.displayWords[0].toLowerCase() == key && !event.ctrlKey && !event.shiftKey
    }
    if (check) {
      if (se && document.getElementById("key-type").checked == true) {
        se.keyTypePlay()
      }

      createWord.displayWords = createWord.displayWords.slice(1);
      wordUpdate()
      this.typeCount++
      if (this.typeCount == 1) {
        this.startTime = new Date().getTime()
      }
      this.keySec = (this.typeCount / ((new Date().getTime() - this.startTime) / 1000)).toFixed(1)
      document.getElementById("key").textContent = this.typeCount
      document.getElementById("speed").textContent = this.keySec
      if (createWord.displayWords.length == 0){
        this.clearTime = ((new Date().getTime() - this.startTime) / 1000)
        document.getElementById("time").parentElement.classList.remove("invisible")
        document.getElementById("time").textContent = this.clearTime;

        if(option.wordMode != "free") {
          firebase.database().ref('ranking/'+ option.wordMode +'/'+myID).once('value').then(userData => {
            const MAX_RECODE = userData.val()
            if(MAX_RECODE){
              document.getElementById("max-key").textContent = document.getElementById("key").textContent
              document.getElementById("max-length").textContent = document.getElementById("length").textContent
              document.getElementById("max-miss").textContent = MAX_RECODE.miss
              document.getElementById("max-speed").textContent = MAX_RECODE.kps
              document.getElementById("max-time").textContent = MAX_RECODE.clearTime.toFixed(3)
              document.getElementById("ranking-data").classList.remove("invisible")
            }
            
            if(!userData.val() || userData.val().clearTime > keyType.clearTime){
							document.getElementById("time").parentElement.classList.add("text-success")
							if(document.getElementById("auto-submit").checked){
								document.getElementById("result").innerHTML = `お疲れ様でした。
								<button id="submit-button" class="btn btn-warning" disabled>ランキングに登録しました</button>`
								keyType.sendRankingData()
							}else{
								document.getElementById("result").innerHTML = `お疲れ様でした。
								<button id="submit-button" class="btn btn-warning">ランキングに登録</button>`
								document.getElementById("submit-button").addEventListener("click",keyType.sendRankingData.bind(keyType))
							}
            }else{
              document.getElementById("result").textContent = `お疲れ様でした。`
            }
            })
        }else{ 
          document.getElementById("result").textContent = `お疲れ様でした。`
        }
      }
        
    } else if(!createWord.modify.includes(event.key) && this.typeCount >= 1){
      this.missCount++
      document.getElementById("miss").textContent = this.missCount
      if (se && document.getElementById("miss-type").checked == true) {
        se.missTypePlay()
      }
    }
    event.preventDefault()
  }

  keyUp(event) {
    if(result.firstChild == null){
      return;
    }

    if (result.firstChild.id) {
      if (!event.ctrlKey && result.firstChild.id == "Ctrl-key") {
        document.getElementById("Ctrl-key").classList.remove("gold")
      } else if (!event.altKey && result.firstChild.id == "Alt-key") {
        document.getElementById("Alt-key").classList.remove("gold")
      }
      if (!event.shiftKey && (result.children[0].id == "Shift-key" || result.children[1].id == "Shift-key")) {
        document.getElementById("Shift-key").classList.remove("gold")
      }
    }
    event.preventDefault()
  }


  sendRankingData() {
    var updates = {}
    updates['/ranking/'+ option.wordMode+ '/' + myID] = {
      name: document.getElementById("ranking-name").value,
      clearTime: this.clearTime,
      miss: this.missCount,
      kps: this.keySec
    }
    firebase.database().ref().update(updates).then(() => {
      document.getElementById("submit-button").textContent = "ランキングに登録しました。"
      document.getElementById("submit-button").disabled = true
    });
  }


}

const keyType = new KeyType()

window.addEventListener('keydown', keyType.keyDown.bind(keyType))
window.addEventListener('keyup', keyType.keyUp.bind(keyType))
retry.addEventListener('click', e => {
  Reset(option.wordMode)
  e.preventDefault()
})


		function wordUpdate() {
			document.getElementById("result").innerHTML = `${createWord.displayWords.slice(0,25).join(separator).replace(/,/g,"")}`
		}


	function Reset(wordMode) {
		document.getElementById("ranking-data").classList.add("invisible")
		document.getElementById("time").parentElement.classList.add("invisible")
		document.getElementById("time").parentElement.classList.remove("text-success")
		createWord = new CreateWord()
		createWord[wordMode]()
		createWord.word()
		keyType.typeCount = 0;
		keyType.missCount = 0;
		keyType.keySec = 0;
		document.getElementById("key").textContent = 0
		document.getElementById("speed").textContent = "0.0"
		document.getElementById("miss").textContent = 0
	}
