function getProp(key){
  return(PropertiesService.getScriptProperties().getProperty(key));
}

function setProp(key, value){
  return(PropertiesService.getScriptProperties().setProperty(key, value));
}

function setCell(location, value, sheet=null){
  if (sheet == null){
    SpreadsheetApp.getActiveSpreadsheet().getRange(location).setValue(value);
  }else{
    SpreadsheetApp.setActiveSheet(sheet).getRange(location).setValue(value);
  }
}
