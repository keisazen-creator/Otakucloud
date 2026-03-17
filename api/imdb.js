export default async function handler(req, res) {

const API_KEY = "fdc7143eae0ef3d0484e1fb87056c";

const cache = global.cache || (global.cache = {});
const title = req.query.title;

if (!title) {
return res.status(400).json({ error: "No title" });
}

/* CACHE */
if (cache[title]) {
return res.json(cache[title]);
}

try {

/* SEARCH TMDB */
const searchRes = await fetch(
`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
);

const searchData = await searchRes.json();

if (!searchData.results.length) {
return res.json({ error: "Not found" });
}

const tmdbId = searchData.results[0].id;

/* GET IMDB */
const detailRes = await fetch(
`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${API_KEY}&append_to_response=external_ids`
);

const detailData = await detailRes.json();

const imdb = detailData.external_ids.imdb_id;

const result = {
imdbID: imdb,
type: "series"
};

cache[title] = result;

return res.json(result);

} catch (e) {
return res.json({ error: "Server error" });
}
}