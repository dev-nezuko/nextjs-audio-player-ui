const {test,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID='offline-client';
process.env.NEXT_PUBLIC_APP_URL='http://127.0.0.1:3000';
function storage(){const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}}
global.window={location:{origin:'http://127.0.0.1:3000',href:''},dispatchEvent:()=>{}};
global.sessionStorage=storage();global.localStorage=storage();
const {redirectToSpotifyLogin,consumeOAuthTransaction,handleLogout}=require('../.test-build/utils/auth.utils.js');
const {getToken,refreshSpotifyToken}=require('../.test-build/services/auth.service.js');
const {baseService}=require('../.test-build/services/api.service.js');
beforeEach(()=>{global.sessionStorage=storage();global.localStorage=storage();global.fetch=async()=>{throw Error('Unexpected network access')}});
function transaction(created=Date.now()){sessionStorage.setItem('spotify_oauth_transaction',JSON.stringify({state:'offline-state',verifier:'offline-verifier',redirectUri:'http://127.0.0.1:3000/callback',created}))}
function response(body,status=200){return new Response(JSON.stringify(body),{status})}
test('authorization uses CSPRNG state and matching S256 challenge',async()=>{
 await redirectToSpotifyLogin();const url=new URL(window.location.href);const tx=JSON.parse(sessionStorage.getItem('spotify_oauth_transaction'));
 assert.equal(url.origin,'https://accounts.spotify.com');assert.equal(url.searchParams.get('state'),tx.state);assert.equal(tx.state.length,48);assert.equal(tx.verifier.length,64);
 assert.equal(url.searchParams.get('code_challenge'),createHash('sha256').update(tx.verifier).digest('base64url'));
 assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.equal(url.searchParams.get('redirect_uri'),tx.redirectUri);
 assert.ok(!url.searchParams.has('client_secret'));
});
test('mismatched state fails before token exchange and transaction is one-use',async()=>{
 transaction();let calls=0;global.fetch=async()=>{calls++;return response({})};
 await assert.rejects(getToken('offline-code','wrong-state'));assert.equal(calls,0);assert.equal(sessionStorage.getItem('spotify_oauth_transaction'),null);
 assert.throws(()=>consumeOAuthTransaction('offline-state'));
});
test('expired transaction fails closed',()=>{transaction(Date.now()-11*60*1000);assert.throws(()=>consumeOAuthTransaction('offline-state'))});
test('code exchange uses stored redirect and verifier without a secret',async()=>{
 transaction();global.fetch=async(url,options)=>{assert.equal(url,'https://accounts.spotify.com/api/token');assert.equal(options.body.get('code_verifier'),'offline-verifier');assert.equal(options.body.get('redirect_uri'),'http://127.0.0.1:3000/callback');assert.equal(options.body.get('client_secret'),null);return response({access_token:'offline-access',refresh_token:'offline-refresh'})};
 await getToken('offline-code','offline-state');assert.equal(sessionStorage.getItem('access_token'),'offline-access');assert.equal(localStorage.getItem('access_token'),null);
});
test('refresh preserves previous refresh token when rotation is omitted',async()=>{
 sessionStorage.setItem('refresh_token','offline-refresh');global.fetch=async()=>response({access_token:'offline-access'});await refreshSpotifyToken();assert.equal(sessionStorage.getItem('refresh_token'),'offline-refresh');
});
test('only 401 refreshes and retries the original request once',async()=>{
 sessionStorage.setItem('access_token','old-offline-access');sessionStorage.setItem('refresh_token','offline-refresh');const calls=[];
 global.fetch=async(url,options)=>{calls.push(url);if(url.includes('accounts.spotify'))return response({access_token:'new-offline-access'});if(calls.length===1)return response({},401);assert.equal(options.headers.Authorization,'Bearer new-offline-access');return response({ok:true})};
 assert.deepEqual(await baseService.get('/v1/me/tracks'),{ok:true});assert.equal(calls.length,3);assert.equal(calls[0],calls[2]);
});
test('403 does not spend a refresh attempt',async()=>{
 sessionStorage.setItem('access_token','offline-access');sessionStorage.setItem('refresh_token','offline-refresh');let calls=0;global.fetch=async()=>{calls++;return response({},403)};await assert.rejects(baseService.get('/v1/me/tracks'));assert.equal(calls,1);
});
test('a second 401 stops rather than looping',async()=>{
 sessionStorage.setItem('access_token','offline-access');sessionStorage.setItem('refresh_token','offline-refresh');let calls=0;global.fetch=async url=>{calls++;return url.includes('accounts.spotify')?response({access_token:'new-offline-access'}):response({},401)};await assert.rejects(baseService.get('/v1/me/tracks'));assert.equal(calls,3);
});
test('logout removes persistent legacy tokens and tab session',()=>{
 for(const key of ['access_token','refresh_token','code_verifier','spotify_oauth_transaction']){sessionStorage.setItem(key,'offline-fixture');localStorage.setItem(key,'offline-fixture')}
 handleLogout();assert.equal(sessionStorage.getItem('access_token'),null);assert.equal(localStorage.getItem('refresh_token'),null);
});
