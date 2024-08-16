import { window } from "vscode";
import * as cp from "child_process";

export function runTerminalCommand(command: any) {
    const terminals = window.terminals;
    if (!terminals.length) {
      let terminal = window.createTerminal(`HSO D365 CLI Extension`);
      terminal.show();
      terminal.sendText(`${command}`);
    } else {
      terminals.map((a) => {
        if (a.name === 'HSO D365 CLI Extension') {
          a.show();
          a.sendText(`${command}`);
          return true; 
        } else {
          a.show();
          a.sendText(`${command}`);
        }
      });
    }
  }

  const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
      cp.exec(cmd, (err, out) => {
        if (err) {
          return resolve(cmd+' error!');
          //or,  reject(err);
        }
        return resolve(out);
      });
    });

  export async function getTerminalPath() {
    // get the current path from the terminal
    const currentPath = await execShell('powershell pwd');

    // use the currentPath as needed
    // ...

    // return the current path
    return currentPath;
  }

  export function runExecSyncShowOutput(command: any, text: any) {
    const output = cp.execSync(command);
    window.showInformationMessage(text + output.toString());
  }

  export function runExecSyncNoOutput(command: any) {
    cp.execSync(command);
  }

  export function runExecSyncGetOutput(command: any) {
    try {
      return cp.execSync(command).toString();
    } catch (error) { 
      return "";
    }
  }

