const ALL_SELECT_BTN = document.getElementsByClassName("all-select")


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
	  document.getElementById("auto-submit").checked = localStorage.getItem("auto-submit") == "true" ? true : false;
	  document.getElementById("key-type").checked = localStorage.getItem("key-type") == "true" ? true : false;
	  document.getElementById("miss-type").checked = localStorage.getItem("miss-type") == "true" ? true : false;
	  if(location.search.slice(1)){
		const OPTIONS = document.getElementsByTagName("option")[0]
		for(let i=0;i<OPTIONS.length;i++){
			if(OPTIONS[i].dataset.wordset == location.search.slice(1)){
				document.getElementById("word-mode").options[i].selected = true;
				this.wordMode = location.search.slice(1)
			}
		}
	  }
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
		const CHECKBOX = event.target ? event.target : event
		const OPTION_CHANGED = !CHECKBOX.dataset.defaltDisabled && CHECKBOX.checked || CHECKBOX.dataset.defaltDisabled && !CHECKBOX.checked; 
		OPTION_CHANGED ? deleteIndexedDB(CHECKBOX.value) : putOptionSaveData(0, CHECKBOX.value);

	  if (CHECKBOX.value == "Ctrl") {
		document.getElementById("ctrlAlphabetKeys").style.display = CHECKBOX.checked ? "" : "none";
		document.querySelector("[value=Shift]").parentElement.style.display = CHECKBOX.checked ? "" : "none";
  
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
	
	setLocalStorageCheckbox(event){
		localStorage.setItem(event.target.id,event.target.checked)
	}
  
	wordModeChange(event) {
	  if (event.target.selectedOptions[0].dataset.wordset == "free") {
		document.getElementById("free-key-option").classList.remove("d-none");
		document.getElementById("ranking-button").classList.add("d-none");
		document.getElementById("ranking-name").classList.add("d-none");
		document.getElementById("auto-submit").parentElement.classList.add("d-none");
	  } else {
		document.getElementById("free-key-option").classList.add("d-none");
		document.getElementById("ranking-button").classList.remove("d-none");
		document.getElementById("ranking-name").classList.remove("d-none");
		document.getElementById("auto-submit").parentElement.classList.remove("d-none");
	  }
	  this.wordMode = event.target.selectedOptions[0].dataset.wordset
	  const RANKING_TABLES = document.getElementsByClassName("ranking")
	  for(let i=0;i<RANKING_TABLES.length;i++){
		const NAME = RANKING_TABLES[i].getAttribute("name")
		  if(NAME == this.wordMode){
			RANKING_TABLES[i].classList.remove("d-none")
			document.getElementById("event-name").querySelector(`[name=${NAME}]`).classList.remove("d-none")
		  }else{
			RANKING_TABLES[i].classList.add("d-none")
			document.getElementById("event-name").querySelector(`[name=${NAME}]`).classList.add("d-none")
		  }
	  }
	  Reset(this.wordMode)
	}

	allSelect(event){
		const CHECKBOXS = event.target.parentElement.querySelectorAll("[type='checkbox']")

		if(event.target.textContent == "すべて選択"){
			for(let i=0;i<CHECKBOXS.length;i++){
				if(CHECKBOXS[i].disabled != true){
					CHECKBOXS[i].checked = true
					this.enableKeyUpdate(CHECKBOXS[i])
				}
			}
			event.target.textContent = "すべて選択解除"
		}else{
			for(let i=0;i<CHECKBOXS.length;i++){
				if(CHECKBOXS[i].disabled != true){
					CHECKBOXS[i].checked = false
					this.enableKeyUpdate(CHECKBOXS[i])
				}
			}
			event.target.textContent = "すべて選択"
		}
		event.preventDefault();
	}
  }
  let option = new Option()
  Option.loadOption()


  document.getElementById("keyboard-layout").addEventListener("change", option.keyboardUpdate.bind(option))
  document.getElementById("word-length").addEventListener("change", option.wordLengthUpdate.bind(option))
  document.getElementById("special-keys").addEventListener("change", option.enableKeyUpdate.bind(option))
  document.getElementById("key-type").addEventListener("change", option.keyTypeUpdate)
  document.getElementById("miss-type").addEventListener("change", option.missTypeUpdate)
  document.getElementById("word-mode").addEventListener("change", option.wordModeChange.bind(option))
  document.getElementById("ranking-name").addEventListener("change", option.rankingNameUpdate)
  document.getElementById("auto-submit").addEventListener("change",option.setLocalStorageCheckbox)
  document.getElementById("key-se").addEventListener("change",option.setLocalStorageCheckbox)
  
  for(let i=0;i<ALL_SELECT_BTN.length;i++){
	ALL_SELECT_BTN[i].addEventListener("click",option.allSelect.bind(option))
  }