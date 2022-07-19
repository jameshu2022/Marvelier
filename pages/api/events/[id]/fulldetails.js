import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

var async = require("async");

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let ret = new Promise((resolve, reject) => {
    async.waterfall(
      [
        function (callback) {
          let url =
            "https://gateway.marvel.com:443/v1/public/events/" +
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
          let event = data.data.results[0];
          async.parallel(
            {
              event: function (parallelCallback) {
                parallelCallback(null, event);
              },
              eventComics: function (parallelCallback) {
                if (event.comics == null || event.comics.available == 0) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 14;
                  let max = event.comics.available;
                  let randomOffset = Math.floor(Math.random() * (max - limit));
                  randomOffset = Math.max(0, randomOffset);
                  let eventComicsUrl =
                    "https://gateway.marvel.com:443/v1/public/events/" +
                    id +
                    "/comics?orderBy=issueNumber" +
                    "&limit=" +
                    limit +
                    "&offset=" +
                    randomOffset +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  // console.log(eventComicsUrl);
                  fetch(eventComicsUrl)
                    .then((res) => res.json())
                    .then((eventComics) => parallelCallback(null, eventComics))
                    .catch((err) => console.log(err));
                }
              },
              eventCharacters: function (parallelCallback) {
                if (
                  event.characters.available == 0 ||
                  event.characters == null
                ) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 14;
                  let max = event.characters.available;
                  let randomOffset = Math.floor(Math.random() * (max - limit));
                  randomOffset = Math.max(0, randomOffset);
                  let eventCharactersUrl =
                    "https://gateway.marvel.com:443/v1/public/events/" +
                    id +
                    "/characters?orderBy=modified&limit=" +
                    limit +
                    "&offset=" +
                    randomOffset +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(eventCharactersUrl)
                    .then((res) => res.json())
                    .then((eventCharacters) =>
                      parallelCallback(null, eventCharacters)
                    )
                    .catch((err) => console.log(err));
                }
              },
              eventCreators: function (parallelCallback) {
                if (event.creators.available == 0 || event.creators == null) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 14;
                  let max = event.creators.available;
                  let randomOffset = Math.floor(Math.random() * (max - limit));
                  randomOffset = Math.max(0, randomOffset);
                  let eventCreatorsUrl =
                    "https://gateway.marvel.com:443/v1/public/events/" +
                    id +
                    "/creators?orderBy=modified&limit=" +
                    limit +
                    "&offset=" +
                    randomOffset +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(eventCreatorsUrl)
                    .then((res) => res.json())
                    .then((eventCreators) =>
                      parallelCallback(null, eventCreators)
                    )
                    .catch((err) => console.log(err));
                }
              },
              eventSeries: function (parallelCallback) {
                if (event.series.available == 0 || event.series == null) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 14;
                  let max = event.series.available;
                  let randomOffset = Math.floor(Math.random() * (max - limit));
                  randomOffset = Math.max(0, randomOffset);
                  let eventSeriesUrl =
                    "https://gateway.marvel.com:443/v1/public/events/" +
                    id +
                    "/series?orderBy=modified&limit=" +
                    limit +
                    "&offset=" +
                    randomOffset +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(eventSeriesUrl)
                    .then((res) => res.json())
                    .then((eventSeries) => parallelCallback(null, eventSeries))
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
          event: results.event,
          eventComics: results.eventComics,
          eventCharacters: results.eventCharacters,
          eventCreators: results.eventCreators,
          eventSeries: results.eventSeries,
        };
        resolve(data);
      }
    );
  });
  let data = await ret;
  res.status(200).json(data);
}
