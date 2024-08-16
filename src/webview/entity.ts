import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField, vsCodeCheckbox ,Checkbox} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField(), vsCodeCheckbox());

const vscode = acquireVsCodeApi();

window.addEventListener("load", entity);

function entity() {
  const submit = document.getElementById("submit") as HTMLButtonElement;
  submit?.addEventListener("click", submitForm);

  const help = document.getElementById("help") as HTMLButtonElement;
  help?.addEventListener("click", handleHelp);

  const cancel = document.getElementById("cancel") as HTMLButtonElement;
  cancel?.addEventListener("click", handleCancel);

  const back = document.getElementById("back") as HTMLButtonElement;
  back?.addEventListener("click", handleBack);

}

function handleBack() {
  vscode.postMessage({
    commandType: "Back",
    text: "",
  });
}

function handleCancel() {
  vscode.postMessage({
    commandType: "Cancel",
    text: "",
  });
}

function handleHelp() {
  vscode.postMessage({
    commandType: "runTerminalCommand",
    command: `hso-d365 generate Entity --help`,
    text: "",
  });
}

function submitForm() {
  const entityName = (document.getElementById("entityName") as HTMLInputElement).value;
  const entityLogicalName = (document.getElementById("entityLogicalName") as HTMLInputElement).value;
  const skipForms = (document.getElementById("skipForms") as HTMLInputElement).checked;

  let skipFormsValue = "";
  if(skipForms) {
     skipFormsValue = "--skipForms";
  }


  if(!entityName) {
    vscode.postMessage({
      commandType: "showError",
      text: `Entity Name is required`,
    });
    return;
  }
  if(!entityLogicalName) {
    vscode.postMessage({
      commandType: "showError",
      text: "Entity Logical Name is required",
    });
    return;
  }

  vscode.postMessage({
    commandType: "Submit",
    command: `hso-d365 generate Entity ${entityName} --entityLogicalName  ${entityLogicalName} ${skipFormsValue}`,
    text: ``,
  });
}
