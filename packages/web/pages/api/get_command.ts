import { CommandContext } from 'aicmd-shared/src/types';
import { NextApiRequest, NextApiResponse } from 'next/types';
import Statsig from 'statsig-node';

import { getCommandAsync } from '../../utils/openai';
import { getUserAsync } from '../../utils/serverUtils';

export default async function api(
  request: NextApiRequest,
  response: NextApiResponse<{
    command?: string;
    error?: string;
  }>,
) {
  // only allow POST requests
  if (request.method !== 'POST') {
    response.status(405).end();
    return;
  }

  const user = await getUserAsync(request);
  if (!user) {
    response.status(401).end();
    return;
  }

  const requestBody = request.body as
    | {
        prompt?: string;
        context?: CommandContext;
      }
    | undefined;
  if (!requestBody || !requestBody.prompt || !requestBody.context) {
    response.status(400).end();
    return;
  }

  await Statsig.initialize(process.env.STATSIG_API_KEY ?? '', {
    environment: {
      tier: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    },
  });

  try {
    const result = await getCommandAsync(requestBody.prompt, requestBody.context);

    Statsig.logEvent(
      {
        userID: user.id,
        email: user.email,
      },
      'get_command',
      undefined,
      {
        prompt: requestBody.prompt,
        command: result.command,
      },
    );

    response.status(200).json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    response.status(500).json({ error: e.message });
  }
}
