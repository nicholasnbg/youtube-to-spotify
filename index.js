import express from "express";
import opn from "opn";
import { getHTML, getVideoDescription } from "./lib/scraper";
import { getFirstSearchResult } from "./lib/spotify-helpers";
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
  await getTrackList().then(async trackList => {
    const trackPromises = trackList.map(async track => {
      const query = `${track.artist} ${track.title}`;
      const obj = await getFirstSearchResult(api, query);
      return obj;
    });

    const trackObjs = await Promise.all(trackPromises).then(arr => arr);
    console.log(trackObjs[0]);
  });
}

async function getTrackList() {
  const tracks = getVideoDescription(
    await getHTML("https://www.youtube.com/watch?v=88EFvUmsoJI&t=179s")
  );
  return tracks;
}

async function go() {
  opn(authURL, { app: ["google chrome"] });
}

app.listen(port, () => {
  console.log(`Express app listeing on port ${port}`);
  go();
});
