import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getApiHash from "../../../util/getApiHash";

import Layout from "../../../components/Layout.js";
import ComicsList from "../../../components/lists/ComicsList";
import EventsList from "../../../components/lists/EventsList";
import SeriesList from "../../../components/lists/SeriesList";
import StoriesList from "../../../components/lists/StoriesList";

import {
  Box,
  Heading,
  Spinner,
  Stack,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { default as NextImage } from "next/image";

import utilStyles from "../../../styles/utils.module.css";
import Link from "next/link";
import SingleInfoDisplay from "../../../components/SingleInfoDisplay";
import ExternalLinkLi from "../../../components/lists/ExternalLinkLi";
import InternalLinkLi from "../../../components/lists/InternalLinkLi";
import ServerSideComicsList from "../../../components/lists/ServerSideComicsList";
import RandomSpinner from "../../../components/RandomSpinner";

function SeriesDetails(props) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const [creatorComics, setCreatorComics] = useState({});
  const [creatorComicsBusy, setCreatorComicsBusy] = useState(true);

  const linkColor = useColorModeValue("#0000EE", "white");
  const borderColor = useColorModeValue("purple.200", "purple.600");

  const { id } = router.query;

  const dateDict = {
    onsaleDate: "On Sale Date",
    focDate: "Final Order Cutoff Date",
    unlimitedDate: "Marvel Unlimited Release Date",
    digitalPurchaseDate: "Digital Purchase Date",
  };

  const priceDict = {
    printPrice: "Print Price",
    digitalPurchasePrice: "Digital Price",
  };

  const linkDict = {
    detail: "Details (Marvel.com)",
    wiki: "Wiki (Marvel.com)",
    comiclink: "Comics Link (Marvel.com)",
    purchase: "Purchase (ComicStore.marvel.com)",
    reader: "Reader (Marvel.com)",
  };
  // console.log(props.details);
  // console.log(props.comicComics);
  // console.log(props.comicEvents);
  // console.log(props.comicSeries);
  // console.log(props.comicStories);
  const series = props.details.data.results[0];

  const imageFinished = () => {
    // console.log("FINISHED");
    setImageLoaded(true);
  };

  const thumbnailUrl =(props.details.data.results[0].thumbnail.path.slice(-9) === "available" ? "/noimageavailable.png" :
    props.details.data.results[0].thumbnail.path +
    "/detail." +
    props.details.data.results[0].thumbnail.extension);

  const blurUrl =
    props.details.data.results[0].thumbnail.path +
    "/portrait_small." +
    props.details.data.results[0].thumbnail.extension;

  useEffect(() => {
    setCreatorComicsBusy(true);
    let url = "/api/series/" + id + "/fulldetails";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setCreatorComics(data.creatorComics);
        setCreatorComicsBusy(false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <Layout>
      {!imageLoaded && (
        <Box>
          <Spinner color="purple.500" size="xl" sx={{ marginLeft: "50%" }} />
        </Box>
      )}
      <Box
        border="6px solid"
        borderColor={borderColor}
        borderRadius="8px"
        visibility={imageLoaded ? "" : "hidden"}
      >
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={0}>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Heading sx={{ padding: "2px 2px 4px 4px" }}>
              {series.title}
            </Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <Stack
              direction={{ base: "column", lg: "column" }}
              sx={{ display: "flex", padding: "5px" }}
            >
              <Box>
                {/* <Image
                                    src={thumbnailUrl}
                                    alt={comic.name}
                                    onLoad={() => {
                                        setImageLoaded(true);
                                    }}
                                    borderRadius="5px"
                                /> */}

                <NextImage
                  src={thumbnailUrl}
                  alt={series.title}
                  width={402}
                  height={402}
                  style={{ borderRadius: "5px" }}
                  onLoad={(e) => {
                    e.target.src.indexOf("data:image/gif;base64") < 0 &&
                      imageFinished();
                  }}
                  blurDataURL={blurUrl}
                  placeholder="blur"
                />
              </Box>
              <Box sx={{ paddingTop: "0.5rem" }}>
                <Heading fontSize="lg">Series Info:</Heading>
                <Text paddingTop="0.25rem">
                  <strong>Description: </strong>
                  {series.description == "" || series.description == null
                    ? "No description available."
                    : series.description}
                </Text>
                <SingleInfoDisplay
                  heading="Start Year: "
                  infoName="start year"
                  info={series.startYear}
                />
                <SingleInfoDisplay
                  heading="End Year: "
                  infoName="end year"
                  info={series.endYear}
                />
                <Heading fontSize="md">Characters:</Heading>
                <ul className={utilStyles.list}>
                  {series.characters.items.map((character, index) => {
                    return (
                      <InternalLinkLi
                        key={index}
                        href={
                          "/characters/" + character.resourceURI.substring(47)
                        }
                        color={linkColor}
                      >
                        {character.name}
                      </InternalLinkLi>
                    );
                  })}
                  {series.characters.available == 0 && (
                    <Text>No characters available.</Text>
                  )}
                </ul>
                <Heading fontSize="md">Creators:</Heading>
                <ul className={utilStyles.list}>
                  {series.creators.items.map((creator, index) => {
                    return (
                      <InternalLinkLi
                        key={index}
                        href={"/creators/" + creator.resourceURI.substring(45)}
                        color={linkColor}
                      >
                        {creator.name + " (" + creator.role + ")"}
                      </InternalLinkLi>
                    );
                  })}
                  {series.creators.available == 0 && (
                    <Text>No creators available.</Text>
                  )}
                </ul>
                <Heading fontSize="md">Events:</Heading>
                <ul className={utilStyles.list}>
                  {series.events.items.map((event, index) => {
                    return (
                      <InternalLinkLi
                        key={index}
                        href={"/events/" + event.resourceURI.substring(43)}
                        color={linkColor}
                      >
                        {event.name}
                      </InternalLinkLi>
                    );
                  })}
                  {series.events.available == 0 && (
                    <Text>No events available.</Text>
                  )}
                </ul>
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Box sx={{ paddingLeft: "0.5rem" }}>
              <Heading fontSize="3xl">You might like...</Heading>
              {!creatorComicsBusy && (
                <Grid
                  gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={1}
                >
                  <GridItem>
                    <ServerSideComicsList
                      heading="Other Comics From the Series: "
                      comicsList={series.comics}
                      comicsBusy={false}
                    />
                  </GridItem>

                  <GridItem>
                    <ComicsList
                      heading="Other Comics From the Creators: "
                      comicsList={creatorComics}
                      comicsBusy={creatorComicsBusy}
                    />
                  </GridItem>
                </Grid>
              )}
              {creatorComicsBusy && <RandomSpinner />}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
}

async function getSeriesDetails(id) {
  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/series/" +
    id +
    "?ts=" +
    ts +
    "&apikey=" +
    process.env.PUBLIC_API_KEY +
    "&hash=" +
    hashed;
  // console.log("myurl " + url);
  return fetch(url);
}

export async function getServerSideProps({ query }) {
  let id = query.id;
  let res = await getSeriesDetails(id);
  let details = await res.json();

  // console.log("details " + details);
  return {
    props: {
      details,
    },
  };
}

export default SeriesDetails;
