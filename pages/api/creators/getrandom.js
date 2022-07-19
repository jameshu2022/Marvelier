import getApiHash from "../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { limit, max } = req.query;

  let randomOffset = Math.floor(Math.random() * max);
  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/creators?orderBy=modified&limit=" +
    limit +
    "&offset=" +
    randomOffset +
    "&ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  let dataRes = await fetch(url);
  let data = await dataRes.json();
  res.status(200).json(data);
}
