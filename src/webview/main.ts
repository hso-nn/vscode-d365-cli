import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDivider, vsCodeTextField, TextField} from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDivider(), vsCodeTextField());

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {
  const cliVersionInfo = document.getElementById("cliVersionInfo") as HTMLButtonElement;
  cliVersionInfo?.addEventListener("click", versionInfo);

  const cliInstallNPM = document.getElementById("cliInstallNPM") as HTMLButtonElement;
  cliInstallNPM?.addEventListener("click", () => runTerminalCommand("npm install -g @hso/d365-cli"));

  const cliInstallYARN = document.getElementById("cliInstallYARN") as HTMLButtonElement;
  cliInstallYARN?.addEventListener("click", () => runTerminalCommand("yarn global add @hso/d365-cli"));

  const cliUpdateNPM = document.getElementById("cliUpdateNPM") as HTMLButtonElement;
  cliUpdateNPM?.addEventListener("click", () => runTerminalCommand("npm install -g @hso/d365-cli@latest"));

  const cliUpdateYARN = document.getElementById("cliUpdateYARN") as HTMLButtonElement;
  cliUpdateYARN?.addEventListener("click", () => runTerminalCommand("yarn global add @hso/d365-cli@latest"));

  const cliVersion = document.getElementById("cliVersion") as HTMLButtonElement;
  cliVersion?.addEventListener("click", () => runTerminalCommand("hso-d365 -V"));

  const cliNewProject = document.getElementById("cliNewProject") as HTMLButtonElement;
  cliNewProject?.addEventListener("click", () => renderPanel("New.Project"));

  const cliUpdateProject = document.getElementById("cliUpdateProject") as HTMLButtonElement;
  cliUpdateProject?.addEventListener("click", () => renderPanel("Update.Project"));

  const cliRegenerate = document.getElementById("cliRegenerate") as HTMLButtonElement;
  cliRegenerate?.addEventListener("click", () => renderPanel("Regenerate"));

  const cliGenerateEntity = document.getElementById("cliGenerateEntity") as HTMLButtonElement;
  cliGenerateEntity?.addEventListener("click", () => renderPanel("Generate.Entity"));

  const cliGenerateWebresource = document.getElementById("cliGenerateWebresource") as HTMLButtonElement;
  cliGenerateWebresource?.addEventListener("click", () => renderPanel("Generate.Webresource"));

  const cliGenerateModel = document.getElementById("cliGenerateModel") as HTMLButtonElement;
  cliGenerateModel?.addEventListener("click", () => renderPanel("Generate.Model"));

  const cliGenerateOptionSets = document.getElementById("cliGenerateGlobalOptionSets") as HTMLButtonElement;
  cliGenerateOptionSets?.addEventListener("click", () => renderPanel("Generate.GlobalOptionSets"));

  const cliGenerateCustomApis = document.getElementById("cliGenerateCustomApis") as HTMLButtonElement;
  cliGenerateCustomApis?.addEventListener("click", () => renderPanel("Generate.CustomApis"));

  const cliGenerateEnvironmentVariable = document.getElementById("cliGenerateEnvironmentVariable") as HTMLButtonElement;
  cliGenerateEnvironmentVariable?.addEventListener("click", () => renderPanel("Generate.EnvironmentVariable"));

  const cliGenerateLicenseValidator = document.getElementById("cliGenerateLicenseValidator") as HTMLButtonElement;
  cliGenerateLicenseValidator?.addEventListener("click", () => renderPanel("Generate.LicenseValidator"));

  const cliExtractTranslation = document.getElementById("cliExtractTranslation") as HTMLButtonElement;
  cliExtractTranslation?.addEventListener("click", () => renderPanel("Tools.ExtractTranslations"));

  const cliFormsCustomizable = document.getElementById("cliFormsCustomizable") as HTMLButtonElement;
  cliFormsCustomizable?.addEventListener("click", () => renderPanel("Tools.FormsCustomizable"));

  const cliLint = document.getElementById("cliLint") as HTMLButtonElement;
  cliLint?.addEventListener("click", () => renderPanel("Build.Lint"));

  const cliBuild = document.getElementById("cliBuild") as HTMLButtonElement;
  cliBuild?.addEventListener("click", () => renderPanel("Build.Build"));

  const cliDeploy = document.getElementById("cliDeploy") as HTMLButtonElement;
  cliDeploy?.addEventListener("click", () => renderPanel("Build.Deploy"));
}

function renderPanel(panel: string) {
  vscode.postMessage({
    commandType: "Render",
    command: panel,
    text: "",
  });
}

function runTerminalCommandWithConfirmation(command: string, confirmationString: string) {
  if(confirm(confirmationString)) {
    vscode.postMessage({
      commandType: "runTerminalCommand",
      command: command,
      text: "",
    });
  }
}

function runTerminalCommand(command: string) {
  confirm(command);
  vscode.postMessage({
    commandType: "runTerminalCommand",
    command: command,
    text: "",
  });
}

function versionInfo() {
  vscode.postMessage({
    commandType: "VersionInfo",
    command: "",
    text: "",
  });
}