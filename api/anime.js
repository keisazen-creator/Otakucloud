import { ANIME } from "@consumet/extensions";

const gogo = new ANIME.Gogoanime();

export default async function handler(req, res) {
  const { action, query, id, episode } = req.query;

  try {
    // 🔍 SEARCH
    if (action === "search") {
      const data = await gogo.search(query);
      return res.json(data);
    }

    // 📺 ANIME INFO
    if (action === "info") {
      const data = await gogo.fetchAnimeInfo(id);
      return res.json(data);
    }

    // ▶ WATCH
    if (action === "watch") {
      const data = await gogo.fetchEpisodeSources(episode);
      return res.json(data);
    }

    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}