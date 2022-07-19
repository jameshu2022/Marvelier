import getApiHash from "../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { offset, limit, title } = req.query;

  let { hashed, ts } = getApiHash();

  let url =
    "https://gateway.marvel.com:443/v1/public/comics?orderBy=focDate&titleStartsWith=" +
    title +
    "&limit=" +
    limit +
    "&ts=" +
    ts +
    "&offset=" +
    offset +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  let dataRes = await fetch(url);
  let data = await dataRes.json();
  res.status(200).json(data);
}
