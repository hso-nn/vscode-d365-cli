import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../../utilities/getUri";
import { getNonce } from "../../utilities/getNonce";
import { runTerminalCommand, runExecSyncNoOutput, runExecSyncShowOutput, getTerminalPath } from "../../utilities/execution";
import { MainScreen } from "../MainScreen";


export class Project {
    public static currentPanel: Project | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    private _extensionUri: Uri;
    
  
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._extensionUri = extensionUri;
      this._panel = panel;
      this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
      this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
      this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri) {
      if (Project.currentPanel) {
        Project.currentPanel._panel.reveal(ViewColumn.One);
      } else {
        const panel = window.createWebviewPanel(
          "showInfoScreen",
          "HSO D365 CLI Extension New Project",
          ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [Uri.joinPath(extensionUri, "out")],
          }
        );
  
        Project.currentPanel = new Project(panel, extensionUri);
      }
    }

    public dispose() {
      Project.currentPanel = undefined;
        this._panel.dispose();
  
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
  
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
      const webviewUri = getUri(webview, extensionUri, ["out", "project.js"]);
      const image = getUri(webview, extensionUri, ["out", "logo.png"]);
      const nonce = getNonce();
      const currentPath = getTerminalPath();
  
      return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
            <title>HSO D365 CLI Extension - New Project</title>
          </head>
          <body>
          <img nonce="${nonce}" src="${image}" alt="HSO Logo" height="50">
          <h1>HSO D365 Extension</h1>
          <h2>New Project</h2>
          <p>Creates a new project. Make sure the solution and publisher name matches exactly the ones in your D365 environment. A new folder /Webresources will be created. The Webresources folder will be your project root. Execute other commands from there.</p>
          <vscode-text-field id="projectName">Project Name</vscode-text-field>&nbsp;<i>Spaces are not allowed in the project name</i><br><br>
          <vscode-text-field id="environment">Environment</vscode-text-field>&nbsp;<i>D365 environment url (eg. https://yourproject.crm4.dynamics.com)</i><br>
          <vscode-text-field id="deploySolution">Deploy Solution</vscode-text-field>&nbsp;<i>D365 deployment Solution ('Name' column)</i><br>
          <vscode-text-field id="generateSolution">Generate Solution</vscode-text-field>&nbsp;<i>D365 generate Solution ('Name' column). If equal to deployment Solution keep blank</i><br>
          <vscode-text-field id="publisherName">Publisher Name</vscode-text-field>&nbsp;<i>D365 Publisher Name (not Display Name)</i><br>
          <vscode-text-field id="publisherPrefix">Publisher Prefix</vscode-text-field>&nbsp;<i>D365 Publisher Prefix (3 chars a-z)</i><br>
          <vscode-text-field id="namespace">Namespace</vscode-text-field>&nbsp;<i>Customer or Product name</i><br><br>
          <vscode-button appearance="secondary" id="help">Help</vscode-button>&nbsp;&nbsp;<vscode-button appearance="secondary" id="cancel">Cancel</vscode-button>&nbsp;&nbsp;<vscode-button id="submit">Submit</vscode-button>&nbsp;&nbsp;<vscode-button appearance="secondary" id="back">Back</vscode-button>
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
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
            case "showError":
                window.showErrorMessage(text);
              return;
            case "Cancel":
              this.dispose();
              return;
            case "Back":
              MainScreen.render(this._extensionUri);
              this.dispose();
              return;
            case "Submit":
              runTerminalCommand(command);
              runTerminalCommand(`cd ${text}`);
              runTerminalCommand(`cd Webresources`);
              runTerminalCommand('code -r .');
              this.dispose();
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }