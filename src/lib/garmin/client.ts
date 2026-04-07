import crypto from 'crypto-js'
import OAuth from 'oauth-1.0a'

const CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY || ''
const CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET || ''

export const garminOAuth = new OAuth({
  consumer: {
    key: CONSUMER_KEY,
    secret: CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64)
  },
})

export const GARMIN_API = {
  requestTokenUrl: 'https://connectapi.garmin.com/oauth-service/oauth/request_token',
  authorizeUrl: 'https://connect.garmin.com/oauthConfirm',
  accessTokenUrl: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
}

/// Helper functions below

export async function fetchGarminRequestToken() {
  const request_data = {
    url: GARMIN_API.requestTokenUrl,
    method: 'POST',
  }

  const response = await fetch(request_data.url, {
    method: request_data.method,
    headers: {
      ...garminOAuth.toHeader(garminOAuth.authorize(request_data)),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Garmin RT Error: ${response.status} - ${text}`)
  }

  // Response is a urlencoded string: oauth_token=abc&oauth_token_secret=xyz
  const text = await response.text()
  const params = new URLSearchParams(text)
  return {
    oauth_token: params.get('oauth_token') || '',
    oauth_token_secret: params.get('oauth_token_secret') || '',
  }
}

export async function fetchGarminAccessToken(
  requestToken: string,
  requestSecret: string,
  verifier: string
) {
  const request_data = {
    url: GARMIN_API.accessTokenUrl,
    method: 'POST',
    data: { oauth_verifier: verifier }
  }

  const token = {
    key: requestToken,
    secret: requestSecret,
  }

  const authData = garminOAuth.authorize(request_data, token)

  const response = await fetch(request_data.url, {
    method: request_data.method,
    headers: {
      ...garminOAuth.toHeader(authData),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ oauth_verifier: verifier }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Garmin AT Error: ${response.status} - ${text}`)
  }

  const text = await response.text()
  const params = new URLSearchParams(text)
  return {
    oauth_token: params.get('oauth_token') || '',
    oauth_token_secret: params.get('oauth_token_secret') || '',
  }
}
