
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oura_access_token } = req.cookies;

  if (!oura_access_token) {
    return res.status(401).json({ error: 'Missing Oura Ring token' });
  }

  try {
    const response = await axios.get('https://api.ouraring.com/v1/sleep', {
      headers: {
        Authorization: `Bearer ${oura_access_token}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    res.status(500).json({ error: 'Failed to fetch sleep data' });
  }
}
