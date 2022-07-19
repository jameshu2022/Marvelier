import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/creators/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  let creatorRes = await fetch(url);
  let data = await creatorRes.json();
  res.status(200).json(data);
}
