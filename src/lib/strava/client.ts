export const STRAVA_API_URL = 'https://www.strava.com/api/v3'
export const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize'
export const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'

export function getStravaAuthUrl(redirectUri: string) {
  const clientId = process.env.STRAVA_CLIENT_ID
  if (!clientId) throw new Error('STRAVA_CLIENT_ID is not configured')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'force',
    scope: 'read,activity:read_all', // Scope to read user profile and activities
  })

  return `${STRAVA_AUTH_URL}?${params.toString()}`
}

export async function exchangeStravaCode(code: string) {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Strava credentials missing')
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to exchange Strava token: ${err}`)
  }

  return response.json()
}

export async function refreshStravaToken(refreshToken: string) {
  const clientId = process.env.STRAVA_CLIENT_ID
  const clientSecret = process.env.STRAVA_CLIENT_SECRET

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Strava token')
  }

  return response.json()
}

export async function getStravaActivity(activityId: string, accessToken: string) {
  const response = await fetch(`${STRAVA_API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Strava activity')
  }

  return response.json()
}
