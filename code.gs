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

//todo when updating look at the pas positions prop and see if there are changes

//Manual Update Button
function manualUpdateButton(){
  // update the script property > pullForUpdates > Script property jsonUrl
  jsonUpdateObject = JSON.parse(pullForUpdates(getProp('jsonUrl')))["securitiesAccount"]
  //setProp('jsonObject', jsonUpdateObject);
  setProp('positions', JSON.stringify(jsonUpdateObject["positions"]))
  setProp('orderStrategies', JSON.stringify(jsonUpdateObject["orderStrategies"]))
  setProp('currentBalances', JSON.stringify(jsonUpdateObject["currentBalances"]))
  setProp('projectedBalances', JSON.stringify(jsonUpdateObject["projectedBalances"]))
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
  setCell("D1","Average Price");
  setCell("E1","Current Price");
  setCell("F1","P/L Day");
  setCell("G1","Total Equity");
  updateCurrentHoldings()
}

//todo join options to stock average price
function updateCurrentHoldings(){
  var cachedPositions = JSON.parse(getProp("positions"));
  //console.log(cachedPositions)
  for(var stock in cachedPositions){
    c = parseInt(stock)+2
    c = c.toString()
    setCell("A"+c, cachedPositions[stock]["instrument"]["symbol"])
    setCell("B"+c, cachedPositions[stock]["instrument"]["assetType"])
    setCell("C"+c, cachedPositions[stock]["longQuantity"])//todo check if 0 and switch to short quantity
    setCell("D"+c, cachedPositions[stock]["averagePrice"])
    //=g1/c1
    setCell("E"+c,"=G"+c+"/C"+c)
    setCell("F"+c, cachedPositions[stock]["currentDayProfitLoss"])
    setCell("G"+c, cachedPositions[stock]["marketValue"])
  }
  setCell("G"+(parseInt(c)+1).toString(), "=sum(G2:G14)")
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
