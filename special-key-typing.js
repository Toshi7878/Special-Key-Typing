const separator = `<span class="separator">_</span>`

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Option {
  constructor() {
    this.wordMode = "majorKeys"
  }
  static loadOption() {
    const W_LENGTH = sessionStorage.getItem("word-length")
    if (W_LENGTH) {
      document.getElementById("word-length").value = W_LENGTH
      document.getElementById("length").textContent = W_LENGTH
    }
    const KEYBOARD = sessionStorage.getItem("keyboard")
    if (KEYBOARD == "us") {
      document.getElementsByName("keyboard")[1].checked = true;
      document.getElementById("jisKeys").style.display = "none";
    }
    document.getElementById("ranking-name").value = localStorage.getItem("ranking-name") ? localStorage.getItem("ranking-name") : ""
  }

  wordLengthUpdate(event) {
    sessionStorage.setItem(event.target.id, event.target.value)
    document.getElementById("length").textContent = event.target.value
    Reset(this.wordMode)
  }

  rankingNameUpdate(event) {
    localStorage.setItem(event.target.id, event.target.value)
  }
  keyboardUpdate(event) {
    sessionStorage.setItem(event.target.name, event.target.value)
    document.getElementById("jisKeys").style.display = event.target.value == "us" ? "none" : "";
    Reset(this.wordMode)
  }

  enableKeyUpdate(event) {
    event.target.checked ? deleteIndexedDB(event.target.value) : putOptionSaveData(0, event.target.value);
    if (event.target.value == "Ctrl") {
      document.getElementById("ctrlAlphabetKeys").style.display = event.target.checked ? "" : "none";
      document.querySelector("[value=Shift]").parentElement.style.display = event.target.checked ? "" : "none";

    }
    Reset(this.wordMode)
  }

  keyTypeUpdate(event) {
    if (event.target.checked) {
      se.keyTypePlay()
    }
  }
  missTypeUpdate(event) {
    if (event.target.checked) {
      se.missTypePlay()
    }
  }


  wordModeChange(event) {
    if (event.target.value == "free") {
      document.getElementById("free-key-option").classList.remove("d-none");
      document.getElementById("ranking-button").classList.add("d-none");
      document.getElementById("ranking-name").classList.add("d-none");
    } else {
      document.getElementById("free-key-option").classList.add("d-none");
      document.getElementById("ranking-button").classList.remove("d-none");
      document.getElementById("ranking-name").classList.remove("d-none");
    }
    this.wordMode = event.target.value
    createWord[document.querySelector("#word-mode [selected]").dataset.wordset]()
    createWord.word()
  }
}
Option.loadOption()

let option = new Option()
document.getElementById("keyboard-layout").addEventListener("change", option.keyboardUpdate)
document.getElementById("word-length").addEventListener("change", option.wordLengthUpdate)
document.getElementById("special-keys").addEventListener("change", option.enableKeyUpdate)
document.getElementById("key-type").addEventListener("change", option.keyTypeUpdate)
document.getElementById("miss-type").addEventListener("change", option.missTypeUpdate)
document.getElementById("word-mode").addEventListener("change", option.wordModeChange)
document.getElementById("ranking-name").addEventListener("change", option.rankingNameUpdate)
class CreateWord extends WordSet {

