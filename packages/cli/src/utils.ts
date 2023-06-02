import chalk from 'chalk';
import { exec } from 'child_process';
import figlet from 'figlet';
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
    if (os.platform() === 'win32') {
      exec('cmd.exe /c WMIC path win32_process get Name,Processid', (err, stdout) => {
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
    } else {
      exec('echo $0', (err, stdout) => {
        if (err) {
          resolve(null);
          return;
        }

        resolve(stdout.trim() || null);
      });
    }
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
  } else {
    const parentProcessName = await getProcessNameAsync(process.ppid.toString());
    if (parentProcessName?.endsWith('/sh') || parentProcessName?.endsWith('/bash')) {
      return { shell: parentProcessName, displayName: 'Bash' };
    } else if (parentProcessName?.endsWith('/tcsh')) {
      return { shell: parentProcessName, displayName: 'Tcsh' };
    } else if (parentProcessName?.endsWith('/ksh')) {
      return { shell: parentProcessName, displayName: 'Ksh' };
    } else if (parentProcessName?.endsWith('/zsh')) {
      return { shell: parentProcessName, displayName: 'Zsh' };
    } else if (parentProcessName?.endsWith('/fish')) {
      return { shell: parentProcessName, displayName: 'Fish Shell' };
    } else if (parentProcessName?.endsWith('/pwsh')) {
      return { shell: parentProcessName, displayName: 'PowerShell Core' };
    }
  }

  return null;
};

export const getGitInfoAsync = (): Promise<{ branch: string } | null> => {
  return new Promise((resolve) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
      if (err) {
        resolve(null);
        return;
      }

      resolve({ branch: stdout.trim() });
    });
  });
};

export const printAsciiArtAsync = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    figlet(text, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data) {
        // eslint-disable-next-line no-console
        console.log(chalk.yellow(data));
        resolve();
      }
    });
  });
};
