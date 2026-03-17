import { ANIME } from "@consumet/extensions";

const gogo = new ANIME.Gogoanime();

export default async function handler(req, res) {
  const { action, query, id, episode } = req.query;

  try {

    // 🔍 SEARCH
    if (action === "search") {
      if (!query) return res.status(400).json({ error: "Missing query" });

      const data = await gogo.search(query);
      return res.status(200).json(data);
    }

    // 📺 ANIME INFO
    if (action === "info") {
      if (!id) return res.status(400).json({ error: "Missing id" });

      const data = await gogo.fetchAnimeInfo(id);
      return res.status(200).json(data);
    }

    // ▶ WATCH
    if (action === "watch") {
      if (!episode) return res.status(400).json({ error: "Missing episode" });

      const data = await gogo.fetchEpisodeSources(episode);
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Invalid action" });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}