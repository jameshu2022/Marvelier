import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id, max, limit } = req.query;

  let { hashed, ts } = getApiHash();
  let randomOffset = 0;
  let newMax = max == null ? 0 : max;
  let newLimit = limit == null ? 20 : limit;
  if (newMax > newLimit) {
    let diff = newMax - newLimit;
    randomOffset = Math.floor(Math.random() * diff);
  }
  randomOffset = Math.max(randomOffset, 0);

  let url =
    "https://gateway.marvel.com:443/v1/public/characters/" +
    id +
    "/series?orderBy=modified&offset=" +
    randomOffset +
    "&limit=" +
    newLimit +
    "&ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;
  let response = await fetch(url);
  let jsonData = await response.json();
  res.status(200).send(jsonData);
}
