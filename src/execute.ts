/* eslint-disable no-console */
import axios from 'axios';

type ChatResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
};

export const executeAsync = async (prompt: string) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You can only respond with a single-line shell command in a code block.' },
        { role: 'user', content: `Give me a shell command that can complete the following task: ${prompt}` },
      ],
      temperature: 0.1,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
  );

  if (response.status === 200) {
    const chatResponse = response.data as ChatResponse;
    console.log(chatResponse.choices[0].message.content);
  } else {
    console.error(response.statusText);
  }
};
