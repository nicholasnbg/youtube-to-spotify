const SpotifyWebApi = require("spotify-web-api-node");

const scopes = [
  "playlist-modify-private",
  "user-read-private",
  "playlist-modify-public",
  "playlist-read-private"
];
const state = "default";

let spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:8888/callback"
});

const authURL = spotifyApi.createAuthorizeURL(scopes, state);

export { spotifyApi, authURL };
