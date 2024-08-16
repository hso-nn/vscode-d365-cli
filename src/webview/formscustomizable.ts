import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField, vsCodeRadioGroup, RadioGroup, vsCodeCheckbox, Checkbox} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField(), vsCodeRadioGroup(), vsCodeCheckbox());

const vscode = acquireVsCodeApi();

window.addEventListener("load", globaloptionsets);

function globaloptionsets() {
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
    command: `hso-d365 setFormCustomizable --help`,
    text: "",
  });
}

function submitForm() {
  const setCustomizable = (document.getElementById("customizable") as HTMLInputElement).checked;

  vscode.postMessage({
    commandType: "Submit",
    command: `hso-d365 setFormCustomizable ${setCustomizable.toString()}`,
    text: ``,
  });
}
