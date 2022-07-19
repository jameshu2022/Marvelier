import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link.js";

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

import { useListView } from "./../../components/ListView.js";
import ToggleListView from "./../../components/ToggleListView.js";
import CharacterBox from "./../../components/CharacterBox";
import RandomSpinner from "../../components/RandomSpinner.js";

function Search(props) {
  const router = useRouter();
  const listView = useListView();

  const [searchArray, setSearchArray] = useState([]);
  const [offset, setOffset] = useState(31);
  const [increment, setIncrement] = useState(10);
  const [busy, setBusy] = useState(true);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);

  const handleGetMore = () => {
    setLoadMoreBusy(true);
    getMore(router.query.characterName, offset, increment)
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
    const { characterName } = router.query;
    let url =
      "/api/characters/loadmore?limit=" +
      30 +
      "&offset=" +
      0 +
      "&name=" +
      characterName;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSearchArray(data.data.results);
        setBusy(false);
      })
      .catch((err) => console.log(err));
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
            {searchArray.map((character) => (
              <li key={character.id}>
                <Link href={"/characters/" + character.id}>
                  {character.name}
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
              {searchArray.map((character, index) => (
                <GridItem key={index}>
                  <CharacterBox key={index} character={character} />
                </GridItem>
              ))}
            </Grid>
            {(searchArray.length == 0 || searchArray == null) && (
              <Text>No Results {":("}</Text>
            )}
          </Box>
        )}
        {!busy && searchArray.length == 0 && <Text>No results {":("}</Text>}
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
      </Box>
    </Layout>
  );
}

function getMore(name, offset, increment) {
  let url =
    "/api/characters/loadmore?limit=" +
    increment +
    "&offset=" +
    offset +
    "&name=" +
    name;
  return fetch(url);
}

export default Search;
