import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout.js";
import ServerSideComicsList from "../../components/lists/ServerSideComicsList";
import ServerSideEventsList from "../../components/lists/ServerSideEventsList";
import ServerSideSeriesList from "../../components/lists/ServerSideSeriesList";
import ServerSideStoriesList from "../../components/lists/ServerSideStoriesList";

import {
  Box,
  Heading,
  Stack,
  Grid,
  GridItem,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { default as NextImage } from "next/image";

import utilStyles from "../../styles/utils.module.css";
import ExternalLinkLi from "../../components/lists/ExternalLinkLi";
import RandomSpinner from "../../components/RandomSpinner";
import DetailLayout from "../../components/DetailLayout.js";
import ComicsList from "../../components/lists/ComicsList.js";
import InternalLinkLi from "../../components/lists/InternalLinkLi.js";
import SingleInfoDisplay from "../../components/SingleInfoDisplay.js";

function ComicDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [comic, setComic] = useState({});
  const [creatorComics, setCreatorComics] = useState({});
  const [seriesComics, setSeriesComics] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/comics/" + id + "/fulldetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setComic(data.comic);
        setSeriesComics(data.seriesComics);
        setCreatorComics(data.creatorComics);
        setThumbnailUrl(
          data.comic.thumbnail.path.slice(-9) === "available"
            ? "/noimageavailable.png"
            : data.comic.thumbnail.path +
                "/detail." +
                data.comic.thumbnail.extension
        );
        setBlurDataUrl(
          "/placeholder.png"
        );
        setBusy(false);
      })
      .catch((err) => console.log(err));
  }, [router.isReady, busy]);

  useEffect(() => {
    setBusy(true);
  }, [router.query]);

  return (
    <Layout>
      {busy && (
        <Box marginBottom="5rem">
          <RandomSpinner />
        </Box>
      )}
      {!busy && (
        <Box>
          <DetailLayout
            obj={comic}
            busy={busy}
            basicInfo={
              <BasicComicInfo
                thumbnailUrl={thumbnailUrl}
                blurDataUrl={blurDataUrl}
                comic={comic}
              />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
              <GridItem>
                <ComicsList
                  heading="Other Comics From the Series: "
                  comicsList={seriesComics}
                  comicsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ComicsList
                  heading="Other Comics From the Creators: "
                  comicsList={creatorComics}
                  comicsBusy={false}
                />
              </GridItem>
            </Grid>
          </DetailLayout>
        </Box>
      )}
    </Layout>
  );
}

function BasicComicInfo({ thumbnailUrl, blurDataUrl, comic, ...props }) {
  const linkColor = useColorModeValue("#0000EE", "white");

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

  return (
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
          placeholder="blur"
          blurDataURL={blurDataUrl}
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
              <li key={index}>{priceDict[price.type] + ": $" + price.price}</li>
            );
          })}
        </ul>
        <Heading fontSize="md">Characters:</Heading>
        <ul className={utilStyles.list}>
          {comic.characters.items.map((character, index) => {
            return (
              <InternalLinkLi
                key={index}
                href={"/characters/" + character.resourceURI.substring(47)}
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
          {comic.creators.available == 0 && <Text>No creators available.</Text>}
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
          {comic.events.available == 0 && <Text>No events available.</Text>}
        </ul>
        <Box>
          <strong>Series: </strong>
          {comic.series == null ? (
            "No series available."
          ) : (
            <Link href={"/series/" + comic.series.resourceURI.substring(43)}>
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
        <SingleInfoDisplay heading="ISBN: " infoName="isbn" info={comic.isbn} />
        <SingleInfoDisplay heading="ISSN: " infoName="issn" info={comic.issn} />
        <SingleInfoDisplay heading="UPC: " infoName="upc" info={comic.upc} />
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
                {dateDict[date.type] + ": " + date.date.substring(0, 10)}
              </li>
            );
          })}
        </ul>
        <Heading fontSize="lg">Futher Reading:</Heading>
        <ul className={utilStyles.list}>
          {comic.urls.map((url, index) => (
            <ExternalLinkLi key={index} href={url.url} color={linkColor}>
              {linkDict[url.type]}
            </ExternalLinkLi>
          ))}
        </ul>
      </Box>
    </Stack>
  );
}

export default ComicDetails;
