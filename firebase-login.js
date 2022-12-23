function InitFirebase(){

	// Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyCbP20VOuJTv5evijR1tAs7b42X2aBBrTU",
		databaseURL: "https://eeeeetest-b8e78.firebaseio.com/"

	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

RoginAnon()
} 
InitFirebase()

/**
*@Description　ユーザの匿名ログイン
*@return bool  true:ログインに成功
*/
function RoginAnon(){

	firebase.auth().signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		console.log(errorCode);
		console.log( errorMessage);
		alert("RealTimeCombatting:Firebaseのサインインに失敗しました。");
		return false;
		// ...
	});

	firebase.auth().onAuthStateChanged(function(user) {

		if (user) {
			// User is signed in.
			myID = "U"+user.uid
      			//getIPaddress()
			// ...
		} else {
			// User is signed out.
			// ...

		}
		// ...
	});

	return true;
}

/**
*@Description　IPアドレスを取得
*/
let myIP
let myID

function getIPaddress(){
	//一度取得していたらhttps://ipinfo.ioに接続しない。
	myIP = localStorage.getItem("IPaddress")

	if(!myIP){
		fetch('https://ipinfo.io?callback').then(res => res.json()).then(json => {
			myIP = json.ip
			localStorage.setItem("IPaddress",json.ip)
		});
	}
}