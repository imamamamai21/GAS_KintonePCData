// ライブラリ ID▼ KintonePCData
// 1SVsfE3CFjpH29fEtCHz5iDxhstAagRQhyWj3lqwEAO_sRhDSXnsF2K5-

/**
 * データを更新する
 * トリガー登録 毎日0時〜1時
 * 任意のタイミングでも更新される
 */
function updateData() {
  pcDataSheet.sheet.getRange(pcDataSheet.startRow, 1, pcDataSheet.sheet.getLastRow(), pcDataSheet.sheet.getLastColumn()).clearContent();
  
  //var test = [{capc_id: {value:'capc_id1'}, owner_name: {value:'owner_name1'}}, {capc_id: {value:'capc_id2'}, owner_name: {value:'owner_name2'}}, {capc_id: {value:'capc_id3'}, owner_name: {value:'owner_name3'}}]//KintoneApi.caApi.getAllData();
  var repsponse = KintoneApi.caApi.getAllData();
  var sortObj = {};
  var titles = pcDataSheet.getTitles();

  // 項目ごとのobjectに変換する
  repsponse.forEach(function(values, i) {
    Object.keys(titles).forEach(function(key) {
      if (!repsponse[i][key]) return;
      var text = (key === 'created_by') ? repsponse[i][key].value.name : repsponse[i][key].value;
      if (!sortObj[key]) sortObj[key] = [];
      sortObj[key][i] = [text];
    });
  });
  
  Object.keys(sortObj).forEach(function (key) { // 項目ごとに書き込む
    pcDataSheet.sheet.getRange(pcDataSheet.startRow, titles[key].index + 1, sortObj[key].length, 1).setValues(sortObj[key]);
  });
  
  // 更新日時のアップデート
  var timeStamp = Utilities.formatDate(new Date(), 'JST', 'yyyy年 MM/dd(E) HH:mm');
  SpreadsheetApp.openById(MY_SHEET_ID).getSheetByName('はじめに').getRange('B2').setValue(timeStamp);
}
