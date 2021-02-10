//Create the Menu onOpen
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Sev Menu')
      .addItem('Manual Update', 'manualUpdate')
      .addItem('Initialize', "initializeSheet")
      .addSeparator()
      .addSubMenu(ui.createMenu('Settings')
          .addItem('Set Url', 'setUrl'))
      .addToUi();
}

function getProp(key){
  PropertiesService.getScriptProperties().getProperty(key)
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

function test(){
  var sheetList = SpreadsheetApp.getActive().getSheets()
  for (var i in sheetList){
    var sheet = sheetList[i]
    if (sheet.getDataRange().getValues().join("") === ""){


    }
  }
}

function initializeSheet(){
  if (getProp("initStatus") != "True"){
    setProp("initStatus", "True");
    SpreadsheetApp.getActiveSheet().setName("History");
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("Current Holdings");
  }else if{

  }
}

//F to update the json Url
function setUrl(){
  var ui = SpreadsheetApp.getUi()

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
