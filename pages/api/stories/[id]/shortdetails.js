import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let storyUrl =
    "https://gateway.marvel.com:443/v1/public/stories/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  // console.log(storyUrl);
  let storyRes = await fetch(storyUrl);
  let data = await storyRes.json();
  res.status(200).json(data);
}