  constructor() {
    super();
    this.keyOptionId = ["ctrlKeys", "normalKeys", "functionKeys", "jisKeys", "ctrlAlphabetKeys"]

    this.ctrlKeys = []
    this.ctrlAlphabetKeys = [] //"T","W","N"
    this.normalKeys = []
    this.jisKeys = []
    this.functionKeys = []
    this.modify = ['Control', 'Shift', 'Alt']
    this.keyReName = {
      'Insert': 'Ins',
      'Delete': 'Del',
      'PageUp': 'PgUp',
      'PageDown': 'PgDown',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'NonConvert': '無変換',
      'Convert': '変換',
      'Backspace': 'BS',
      'KanaMode': 'Kana',
      'Romaji': 'Kana',
      'Alphanumeric': 'CapsLock',
      'Hiragana': 'Kana'
    }
    this.displayWords = []
  }
  free() {
    for (let i = 0; i < this.keyOptionId.length; i++) {
      Array.from(document.querySelectorAll(`#${this.keyOptionId[i]} input:checked:not([value=Shift])`)).forEach((input) => {
        this[this.keyOptionId[i]].push(input.value)
      })
    }
    this["shiftkey"] = document.querySelector("[value=Shift]").checked
    if (document.querySelector("input[name=keyboard]:checked").value == "jis") {
      this.normalKeys = this.jisKeys.concat(this.normalKeys)
    }
    this.words = this.ctrlKeys.concat(this.normalKeys)
  }
  word() {
    const len = option.wordMode == "free" ? document.getElementById("word-length").value : document.querySelector("#word-mode [selected]").dataset.length
    for (let i = 0; i < len; i++) {
      this.w = this.words[getRandomInt(this.words.length)]

      if (this.w == 'Ctrl') {
        this.w = this.w.replace(/(Ctrl|Alt|Shift)/, '<span id="$1-key">$1 + </span>')
        if (this.ctrlKeys.length && Math.random() < 0.5) {
          this.addModifyWords()
        } else if (this.ctrlAlphabetKeys.length) {
          this.addctrlAlphabetKeys()
        }
      } else if (this.w == 'Alt') {
        if (this.jisKeys.includes("Kana") && Math.random() < 0.5) {
          this.displayWords.push(['<span id="Alt-key">Alt + </span>', 'Kana']);
        } else {
          this.displayWords.push('Alt');
        }

      } else if (this.w == 'Shift') {
        this.addShiftKeys()
      } else {
        this.displayWords.push(this.w);
      }
    }
    wordUpdate()
  }
  addModifyWords() {
    if (this.shiftKey && Math.random() < 0.5) {
      const shift = '<span id="Shift-key">Shift + </span>'
      this.displayWords.push([this.w, shift, this.ctrlKeys[getRandomInt(this.ctrlKeys.length)]]);
    } else {
      this.displayWords.push([this.w, this.ctrlKeys[getRandomInt(this.ctrlKeys.length)]]);
    }
  }

  addctrlAlphabetKeys() {
    if (this.shiftKey && Math.random() < 0.5) {
      const shift = '<span id="Shift-key">Shift + </span>'
      this.displayWords.push([this.w, shift, this.ctrlAlphabetKeys[getRandomInt(this.ctrlAlphabetKeys.length)]]);
    } else {
      this.displayWords.push([this.w, this.ctrlAlphabetKeys[getRandomInt(this.ctrlAlphabetKeys.length)]]);
    }
  }

  addShiftKeys(){
    const shift = '<span id="Shift-key">Shift + </span>'
    this.displayWords.push([shift, this.shiftKeys[getRandomInt(this.shiftKeys.length)]]);
  }
}

let createWord



function wordUpdate() {
  document.getElementById("result").innerHTML = `${createWord.displayWords.slice(0,25).join(separator).replace(/,/g,"")}`
}


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
      if (event.shiftKey && (result.children[1].id == "Shift-key" || result.children[0].id == "Shift-key")) {
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
        if(this.wordMode != "free") {
          firebase.database().ref('ranking/'+ option.wordMode +'/'+myID).once('value').then(userData => {
            if(!userData.val() || userData.val().clearTime > keyType.clearTime){
              document.getElementById("result").innerHTML = `お疲れ様でした。
              <button id="submit-button" class="btn btn-warning">ランキングに登録</button>`
              document.getElementById("submit-button").addEventListener("click",keyType.sendRankingData.bind(keyType))
            }else{
              document.getElementById("result").textContent = `お疲れ様でした。`
            }
            })
        }else{ 
          document.getElementById("result").textContent = `お疲れ様でした。`
        }
      }
        
    } else if(!createWord.modify.includes(event.key)){
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
      if (!event.shiftKey && result.children[1].id == "Shift-key") {
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




function Reset(wordMode) {
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




function getAllIndexeddbData() {
  //トランザクション
  var transaction = db.transaction(STORE_KEYPATH, 'readonly');
  //オブジェクトストアにアクセスします。
  var listObjectStore = transaction.objectStore(STORE_KEYPATH[0]);
  //全件取得
  var listRequest = listObjectStore.getAllKeys()
  //取得が成功した場合の関数宣言
  listRequest.onsuccess = function (event) {
    const result = event.currentTarget.result
    for (let i = 0; i < result.length; i++) {
      document.querySelector(`[value=${result[i]}]`).checked = false;
      if (result[i] == "Ctrl") {
        document.getElementById("ctrlAlphabetKeys").style.display = "none";
        document.querySelector("[value=Shift]").parentElement.style.display = "none";

      }
    }
    createWord = new CreateWord()
    createWord[document.querySelector("#word-mode [selected]").dataset.wordset]()
    createWord.word()
  };
}