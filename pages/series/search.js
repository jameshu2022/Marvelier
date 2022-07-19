import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link.js";

import getApiHash from "../../util/getApiHash.js";

import Layout from "./../../components/Layout.js";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import utilStyles from "../../styles/utils.module.css";
import { useListView } from "../../components/ListView.js";
import ToggleListView from "../../components/ToggleListView.js";
import SeriesBox from "../../components/SeriesBox";
import RandomSpinner from "../../components/RandomSpinner.js";

function Search(props) {
  const router = useRouter();
  const listView = useListView();

  const [searchArray, setSearchArray] = useState([]);
  const [offset, setOffset] = useState(21);
  const [increment, setIncrement] = useState(10);
  const [busy, setBusy] = useState(true);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);

  const handleGetMore = () => {
    setLoadMoreBusy(true);
    getMore(router.query.seriesTitle, offset, increment)
      .then((res) => res.json())
      .then((data) => {
        let combinedArray = searchArray.concat(data.data.results);
        setSearchArray(combinedArray);
        setOffset(offset + increment);
        setLoadMoreBusy(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let { seriesTitle } = router.query;
    let url =
      "/api/series/loadmore?limit=" +
      20 +
      "&offset=" +
      0 +
      "&title=" +
      seriesTitle;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSearchArray(data.data.results);
        setBusy(false);
      });
  }, [router.isReady, busy]);

  useEffect(() => {
    setBusy(true);
  }, [router.query]);

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading sx={{ paddingBottom: "1rem" }}>Search Results</Heading>
        <ToggleListView />
      </Box>

      {busy && (
        <Box marginBottom="5rem">
          <RandomSpinner />
        </Box>
      )}

      <Box sx={{ marginTop: "1rem" }}>
        {!busy && listView.listView && (
          <ul className={utilStyles.list}>
            {searchArray.map((series) => (
              <li key={series.id}>
                <Link href={"/creators/" + series.id}>
                  {series.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!busy && !listView.listView && (
          <Box>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr",
                xl: "1fr 1fr 1fr",
              }}
              gap={2}
            >
              {searchArray.map((series, index) => (
                <GridItem key={index}>
                  <SeriesBox key={index} series={series} />
                </GridItem>
              ))}
            </Grid>
            {(searchArray.length == 0 || searchArray == null) && (
              <Text>No Results {":("}</Text>
            )}
          </Box>
        )}
        {!busy && searchArray.length == 0 && <Text>No results {":("}</Text>}
      </Box>
      {!busy && (
        <Box padding="10px" width="100%">
          <Button marginLeft="40%" onClick={handleGetMore}>
            Load More
          </Button>
          {loadMoreBusy && (
            <Spinner marginLeft="8px" color="purple.500" size="sm" />
          )}
        </Box>
      )}
    </Layout>
  );
}

function getMore(seriesTitle, offset, increment) {
  let url =
    "/api/series/loadmore?limit=" +
    increment +
    "&offset=" +
    offset +
    "&title=" +
    seriesTitle;
  return fetch(url);
}

export default Search;
