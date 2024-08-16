import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField());

const vscode = acquireVsCodeApi();

window.addEventListener("load", project);

function project() {
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
    command: `hso-d365 new --help`,
    text: "",
  });
}


function submitForm() {
  const projectName = (document.getElementById("projectName") as HTMLInputElement).value;
  const environment = (document.getElementById("environment") as HTMLInputElement).value;
  const deploySolution = (document.getElementById("deploySolution") as HTMLInputElement).value;
  let generateSolution = (document.getElementById("generateSolution") as HTMLInputElement).value;
  const publisherName = (document.getElementById("publisherName") as HTMLInputElement).value;
  const publisherPrefix = (document.getElementById("publisherPrefix") as HTMLInputElement).value;
  const namespace = (document.getElementById("namespace") as HTMLInputElement).value;

  if(!projectName) {
    vscode.postMessage({
      commandType: "showError",
      text: "Project Name is required",
    });
    return;
  }
  const projectNameRegExp = new RegExp('[a-zA-Z_\\d]*');
  if(!projectNameRegExp.test(projectName)) {
    vscode.postMessage({
      commandType: "showError",
      text: "Project Name is not valid",
    });
    return;
  } 

  if(!environment) {
    vscode.postMessage({
      commandType: "showError",
      text: "Environment is required",
    });
    return;
  }
  const urlRegExp = new RegExp('https://(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}');
  if(!urlRegExp.test(environment)) {
    vscode.postMessage({
      commandType: "showError",
      text: "Environment is not a valid URL",
    });
    return;
  }

  if(!deploySolution) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a solution",
    });
    return;
  }
  const solutionNameRegExp = new RegExp('[a-zA-Z_\\d]*');
  if(!solutionNameRegExp.test(deploySolution)) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a valid solution name",
    });
    return;
  }

  if(!generateSolution) {
    generateSolution = deploySolution;
  }
  if(!solutionNameRegExp.test(generateSolution)) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a valid solution name",
    });
    return;
  }

  if(!publisherName) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a publisher",
    });
    return;
  }
  const publisherRegExp = new RegExp('[a-zA-Z_\\d]*');
  if(!publisherRegExp.test(publisherName)) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a valid publisher",
    });
    return;
  }

  if(!publisherPrefix) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a publisher prefix",
    });
    return;
  }
  const prefixRegExp = new RegExp('[a-z]{3}');
  if(!prefixRegExp.test(publisherPrefix)) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a valid publisher prefix",
    });
    return;
  }

  if(!namespace) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a customer or product name",
    });
    return;
  }
  const namespaceRegExp = new RegExp('[a-zA-Z_\\d]*');
  if(!namespaceRegExp.test(namespace)) {
    vscode.postMessage({
      commandType: "showError",
      text: "You need to provide a valid customer or product name",
    });
    return;
  }

  vscode.postMessage({
    commandType: "Submit",
    command: `hso-d365 new ${projectName} --environment ${environment} --solution_deploy ${deploySolution} --solution_generate ${generateSolution} --publisher_name ${publisherName} --publisher_prefix ${publisherPrefix} --namespace ${namespace}`,
    text: `${projectName}`,
  });
}
