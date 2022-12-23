let db;
let indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
let OptionDatabaseObject = {}
const STORE_NAME = "filterDB";
const STORE_KEYPATH = ["filterKey"];

//filterDBにアクセス
(function accessIndexedDB(){
	const OPEN_REQUEST = indexedDB.open(STORE_NAME, 1.0);

	//データベースストア新規作成。(初回アクセス時)
	OPEN_REQUEST.onupgradeneeded = function(event) {
		// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
		db = event.target.result;
		const CREATE_filterList = db.createObjectStore("filterKey", { keyPath:STORE_KEYPATH[0]});
  }
	//データベースストアアクセス成功時。
	OPEN_REQUEST.onsuccess = function(event) {
		db = event.target.result;
  getAllIndexeddbData()
	}
})();


//データを保存
function putOptionSaveData(keyPath,Data){
	const SEND_DATA = {[STORE_KEYPATH[0]] : Data};
	const OPEN_REQ = window.indexedDB.open(STORE_NAME);

	OPEN_REQ.onsuccess = function(event){
		var db = event.target.result;
		var trans = db.transaction(STORE_KEYPATH[0], 'readwrite');
		var store = trans.objectStore(STORE_KEYPATH[0]);
		var putReq = store.put(SEND_DATA);
	}
}

function deleteIndexedDB(data){
	const tr = db.transaction(STORE_KEYPATH, 'readwrite');
  const store = tr.objectStore(STORE_KEYPATH[0]);
  
  const request = store.delete(data);
  }