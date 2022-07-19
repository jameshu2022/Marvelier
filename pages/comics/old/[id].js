import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getApiHash from "../../../util/getApiHash";

import Layout from "../../../components/Layout.js";
import ComicsList from "../../../components/lists/ComicsList";

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
import RandomSpinner from "../../../components/RandomSpinner";

function ComicDetails(props) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [comicsList, setComicsList] = useState({});
  const [comicsBusy, setComicsBusy] = useState(true);

  const [creatorComicsList, setCreatorComicsList] = useState({});
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
  const comic = props.details.data.results[0];

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
    setComicsBusy(true);
    setCreatorComicsBusy(true);
    let url = "/api/comics/" + id + "/fulldetails";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setComicsList(data.seriesComics);
        setComicsBusy(false);
        setCreatorComicsList(data.creatorComics);
        setCreatorComicsBusy(false);
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <Layout>
      {!imageLoaded && (
        <Box>
          <Spinner color={borderColor} size="xl" sx={{ marginLeft: "50%" }} />
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
            <Heading sx={{ padding: "2px 2px 4px 4px" }}>{comic.title}</Heading>
          </GridItem>
          <GridItem colSpan={1}>
            <Stack
              direction={{ base: "column", lg: "column" }}
              sx={{ display: "flex", padding: "5px" }}
            >
              <Box>
                <NextImage
                  src={thumbnailUrl}
                  alt={comic.name}
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
              <Box sx={{ paddingTop: "1rem" }}>
                <Heading fontSize="lg">Comic Info:</Heading>
                <Text>
                  <strong>Description: </strong>
                  {comic.description == "" || comic.description == null
                    ? "No description available."
                    : comic.description}
                </Text>
                <Heading fontSize="md">Prices:</Heading>
                <ul className={utilStyles.list}>
                  {comic.prices.map((price, index) => {
                    return (
                      <li key={index}>
                        {priceDict[price.type] + ": $" + price.price}
                      </li>
                    );
                  })}
                </ul>
                <Heading fontSize="md">Characters:</Heading>
                <ul className={utilStyles.list}>
                  {comic.characters.items.map((character, index) => {
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
                  {comic.characters.available == 0 && (
                    <Text>No characters available.</Text>
                  )}
                </ul>
                <Heading fontSize="md">Creators:</Heading>
                <ul className={utilStyles.list}>
                  {comic.creators.items.map((creator, index) => {
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
                  {comic.creators.available == 0 && (
                    <Text>No creators available.</Text>
                  )}
                </ul>
                <Heading fontSize="md">Events:</Heading>
                <ul className={utilStyles.list}>
                  {comic.events.items.map((event, index) => {
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
                  {comic.events.available == 0 && (
                    <Text>No events available.</Text>
                  )}
                </ul>
                <Box>
                  <strong>Series: </strong>
                  {comic.series == null ? (
                    "No series available."
                  ) : (
                    <Link
                      href={"/series/" + comic.series.resourceURI.substring(43)}
                    >
                      {/* <a className={utilStyles.infoLink}>{comic.series.name}</a> */}
                      <Text
                        color={linkColor}
                        textDecoration="underline"
                        cursor="pointer"
                      >
                        {comic.series.name}
                      </Text>
                    </Link>
                  )}
                </Box>
                <SingleInfoDisplay
                  heading="Format: "
                  infoName="format"
                  info={comic.format}
                />
                <SingleInfoDisplay
                  heading="Page Count: "
                  infoName="page count"
                  info={comic.pageCount}
                />
                <SingleInfoDisplay
                  heading="ISBN: "
                  infoName="isbn"
                  info={comic.isbn}
                />
                <SingleInfoDisplay
                  heading="ISSN: "
                  infoName="issn"
                  info={comic.issn}
                />
                <SingleInfoDisplay
                  heading="UPC: "
                  infoName="upc"
                  info={comic.upc}
                />
                <SingleInfoDisplay
                  heading="Diamond Code: "
                  infoName="diamond code"
                  info={comic.diamondCode}
                />
                <Heading fontSize="md">Dates:</Heading>
                <ul className={utilStyles.list}>
                  {comic.dates.map((date, index) => {
                    return (
                      <li key={index}>
                        {dateDict[date.type] +
                          ": " +
                          date.date.substring(0, 10)}
                      </li>
                    );
                  })}
                </ul>
                <Heading fontSize="lg">Futher Reading:</Heading>
                <ul className={utilStyles.list}>
                  {comic.urls.map((url, index) => (
                    <ExternalLinkLi
                      key={index}
                      href={url.url}
                      color={linkColor}
                    >
                      {linkDict[url.type]}
                    </ExternalLinkLi>
                  ))}
                </ul>
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Box sx={{ paddingLeft: "0.5rem" }}>
              <Heading fontSize="3xl">You might like...</Heading>
              {!comicsBusy && !creatorComicsBusy && (
                <Grid
                  gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={1}
                >
                  <GridItem>
                    <ComicsList
                      heading="Other Comics From the Series: "
                      comicsList={comicsList}
                      comicsBusy={comicsBusy}
                    />
                  </GridItem>

                  <GridItem>
                    <ComicsList
                      heading="Other Comics From the Creators: "
                      comicsList={creatorComicsList}
                      comicsBusy={creatorComicsBusy}
                    />
                  </GridItem>
                </Grid>
              )}
              {(comicsBusy || creatorComicsBusy) && <RandomSpinner />}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
}

async function getComicDetails(id) {
  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/comics/" +
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
  let res = await getComicDetails(id);
  let details = await res.json();

  // console.log("details " + details);
  return {
    props: {
      details,
    },
  };
}

export default ComicDetails;
