import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let eventUrl =
    "https://gateway.marvel.com:443/v1/public/events/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  let eventRes = await fetch(eventUrl);
  let data = await eventRes.json();
  res.status(200).json(data);
}
