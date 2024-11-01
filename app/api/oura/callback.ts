
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  const clientId = 'E55QJ2DGMZUXK6TN';
  const clientSecret = process.env.OURA_CLIENT_SECRET;
  const redirectUri = 'https://example.com/callback';

  try {
    const response = await axios.post('https://api.ouraring.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const accessToken = response.data.access_token;

    // Set the token in an HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('oura_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600,  // 1 hour
      sameSite: 'strict',
      path: '/'
    }));

    res.redirect('/fetch-sleep-data');  // Redirect to the page to fetch sleep data
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'OAuth2 exchange failed' });
  }
}
