import dotenv from "dotenv";

import express from "express";
import opn from "opn";
import { getHTML, getVideoDescription, getVideoTitle } from "./lib/scraper";
import {
  getFirstSearchResult,
  createPlaylist,
  addTracksToPlaylist,
  getUserId
} from "./lib/spotify-helpers";
import { spotifyApi, authURL } from "./lib/spotify-auth";

const app = express();
const port = "8888";

app.get("/", (req, res) => res.send(authURL));

app.get("/callback", (req, res) => {
  const code = req.query.code;

  spotifyApi.authorizationCodeGrant(code).then(
    data => {
      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);

      nextFunction(spotifyApi);
    },
    function(err) {
      console.log(err);
    }
  );
});

async function nextFunction(api) {
  const html = await getHTML(
    "https://www.youtube.com/watch?v=88EFvUmsoJI&t=179s"
  );
  await getTrackList(html).then(async trackList => {
    const trackPromises = trackList.map(async track => {
      const query = `${track.artist} ${track.title}`;
      const obj = await getFirstSearchResult(api, query);
      return obj;
    });

    const trackObjs = await Promise.all(trackPromises).then(arr => arr);
    const videoTitle = getVideoTitle(html);

    const userId = await getUserId(api);

    console.log("creating playlist...");
    const playlist = await createPlaylist(api, userId, videoTitle);
    const { id: playlistId } = playlist;
    const trackURIs = trackObjs.map(track => track.uri);
    api
      .addTracksToPlaylist(playlistId, trackURIs)
      .then(res => console.log(res))
      .catch(err => console.log({ err }));
  });
}

async function getTrackList(html) {
  const tracks = getVideoDescription(html);
  return tracks;
}

async function go() {
  opn(authURL, { app: ["google chrome"] });
}

app.listen(port, () => {
  console.log(`Express app listeing on port ${port}`);
  go();
});
