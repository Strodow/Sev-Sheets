//==Settings Menu==
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
