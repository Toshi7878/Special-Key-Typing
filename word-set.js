class WordSet {
	majorKeys(){
		this.ctrlKeys = [
			"BS",
			"Del",
			"←",
			"→",
			"Home",
			"End",
		]
		this.shiftKeys = [
			"BS",
			"Del",
			"←",
			"↓",
			"↑",
			"→",
			"Home",
			"End",
		]
		this.specialKeys = [
			"BS",
			"Del",
			"←",
			"↓",
			"↑",
			"→",
			"Home",
			"End",
			"Enter"
		]
		this.ctrlAlphabetKeys = [
			"A",
			"C",
			"H",
			"V",
			"X",
			"Y",
			"Z"
		]
		this.normalKeys = [
			"Ctrl",
			"Alt",
			"Tab",
			"PgUp",
			"PgDown",
			"Shift"
		]
		this.functionKeys= [
			"F1",
			"F2",
			"F3",
			"F4",
			"F5",
			"F6",
			"F7",
			"F8",
			"F9",
			"F10",
			"F11",
			"F12"
		]
		this.shiftKey = false
		this.words = this.specialKeys.concat(this.normalKeys).concat(this.functionKeys)
	}


}