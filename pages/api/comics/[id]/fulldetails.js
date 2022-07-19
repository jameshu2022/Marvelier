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
            "https://gateway.marvel.com:443/v1/public/comics/" +
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
          let comic = data.data.results[0];
          async.parallel(
            {
              comic: function (parallelCallback) {
                parallelCallback(null, comic);
              },
              seriesComics: function (parallelCallback) {
                if (comic.series == null) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 30;
                  let seriesComicsUrl =
                    "https://gateway.marvel.com:443/v1/public/series/" +
                    comic.series.resourceURI.substring(43) +
                    "/comics?orderBy=issueNumber" +
                    "&limit=" +
                    limit +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(seriesComicsUrl)
                    .then((res) => res.json())
                    .then((seriesComics) =>
                      parallelCallback(null, seriesComics)
                    )
                    .catch((err) => console.log(err));
                }
              },
              creatorComics: function (parallelCallback) {
                if (comic.creators.available == 0) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let limit = 30;
                  let creatorsComicsUrl =
                    "https://gateway.marvel.com:443/v1/public/creators/" +
                    comic.creators.items[0].resourceURI.substring(45) +
                    "/comics?orderBy=-onsaleDate&limit=" +
                    limit +
                    "&ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(creatorsComicsUrl)
                    .then((res) => res.json())
                    .then((creatorComics) =>
                      parallelCallback(null, creatorComics)
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
          comic: results.comic,
          seriesComics: results.seriesComics,
          creatorComics: results.creatorComics,
        };
        resolve(data);
      }
    );
  });
  let data = await ret;
  res.status(200).json(data);
}
