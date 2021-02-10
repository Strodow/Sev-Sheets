var ui = SpreadsheetApp.getUi();
//Create the Menu onOpen
function onOpen() {
  ui.createMenu('Sev Menu')
      .addItem('Manual Update', 'manualUpdate')
      .addItem('Initialize', "initializeSheet")
      .addSeparator()
      .addSubMenu(ui.createMenu('Settings')
          .addItem('Set Url', 'setUrl'))
      .addToUi();
}

function getProp(key){
  PropertiesService.getScriptProperties().getProperty(key);
}
function setProp(key, value){
  PropertiesService.getScriptProperties().setProperty(key, value);
}

//=======Menu Shit=======
//Manual Update Button
function manualUpdate(){
  var ui = SpreadsheetApp.getUi();
  // update the script property > pullForUpdates > Script property jsonUrl 
  getProp('jsonObject', pullForUpdates(getProp('jsonUrl')));
  ui.alert("Updated");
}

function initializeSheet(){
  // if not initiated
  if (getProp("initStatus") !== "True"){
    setProp("initStatus", "True");
    initCreate();
    
    //check if you want to wipe and reset
  }else{
  var sheetList = SpreadsheetApp.getActive().getSheets();
  for (var i in sheetList){
    var sheet = sheetList[i];
    if (!sheet.getDataRange().getValues().join("") === ""){
      var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue? (delete everything)(litteraly everything; move it out of the sheet if you want to save it)',
      ui.ButtonSet.YES_NO);
    }

    if (result == ui.Button.YES) {
      ui.alert('Confirmation received.');
      initClean();
      initCreate();
      } else {
      ui.alert('Not deleting everything');
      }
    }
  }
}

function initClean(){
  SpreadsheetApp.getActiveSpreadsheet().insertSheet("1")
  var sheetList = SpreadsheetApp.getActive().getSheets();
  for (var i in sheetList){
    var sheet = sheetList[i];
    if (sheet != "1"){
      //todo : there is a set active sheet.clear possibly use that to do soft resets later
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
    }
  }
}
function initCreate(){
  SpreadsheetApp.getActiveSheet().setName("History");
  SpreadsheetApp.getActiveSpreadsheet().insertSheet("Current Holdings");
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue("1");

}

//F to update the json Url
function setUrl(){
  var result = ui.prompt(
      'Url to stock json info',
      'Please enter url:',
      ui.ButtonSet.OK_CANCEL);

  var button = result.getSelectedButton();
  var text = result.getResponseText();
  if (button == ui.Button.OK) {
    // User clicked "OK".
    ui.alert('setting Url to : ' + text);
    setProp('jsonUrl', text);
  }
}

//=======JSON retrieval=======
//F to Update the properties
function intervalUpdate(){
  getProp('jsonObject', pullForUpdates(getProp('jsonUrl')));
}

//need to update todo: make it update according to when intervalUpdate is called
//returns the time for when the next update happens
function getNextUpdate(Minutes){
  var timeStamp = new Date(new Date().getTime() + (Minutes*60000));
  return timeStamp.toTimeString();
}

//returns the json string from url
function pullForUpdates(url) {
  var response = UrlFetchApp.fetch(url);
  var w = response.getContentText();
  return w;
}

//=======JSON utilization=======
//
function pasteJsonValues(){
  var raw = JSON.parse(getProp('jsonObject'));
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue(raw.stocks.APPL.Shares);
}
