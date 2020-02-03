
/**
 * 台帳のシート
 */
var PcDataSheet = function() {
  this.sheet = SpreadsheetApp.openById(MY_SHEET_ID).getSheetByName('台帳データ');
  this.values = this.sheet.getDataRange().getValues();
  this.startRow = 3;
  this.titleValues = {};
  
  this.createTitles = function() {
    var me = this;
    var keys = this.values[1];
    this.values[0].forEach(function (value, i) { me.titleValues[keys[i]] = { title: value, index: i, key: keys[i] }; });
    return this.titleValues;
  }
}
  
PcDataSheet.prototype = {
  /**
   * keyの列アルファベットを返す
   * @param {string}　key 'capc_id'
   */
  getRowKey: function(key) {
    var target = this.getTitles()[key] || null;
    if (target) return SHEET_ROWS[target.index];
    else return '';
  },
  /**
   * keyの列Indexを返す
   * @param {string}　key 'capc_id'
   */
  getRowIndex: function(key) {
    var target = this.getTitles()[key] || null;
    if (target) return Number(target.index);
    else return -1;
  },
  getTitles: function() {
    return Object.keys(this.titleValues).length ? this.titleValues : this.createTitles();
  },
  /**
   * 対象のレンタルPCのデータを渡す
   * @param レンタルPC番号 {string} '00-00000'
   */
  getTargetData: function(rentalNo) {
    var index = this.getIndex().yrlNo;
    return this.values.filter(function(value) {
      return value[index] == rentalNo.replace('-', '');
    })[0];
  },
  /**
   * 対象のユーザーIDが利用者社員番号として登録されている情報全てを返す
   * @param {string} userID 社員番号枝番なし 'A12345'
   * @return {array} [[pc1],[pc2],...]
   */
  getTargetUserData: function(userID) {
    var rowIndex = this.getRowIndex('user_id') 
    return this.values.filter(function(value) {
      return value[rowIndex] == userID;
    });
  }
};

var pcDataSheet = new PcDataSheet();

function test() {
  Logger.log(pcDataSheet.getTargetUserData('A12366'));
  Logger.log(pcDataSheet.getRowKey('pc_id_old'));
  Logger.log(pcDataSheet.getRowKey('capc_id'));
}