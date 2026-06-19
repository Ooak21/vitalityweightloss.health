// Vitality — Convex-native auth (Milestone B). Vanilla JS, no React.
// Replaces the shared-Supabase JWT bridge with @convex-dev/auth (Password provider).
// Identity now lives entirely on the Convex deployment — one vendor in the HIPAA boundary.
//
// Verified against the live dev deployment (quixotic-cat-492) 2026-06-16:
//   sign-in  -> client.action('auth:signIn', {provider:'password', params:{email,password,flow:'signIn'}})
//   response -> { tokens: { token /* RS256 access JWT, ~60min */, refreshToken } }
//   refresh  -> client.action('auth:signIn', { refreshToken })
//   sign-out -> client.action('auth:signOut', {})
//   staff role resolves server-side from the users table via verifyAuth:staffProbe -> { role }
//
// Session isolation (do NOT merge): staff pages use STORE_STAFF, patient pages STORE_PATIENT,
// so staff + patient can be logged in side by side and never cross-drop (same rule the old
// sb-vit-staff / sb-vit-patient split enforced).

const CONVEX_CLOUD = 'https://quixotic-cat-492.convex.cloud';
export const STORE_STAFF   = 'vca-vit-staff';
export const STORE_PATIENT = 'vca-vit-patient';

let _ClientCtor = null;
async function newClient(){
  if(!_ClientCtor){ const m = await import('https://esm.sh/convex@1.41.0/browser'); _ClientCtor = m.ConvexHttpClient; }
  return new _ClientCtor(CONVEX_CLOUD);
}

function read(storeKey){ try { return JSON.parse(localStorage.getItem(storeKey) || 'null'); } catch(_){ return null; } }
function write(storeKey, tokens){ localStorage.setItem(storeKey, JSON.stringify({ token: tokens.token, refreshToken: tokens.refreshToken })); }

// True if the JWT is missing or within 60s of expiry.
function nearExpiry(token){
  try { const p = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'); const c = JSON.parse(atob(p)); return (c.exp*1000 - Date.now()) < 60000; }
  catch(_){ return true; }
}

// Sign in with email + password; stores { token, refreshToken } under storeKey. Throws on failure.
export async function signIn(email, password, storeKey){
  const c = await newClient();
  const res = await c.action('auth:signIn', { provider:'password', params:{ email, password, flow:'signIn' } });
  const t = res && res.tokens;
  if(!t || !t.token) throw new Error('Sign-in failed');
  write(storeKey, t);
  return t.token;
}

// Create a new patient account (email + password) and store the session. Throws if the
// email already has an account (Convex Password signUp rejects duplicates) — no overwrite,
// which is the account-takeover fix vs the old vit-portal-signup.
export async function signUp(email, password, storeKey){
  const c = await newClient();
  const res = await c.action('auth:signIn', { provider:'password', params:{ email, password, flow:'signUp' } });
  const t = res && res.tokens;
  if(!t || !t.token) throw new Error('Sign-up failed');
  write(storeKey, t);
  return t.token;
}

// Return a valid access token, refreshing if near expiry. Null if no/expired session that can't refresh.
export async function getToken(storeKey){
  const stored = read(storeKey);
  if(!stored || !stored.token) return null;
  if(nearExpiry(stored.token)){
    if(!stored.refreshToken){ localStorage.removeItem(storeKey); return null; }
    try {
      const c = await newClient();
      const res = await c.action('auth:signIn', { refreshToken: stored.refreshToken });
      const t = res && res.tokens;
      if(t && t.token){ write(storeKey, t); return t.token; }
      localStorage.removeItem(storeKey); return null;
    } catch(_){ localStorage.removeItem(storeKey); return null; }
  }
  return stored.token;
}

// Sign out (best-effort server revoke) and clear local session.
export async function signOut(storeKey){
  const stored = read(storeKey);
  try { if(stored && stored.token){ const c = await newClient(); c.setAuth(stored.token); await c.action('auth:signOut', {}); } } catch(_){ }
  localStorage.removeItem(storeKey);
}

// Staff guard: returns the role string for a valid staff session, or null (no session / not staff).
// Mirrors the server requireStaff gate — a patient token returns null here.
export async function staffRole(storeKey){
  const token = await getToken(storeKey);
  if(!token) return null;
  try {
    const c = await newClient(); c.setAuth(token);
    const probe = await c.query('verifyAuth:staffProbe', {});
    return (probe && probe.role) ? probe.role : null;
  } catch(_){ return null; }
}
