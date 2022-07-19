import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let seriesUrl =
    "https://gateway.marvel.com:443/v1/public/series/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  let seriesRes = await fetch(seriesUrl);
  let data = await seriesRes.json();
  res.status(200).json(data);
}
