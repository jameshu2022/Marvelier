import getApiHash from "../../../../util/getApiHash";
import fetch from "node-fetch";

var async = require("async");

export default async function handler(req, res) {
  const { id } = req.query;

  let { hashed, ts } = getApiHash();

  let promise = new Promise((resolve, reject) => {
    async.waterfall(
      [
        function (callback) {
          let url =
            "https://gateway.marvel.com:443/v1/public/series/" +
            id +
            "?ts=" +
            ts +
            "&apikey=" +
            process.env.PUBLIC_API_KEY +
            "&hash=" +
            hashed;
          fetch(url)
            .then((res) => res.json())
            .then((data) => callback(null, data))
            .catch((err) => console.log(err));
        },
        function (data, callback) {
          let series = data.data.results[0];
          async.parallel(
            {
              series: function (parallelCallback) {
                parallelCallback(null, series);
              },
              creatorComics: function (parallelCallback) {
                if (series.creators.available == 0 || series.creators == null) {
                  parallelCallback(null, { data: { count: 0, results: [] } });
                } else {
                  let randomIndex = Math.floor(
                    Math.random() * series.creators.items.length
                  );
                  let currentCreator = series.creators.items[randomIndex];
                  let url =
                    currentCreator.resourceURI +
                    "/comics?ts=" +
                    ts +
                    "&apikey=" +
                    process.env.PUBLIC_API_KEY +
                    "&hash=" +
                    hashed;
                  fetch(url)
                    .then((res) => res.json())
                    .then((data) => parallelCallback(null, data))
                    .catch((err) => console.log(err));
                }
              },
            },
            function seriesParallelCallback(err, results) {
              if (err) reject(err);

              callback(null, results);
            }
          );
        },
      ],
      function (err, results) {
        if (err) reject(err);

        resolve(results);
      }
    );
  });

  let data = await promise;
  res.status(200).json(data);
}
