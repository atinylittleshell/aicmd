import { NextApiRequest, NextApiResponse } from 'next/types';

import { createAccessToken, getUserAsync } from '../../utils/serverUtils';

export default async function api(
  request: NextApiRequest,
  response: NextApiResponse<{
    accessToken: string;
  }>,
) {
  // only allow GET requests
  if (request.method !== 'GET') {
    response.status(405).end();
    return;
  }

  const user = await getUserAsync(request);
  if (!user) {
    response.status(401).end();
    return;
  }

  const accessToken = createAccessToken(user);
  response.status(200).json({ accessToken });
}
