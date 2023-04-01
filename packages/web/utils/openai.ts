import { CommandContext, GetCommandResponse } from 'aicmd-shared/src/types';
import { OSPlatformMapping } from 'aicmd-shared/src/utils';

type OpenAIChatResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
};

const longCommandExtractor = /```\w*\s*(\S[^`]*\S)\s*```/g;
const shortCommandExtractor = /(?<!`)`([^`]+)`(?!`)/g;

export const getCommandAsync = async (prompt: string, context: CommandContext): Promise<GetCommandResponse> => {
  const requestPayload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You can only respond with a single-line shell command in a single code block. ' +
          'Do not write anything outside of the code block.',
      },
      {
        role: 'user',
        content: `Write a ${
          context.shellInfo ? context.shellInfo.displayName : 'shell'
        } command that can complete the following task on ${OSPlatformMapping[context.osInfo.platform]}: ${prompt}`,
      },
    ],
    temperature: 0.2,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestPayload),
  });

  if (response.ok) {
    const chatResponse = (await response.json()) as OpenAIChatResponse;

    const chatResponseContent = chatResponse.choices[0].message.content;
    // ChatGPT can return a multi-line code block, a single-line code block, or no code block at all.
    // The following logic deals with these different cases.
    let commandMatch: string[] | null = longCommandExtractor.exec(chatResponseContent);
    if (!commandMatch) {
      commandMatch = shortCommandExtractor.exec(chatResponseContent);
    }
    if (!commandMatch && !chatResponseContent.includes('`')) {
      // if the response doesn't even contain a code block at all, assume the whole response is a command
      commandMatch = ['', chatResponseContent];
    }

    if (commandMatch) {
      return { command: commandMatch[1] };
    }

    throw new Error(chatResponseContent);
  }

  throw new Error(`OpenAI API returned status code ${response.status}: ${response.statusText}`);
};
