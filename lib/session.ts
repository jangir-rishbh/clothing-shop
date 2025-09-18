import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev_insecure_secret_change_me';

export type SessionPayload = {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  exp: number; // epoch seconds
};

export function signSession(payload: Omit<SessionPayload, 'exp'>, ttlSeconds = 60 * 60 * 24 * 7) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body: SessionPayload = { ...payload, exp };
  const json = JSON.stringify(body);
  const data = Buffer.from(json).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
    if (!timingSafeEqual(sig, expected)) return null;
    const json = Buffer.from(data, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as SessionPayload;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
