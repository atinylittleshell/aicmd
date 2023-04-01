export type GetCommandRequest = {
  prompt: string;
  context: CommandContext;
};

export type CommandContext = {
  osInfo: {
    platform: 'darwin' | 'linux' | 'win32';
  };
  shellInfo: {
    shell: string;
    displayName: string;
  } | null;
};

export type GetCommandResponse = {
  command: string;
};
