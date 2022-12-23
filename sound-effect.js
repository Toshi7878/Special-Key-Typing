window.AudioContext = window.AudioContext || window.webkitAudioContext;
class SE{
constructor(){
  this.keyType = new AudioContext();
  this.missType = new AudioContext();
  this.audioBuffer = {};
}

   loadSoundEffect(){
		fetch("se/key_type.mp3").then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			se.keyType.decodeAudioData(arrayBuffer, function(buffer) {
				se.audioBuffer.keyType = buffer;
			});
		})
		fetch("se/miss_type.mp3").then(function(response) {
			return response.arrayBuffer();
		}).then(function(arrayBuffer) {
			se.missType.decodeAudioData(arrayBuffer, function(buffer) {
				se.audioBuffer.missType = buffer;
			});
		})
}

 keyTypePlay(){
	let keyTypeGain = this.keyType.createGain();
	let keyTypeSource = this.keyType.createBufferSource();
	keyTypeSource.buffer = this.audioBuffer.keyType;
	keyTypeSource.connect(keyTypeGain);
	keyTypeGain.connect(this.keyType.destination);
  keyTypeGain.gain.value = 20/100
	keyTypeSource.start(0,0.0005);
}

 missTypePlay(){
	let missTypeGain = this.missType.createGain();
	let missTypeSource = this.missType.createBufferSource();
	missTypeSource.buffer = this.audioBuffer.missType;
	missTypeSource.connect(missTypeGain);
	missTypeGain.connect(this.missType.destination);
  missTypeGain.gain.value = 20/100
	missTypeSource.start(0,0.0005);
}

}

let se = new SE();
se.loadSoundEffect();