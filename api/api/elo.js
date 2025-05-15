export default async function handler(req, res) {
  const { nick } = req.query;
  if (!nick) return res.status(400).send("❌ Укажи ник ?nick=");

  const apiKey = process.env.FACEIT_API_KEY;
  if (!apiKey) return res.status(500).send("❌ Нет API ключа");

  try {
    const playerInfo = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nick}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    }).then(r => r.json());

    const playerId = playerInfo.player_id;

    const stats = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/stats/csgo`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    }).then(r => r.json());

    const elo = stats.lifetime['FACEIT Elo'];
    res.status(200).send(`ELO: ${elo}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("❌ Ошибка при получении ELO");
  }
}

