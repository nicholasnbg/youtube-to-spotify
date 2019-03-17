async function getFirstSearchResult(api, searchTerm) {
  const results = await api.search(searchTerm, ["track"], { limit: 5 });
  const firstRes = results.body.tracks.items[0];

  const trackInfo = {
    name: firstRes.name,
    artist: firstRes.artists[0].name,
    id: firstRes.id
  };
  return trackInfo ? trackInfo : null;
}

export { getFirstSearchResult };
