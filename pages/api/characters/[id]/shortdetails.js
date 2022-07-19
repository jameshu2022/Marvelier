import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let characterUrl =
    "https://gateway.marvel.com:443/v1/public/characters/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

    // console.log(characterUrl);
  let characterRes = await fetch(characterUrl);
  let data = await characterRes.json();
  res.status(200).json(data);
}
