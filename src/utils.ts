import { exec } from 'child_process';
import os from 'os';
import readline from 'readline';

export const readStdinAsync = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readlineInterface.question(question, (answer) => {
      readlineInterface.close();
      resolve(answer);
    });
  });
};

const processNameMatcher = /^(\S+)\s+(\S+)$/;

export const getProcessNameAsync = (pid: string): Promise<string | null> => {
  return new Promise((resolve) => {
    exec('cmd /c WMIC path win32_process get Name,Processid', (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }

      const lines = stdout.split('\n');
      const processInfo = lines
        .map((line) => line.trim().toLowerCase())
        .map((line) => {
          const match = processNameMatcher.exec(line);
          if (match) {
            const [name, id] = match.slice(1);
            return { name, id };
          }
          return null;
        })
        .filter((item) => item && item.id === pid);
      if (processInfo.length >= 1) {
        resolve(processInfo[0]?.name || '');
        return;
      }

      resolve(null);
    });
  });
};

export type ShellInfo = {
  shell: string;
  displayName: string;
};

export const getCurrentShellAsync = async (): Promise<ShellInfo | null> => {
  if (os.platform() === 'win32') {
    if (process.ppid) {
      const parentProcessName = await getProcessNameAsync(process.ppid.toString());
      if (parentProcessName === 'cmd.exe') {
        return { shell: 'cmd.exe', displayName: 'Command Prompt' };
      } else if (parentProcessName === 'powershell.exe') {
        return { shell: 'powershell.exe', displayName: 'PowerShell' };
      } else if (parentProcessName === 'pwsh.exe') {
        return { shell: 'pwsh.exe', displayName: 'PowerShell Core' };
      }
    }
  }

  return null;
};
