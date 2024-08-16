import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField, vsCodeRadioGroup, RadioGroup} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField(), vsCodeRadioGroup());

const vscode = acquireVsCodeApi();

window.addEventListener("load", model);

function model() {
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
    command: `hso-d365 generate Model --help`,
    text: "",
  });
}

function submitForm() {
  const modelName = (document.getElementById("modelName") as TextField).value;
  const modelLogicalName = (document.getElementById("modelLogicalName") as TextField).value;

  if(!modelName) {
    vscode.postMessage({
      commandType: "showError",
      text: `Model Name is required`,
    });
    return;
  }

  if(!modelLogicalName) {
    vscode.postMessage({
      commandType: "showError",
      text: `Logical Name is required`,
    });
    return;
  }

  vscode.postMessage({
    commandType: "Submit",
    command: `hso-d365 generate Model  ${modelName} --entityLogicalName  ${modelLogicalName}`,
    text: ``,
  });
}
