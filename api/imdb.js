export default async function handler(req, res) {

const API_KEY = "fdc7143eae0ef3d73d0484e1fb87056c";

/* SIMPLE CACHE */
const cache = global.cache || (global.cache = {});
const title = req.query.title?.toLowerCase();

if (!title) {
return res.status(400).json({ error: "No title provided" });
}

/* RETURN FROM CACHE */
if (cache[title]) {
return res.json(cache[title]);
}

try {

/* COMMON FETCH OPTIONS */
const options = {
headers: {
"Content-Type": "application/json"
}
};

/* 1️⃣ TRY TV FIRST */
let searchRes = await fetch(
`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(title)}`,
options
);

let searchData = await searchRes.json();

/* 2️⃣ FALLBACK TO MOVIE IF EMPTY */
if (!searchData.results || searchData.results.length === 0) {

searchRes = await fetch(
`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`,
options
);

searchData = await searchRes.json();

if (!searchData.results || searchData.results.length === 0) {
return res.json({ error: "Not found in TMDB" });
}
}

/* GET FIRST RESULT */
const tmdbId = searchData.results[0].id;
const mediaType = searchData.results[0].media_type || (searchData.results[0].name ? "tv" : "movie");

/* 3️⃣ GET EXTERNAL IDS */
const detailRes = await fetch(
`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${API_KEY}&append_to_response=external_ids`,
options
);

const detailData = await detailRes.json();

const imdb = detailData?.external_ids?.imdb_id;

/* VALIDATE */
if (!imdb) {
return res.json({ error: "No IMDB ID found" });
}

/* RESULT */
const result = {
imdbID: imdb,
type: mediaType === "tv" ? "series" : "movie"
};

/* SAVE CACHE */
cache[title] = result;

return res.json(result);

} catch (err) {

/* DEBUG ERROR */
return res.status(500).json({
error: "Server error",
message: err.message
});
}
}