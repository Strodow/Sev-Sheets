var ui = SpreadsheetApp.getUi();
//Create the Menu onOpen
function onOpen() {
  ui.createMenu('Sev Menu')
      .addItem('Manual Update', 'manualUpdateButton')
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
function manualUpdateButton(){
  var ui = SpreadsheetApp.getUi();
  // update the script property > pullForUpdates > Script property jsonUrl 
  setProp('jsonObject', pullForUpdates(getProp('jsonUrl')));
  ui.alert("Updated");
}

function propertiesToSheets(){
  var raw = JSON.parse(getProp('jsonObject'));
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue(raw.stocks.APPL.Shares);
}

function initializeSheet(){
  // if not initiated
  var result = ui.alert(
  'Please confirm',
  'Are you sure you want to continue? \n(delete everything)\n(litteraly everything; move it out of the sheet if you want to save it)',
    ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    ui.alert('Confirmation received.');
    initClean();
    initCreate();
    } else {
    ui.alert('Not deleting everything');
    }
}

function initClean(){
  SpreadsheetApp.getActiveSpreadsheet().insertSheet()
  var sheetList = SpreadsheetApp.getActive().getSheets();
  for (var i in sheetList){
    if ((parseInt(i,10)+1) != sheetList.length){
      var sheet = sheetList[i];
        SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
    }
  }
}

function initCreate(){
  SpreadsheetApp.getActiveSheet().setName("History");
  SpreadsheetApp.getActiveSpreadsheet().insertSheet("Current Holdings");
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue("Ticker");
  SpreadsheetApp.getActiveSpreadsheet().getRange('B1').setValue("Type");
  SpreadsheetApp.getActiveSpreadsheet().getRange('C1').setValue("Shares");
  SpreadsheetApp.getActiveSpreadsheet().getRange('D1').setValue("Buy Price");
  SpreadsheetApp.getActiveSpreadsheet().getRange('E1').setValue("Current Price");
  SpreadsheetApp.getActiveSpreadsheet().getRange('F1').setValue("Total Equity");
  updateCurrentHoldings()

}

function updateCurrentHoldings(){
  
  setTimeout(() => {  var cachedJson = JSON.parse(getProp("jsonObject")); }, 2000);
  
  for(var share in cachedJson.stocks){
    ui.alert(share)
  }
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
  return w
}

//=======JSON utilization=======
//
function pasteJsonValues(){
  var raw = JSON.parse(getProp('jsonObject'));
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue(raw.stocks.APPL.Shares);
}
