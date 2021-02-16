function propertiesToSheets(){
  var raw = JSON.parse(getProp('jsonObject'));
  //var raw = JSON.parse('{"stocks":{"APPL":{"Shares":5,"SharePrice":137.08},"ARKF":{"Shares":30,"SharePrice":60.08}},"options":[]}')
  //SpreadsheetApp.getActiveSpreadsheet().getRange('A1').setValue(raw.stocks.APPL.Shares);
  setCell('a1',raw.stocks.APPL.Shares)
}
