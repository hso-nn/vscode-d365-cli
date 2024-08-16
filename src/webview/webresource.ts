import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField, vsCodeRadioGroup, RadioGroup, vsCodeRadio, Radio} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField(), vsCodeRadioGroup(), vsCodeRadio());

const vscode = acquireVsCodeApi();

window.addEventListener("load", webresource);

function webresource() {
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
    command: `hso-d365 generate Webresource --help`,
    text: "",
  });
}

function submitForm() {
  const webresourceName = (document.getElementById("webresourceName") as HTMLInputElement).value;
  const webresourceTemplate = (document.getElementById("webresourceTemplate") as HTMLInputElement).value;

  if(!webresourceName) {
    vscode.postMessage({
      commandType: "showError",
      text: `Webresource Name is required`,
    });
    return;
  }

  vscode.postMessage({
    commandType: "Submit",
    command: `hso-d365 generate Webresource  ${webresourceName} --template  ${webresourceTemplate}`,
    text: ``,
  });
}
