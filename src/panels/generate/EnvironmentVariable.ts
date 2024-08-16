import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../../utilities/getUri";
import { getNonce } from "../../utilities/getNonce";
import { runTerminalCommand } from "../../utilities/execution";
import { MainScreen } from "../MainScreen";


export class EnvironmentVariable {
    public static currentPanel: EnvironmentVariable | undefined;
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
      if (EnvironmentVariable.currentPanel) {
        EnvironmentVariable.currentPanel._panel.reveal(ViewColumn.One);
      } else {
        const panel = window.createWebviewPanel(
          "showInfoScreen",
          "HSO D365 CLI Extension Generate Entity",
          ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [Uri.joinPath(extensionUri, "out")],
          }
        );
  
        EnvironmentVariable.currentPanel = new EnvironmentVariable(panel, extensionUri);
      }
    }

    public dispose() {
      EnvironmentVariable.currentPanel = undefined;
        this._panel.dispose();
  
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
  
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
      const webviewUri = getUri(webview, extensionUri, ["out", "environmentvariable.js"]);
      const image = getUri(webview, extensionUri, ["out", "logo.png"]);
      const nonce = getNonce();
  
      return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
            <title>HSO D365 CLI Extension - Generate Environment Variable</title>
          </head>
          <body>
          <img nonce="${nonce}" src="${image}" alt="HSO Logo" height="50">
          <h1>HSO D365 Extension</h1>
          <h2>Generate Environment Variable</h2>
          <p>Command 'generate EnvironmentVariable' generates a folder EnvironmentVariable.</p>
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
            case "Submit":
              runTerminalCommand(command);
              this.dispose();
              return;
            case "Back":
              MainScreen.render(this._extensionUri);
              this.dispose();
              return;
          }
        },
        undefined,
        this._disposables
      );
    }
  }