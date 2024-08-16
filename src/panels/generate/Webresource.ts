import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../../utilities/getUri";
import { getNonce } from "../../utilities/getNonce";
import { runTerminalCommand } from "../../utilities/execution";
import { MainScreen } from "../MainScreen";


export class Webresource {
    public static currentPanel: Webresource | undefined;
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
      if (Webresource.currentPanel) {
        Webresource.currentPanel._panel.reveal(ViewColumn.One);
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
  
        Webresource.currentPanel = new Webresource(panel, extensionUri);
      }
    }

    public dispose() {
      Webresource.currentPanel = undefined;
        this._panel.dispose();
  
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
  
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
      const webviewUri = getUri(webview, extensionUri, ["out", "webresource.js"]);
      const image = getUri(webview, extensionUri, ["out", "logo.png"]);
      const nonce = getNonce();
  
      return /*html*/ `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob: data:; script-src 'nonce-${nonce}'; style-src ${webview.cspSource};">
  <title>HSO D365 CLI Extension - Generate Webresource</title>
</head>
<body>
  <img nonce="${nonce}" src="${image}" alt="HSO Logo" height="50">
  <h1>HSO D365 Extension</h1>
  <h2>Generate Webresource</h2>
  <p>Command 'generate Webresource [name]' generates a Webresource. Via a prompt a template can be chosen:</p>
  <ul>
    <li>HTML</li>
    <li>React</li>
  </ul>
  <p>An entry will be added for the webpack.config.js file.</p>
  
  <vscode-text-field id="webresourceName">Webresource Name</vscode-text-field>&nbsp;<span>The name of the entity</span><br /><br />
  
  <vscode-radio-group id="webresourceTemplate">
    <label slot="label">Template</label>
    <vscode-radio value="HTML" checked>HTML</vscode-radio>
    <vscode-radio value="React">React</vscode-radio>
  </vscode-radio-group><br /><br />
  
  <vscode-button appearance="secondary" id="help">Help</vscode-button>&nbsp;&nbsp;
  <vscode-button appearance="secondary" id="cancel">Cancel</vscode-button>&nbsp;&nbsp;
  <vscode-button id="submit">Submit</vscode-button>&nbsp;&nbsp;
  <vscode-button appearance="secondary" id="back">Back</vscode-button>
  
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