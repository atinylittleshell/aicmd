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
