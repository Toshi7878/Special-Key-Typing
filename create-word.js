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
	  this.words = this.ctrlKeys.concat(this.normalKeys).concat(this.functionKeys)
	}
	word() {
	  const len = option.wordMode == "free" ? document.getElementById("word-length").value : document.querySelector("#word-mode [selected]").dataset.length
	  for (let i = 0; i < len; i++) {
		this.w = this.words[this.getRandomInt(this.words.length)]
  
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
		this.displayWords.push([this.w, shift, this.ctrlKeys[this.getRandomInt(this.ctrlKeys.length)]]);
	  } else {
		this.displayWords.push([this.w, this.ctrlKeys[this.getRandomInt(this.ctrlKeys.length)]]);
	  }
	}
  
	addctrlAlphabetKeys() {
	  if (this.shiftKey && Math.random() < 0.5) {
		const shift = '<span id="Shift-key">Shift + </span>'
		this.displayWords.push([this.w, shift, this.ctrlAlphabetKeys[this.getRandomInt(this.ctrlAlphabetKeys.length)]]);
	  } else {
		this.displayWords.push([this.w, this.ctrlAlphabetKeys[this.getRandomInt(this.ctrlAlphabetKeys.length)]]);
	  }
	}
  
	addShiftKeys(){
	  const shift = '<span id="Shift-key">Shift + </span>'
	  this.displayWords.push([shift, this.shiftKeys[this.getRandomInt(this.shiftKeys.length)]]);
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	  }
  }
  
  //indexedDBアクセス後、自由練習モード設定が読み込まれたらインスタンス化。
  let createWord
  
