var ui = SpreadsheetApp.getUi();
//Create the Menu onOpen
function onOpen() {
  ui.createMenu('Sev Menu')
      .addItem('Manual Update', 'manualUpdateButton')
      .addItem('Initialize', "initializeSheet")
      .addSeparator()
      .addSubMenu(ui.createMenu('Settings')
          .addItem('Set Url', 'setUrl'))
      .addSeparator()
      .addSubMenu(ui.createMenu('Testing')
          .addItem('TinsertJsonProperty', 'propertiesToSheets')
          .addSeparator()
          .addItem('updateCurrentHoldings', 'updateCurrentHoldings'))
      .addToUi();
}

//=======Menu Shit=======
//==Main Menu==

//Manual Update Button
function manualUpdateButton(){
  // update the script property > pullForUpdates > Script property jsonUrl
  setProp('jsonObject', pullForUpdates(getProp('jsonUrl')));
  //ui.alert("Updated jsonObject");
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
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1:F1').setHorizontalAlignment("Center")
  setCell("A1","Ticker");
  setCell("B1","Type");
  setCell("C1","Shares");
  setCell("D1","Buy Price");
  setCell("E1","Current Price");
  setCell("F1","Total Equity");
  updateCurrentHoldings()
}

function updateCurrentHoldings(){
  var cachedJson = JSON.parse(getProp("jsonObject"));
  var c = 1
  console.log(getProp("jsonUrl"))
  for(var stock in cachedJson.stocks){
    c = c+1
    console.log(cachedJson["stocks"][stock])
    console.log(cachedJson["stocks"][stock]['CurrentPrice'])
    setCell("A"+c, stock)
    setCell("B"+c, "Stock")
    setCell("C"+c, cachedJson["stocks"][stock]['Shares'])
    setCell("D"+c, cachedJson["stocks"][stock]['SharePrice'])
    setCell("E"+c, cachedJson["stocks"][stock]['CurrentPrice'])
    //=c1*d1
    setCell("F"+c, '=c'+c+'*d'+c)
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
function pullForUpdates(url=getProp('jsonUrl')) {
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
