/* eslint-disable @typescript-eslint/naming-convention */
import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import * as vscode from 'vscode';
import * as path from 'path';
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { runTerminalCommand, runExecSyncGetOutput} from "../utilities/execution";
import * as New from "./new";
import * as Generate from "./generate";
import * as Tools from "./tools";
import * as Build from "./build";


export class MainScreen {
    public static currentPanel: MainScreen | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private _extensionUri: Uri;
    private commandMap: { [key: string]: () => void } = {
      "New.Project": () => New.Project.render(this._extensionUri),
      "Update.Project": () => New.UpdateProject.render(this._extensionUri),
      "Regenerate": () => New.Regenerate.render(this._extensionUri),
      "Generate.Entity": () => Generate.Entity.render(this._extensionUri),
      "Generate.Webresource": () => Generate.Webresource.render(this._extensionUri),
      "Generate.Model": () => Generate.Model.render(this._extensionUri),
      "Generate.GlobalOptionSets": () => Generate.GlobalOptionSets.render(this._extensionUri),
      "Generate.CustomApis": () => Generate.CustomApis.render(this._extensionUri),
      "Generate.EnvironmentVariable": () => Generate.EnvironmentVariable.render(this._extensionUri),
      "Generate.LicenseValidator": () => Generate.LicenseValidator.render(this._extensionUri),
      "Tools.ExtractTranslations": () => Tools.ExtractTranslations.render(this._extensionUri),
      "Tools.FormsCustomizable": () => Tools.FormsCustomizable.render(this._extensionUri),
      "Build.Lint": () => Build.Lint.render(this._extensionUri),      
      "Build.Build": () => Build.Build.render(this._extensionUri),
      "Build.Deploy": () => Build.Deploy.render(this._extensionUri),
     
    };

    private constructor(panel: WebviewPanel, extensionUri: Uri) {
      this._extensionUri = extensionUri;
      this._panel = panel;
      this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
      this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
      this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri) {
      if (MainScreen.currentPanel) {
        MainScreen.currentPanel._panel.reveal(ViewColumn.One);
      } else {
        const panel = window.createWebviewPanel(
          "showInfoScreen",
          "HSO D365 CLI Extension Main",
          ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [Uri.joinPath(extensionUri, "out")],
          }
        );
  
        MainScreen.currentPanel = new MainScreen(panel, extensionUri);
      }
    }

    public dispose() {
        MainScreen.currentPanel = undefined;
        this._panel.dispose();
  
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
  
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
      const webviewUri = getUri(webview, extensionUri, ["out", "main.js"]);
      const image = getUri(webview, extensionUri, ["out", "logo.png"]);
      const nonce = getNonce();
  
      return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
            <title>HSO D365 CLI Extension</title>
          </head>
          <body>
            <img nonce="${nonce}" src="${image}" alt="HSO Logo" height="50">
            <h1>HSO D365 Extension</h1>
            <h2>Introduction</h2>
            <p>HSO D365 Extension is a wrapper arround the HSO D365 command line interface or D365 Project Development based on&nbsp;<a href="https://www.hso.com/" rel="nofollow">HSO</a>&nbsp;best practices.</p>
            <p>It will set up a namespaced project for Forms and Webresources development including some utils for Annotation, WebApi, Base64, etcetera. The project uses TypeScript and&nbsp;<a href="https://www.npmjs.com/package/@types/xrm" rel="nofollow">Xrm DefinitelyTyped</a>&nbsp;intellisense. For entities, it can generate entity forms including methods for getting tabs, controls, attributes. For entities, it can generate models. The entity model can be used for intellisense and helps with odata. The project has a Translation util class and the&nbsp;<a href="https://github.com/hso-nn/d365-cli/wiki/Translations">translation command</a>&nbsp;generates Resx file. The deployment will set/remove dependencies to webresource files. Building obfuscated code and deploying to the D365 Solution can be done in a few commands.</p>
            <vscode-divider role="presentation"></vscode-divider>
            <h2>General</h2>
            <vscode-button id="cliVersionInfo">Version Info</vscode-button>
            <br><br>
            <b>Install</b><br><br>
            <vscode-button id="cliInstallNPM">NPM</vscode-button>
            <vscode-button id="cliInstallYARN">YARN</vscode-button>
            <br><br>
            <b>Update</b><br><br>
            <vscode-button id="cliUpdateNPM">NPM</vscode-button>
            <vscode-button id="cliUpdateYARN">YARN</vscode-button>
            <br><br>
            <vscode-divider role="presentation"></vscode-divider>
            <p>
            <h2>Commands</h2>
            <b>Project</b><br><br>
            <vscode-button id="cliNewProject">New Project</vscode-button>
            <vscode-button id="cliUpdateProject">Update Project</vscode-button>
            <vscode-button id="cliRegenerate">Regenerate</vscode-button><br><br>
            <b>Generate</b><br><br>
            <vscode-button id="cliGenerateEntity">Entity</vscode-button>
            <vscode-button id="cliGenerateWebresource">Webresource</vscode-button>
            <vscode-button id="cliGenerateModel">Model</vscode-button>
            <vscode-button id="cliGenerateGlobalOptionSets">GlobalOptionSets</vscode-button>
            <vscode-button id="cliGenerateCustomApis">CustomApis</vscode-button>
            <vscode-button id="cliGenerateEnvironmentVariable">EnvironmentVariable</vscode-button>
            <vscode-button id="cliGenerateLicenseValidator">LicenseValidator</vscode-button><br><br>
            <b>Tools</b><br><br>
            <vscode-button id="cliExtractTranslation">Extract-Translations</vscode-button>
            <vscode-button id="cliFormsCustomizable">Forms-Customizable</vscode-button><br><br>
            <b>Build</b><br><br>
            <vscode-button id="cliLint">Lint</vscode-button>
            <vscode-button id="cliBuild">Build</vscode-button>
            <vscode-button id="cliDeploy">Deploy</vscode-button>
            <br><br>
            <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
            </p>
          </body>
        </html>
      `;
    }

    
    
    private _setWebviewMessageListener(webview: Webview) {
      webview.onDidReceiveMessage(
        (message: any) => {
          const commandType = message.commandType;
          const command = message.command;
          const text = message.text;
    
          switch (commandType) {
            case "runTerminalCommand":
              runTerminalCommand(command);
              return;
            case "Render":
              const commandMap = this.commandMap;
              commandMap[command]();
              this.dispose();
              return;
            case "VersionInfo":
              const cliVersionInstalled = runExecSyncGetOutput("hso-d365 -V");
              const cliVersionLatest = runExecSyncGetOutput("npm view @hso/d365-cli version");
              window.showInformationMessage(`Installed Version: ${cliVersionInstalled}\n Latest Version: ${cliVersionLatest}`);
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }