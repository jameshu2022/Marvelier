import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

var async = require("async");

function getData(type, dataList, modifiers, id, limit) {
  let { hashed, ts } = getApiHash();

  let randomOffset = 0;
  let newMax = dataList.available == null ? 0 : dataList.available;
  let newLimit = limit == null ? 20 : limit;
  if (newMax > newLimit) {
    let diff = newMax - newLimit;
    randomOffset = Math.floor(Math.random() * diff);
  }
  randomOffset = Math.max(randomOffset, 0);

  let characterInfoUrl =
    "https://gateway.marvel.com:443/v1/public/characters/" +
    id +
    "/" +
    type +
    "?offset=" +
    randomOffset +
    "&limit=" +
    newLimit +
    +"&" +
    modifiers +
    "&ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;

  return fetch(characterInfoUrl);
}

export default async function handler(req, res) {
  const { id, limit } = req.query;

  let { hashed, ts } = getApiHash();

  let ret = new Promise((resolve, reject) => {
    async.waterfall(
      [
        function (callback) {
          let url =
            "https://gateway.marvel.com:443/v1/public/characters/" +
            id +
            "?ts=" +
            ts +
            "&apikey=" +
            process.env.PUBLIC_API_KEY +
            "&hash=" +
            hashed;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              callback(null, data);
            })
            .catch((err) => console.log(err));
        },
        function (data, callback) {
          let character = data.data.results[0];
          async.parallel(
            {
              characterComics: function (parallelCallback) {
                if (
                  character.comics.available == 0 ||
                  character.comics.items == null ||
                  character.comics.items.length == 0
                ) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  getData(
                    "comics",
                    character.comics,
                    "orderBy=modified",
                    id,
                    limit
                  )
                    .then((res) => res.json())
                    .then((characterComics) =>
                      parallelCallback(null, characterComics)
                    )
                    .catch((err) => console.log(err));
                }
              },
              characterEvents: function (parallelCallback) {
                if (
                  character.events.available == 0 ||
                  character.events.items == null ||
                  character.events.items.length == 0
                ) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  getData(
                    "events",
                    character.events,
                    "orderBy=modified",
                    id,
                    limit
                  )
                    .then((res) => res.json())
                    .then((characterComics) =>
                      parallelCallback(null, characterComics)
                    )
                    .catch((err) => console.log(err));
                }
              },
            },
            function mainParallelCallback(err, results) {
              if (err) {
                reject(err);
              }
              callback(null, results);
            }
          );
        },
      ],
      function (err, results) {
        if (err) {
          reject(err);
        }
        let data = {
          characterComics: results.characterComics,
        };
        resolve(data);
      }
    );
  });

  let data = await ret;
  res.status(200).json(data);
}
