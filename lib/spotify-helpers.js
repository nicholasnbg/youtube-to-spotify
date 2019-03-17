async function getFirstSearchResult(api, searchTerm) {
  const results = await api.search(searchTerm, ["track"], { limit: 5 });
  const firstRes = results.body.tracks.items[0];

  const trackInfo = {
    name: firstRes.name,
    artist: firstRes.artists[0].name,
    id: firstRes.id,
    uri: firstRes.uri
  };
  return trackInfo ? trackInfo : null;
}

async function getUserId(api) {
  const id = await api.getMe().then(data => {
    return data.body.id;
  });
  return id;
}

async function createPlaylist(api, userId, title) {
  const playlist = await api
    .createPlaylist(userId, title)
    .then(req => {
      return req.body;
    })
    .catch(err => console.log(err));
  return playlist;
}

async function addTracksToPlaylist(api, ownerId, playlistId, trackURIs) {
  console.log({ ownerId, playlistId, trackURIs });
  // await api.addTracksToPlaylist(ownerId, playlistId, `${trackURIs}`);
}

export { getFirstSearchResult, createPlaylist, addTracksToPlaylist, getUserId };
