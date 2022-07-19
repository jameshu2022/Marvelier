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
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { default as NextImage } from "next/image";

import utilStyles from "../../styles/utils.module.css";
import ExternalLinkLi from "../../components/lists/ExternalLinkLi";
import RandomSpinner from "../../components/RandomSpinner";
import DetailLayout from "../../components/DetailLayout.js";
import ComicsList from "../../components/lists/ComicsList.js";
import InternalLinkLi from "../../components/lists/InternalLinkLi.js";
import SingleInfoDisplay from "../../components/SingleInfoDisplay.js";

function SeriesDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [series, setSeries] = useState({});
  const [creatorComics, setCreatorComics] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/series/" + id + "/fulldetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setSeries(data.series);
        setCreatorComics(data.creatorComics);
        setThumbnailUrl(
          data.series.thumbnail.path.slice(-9) === "available"
            ? "/noimageavailable.png"
            : data.series.thumbnail.path +
                "/detail." +
                data.series.thumbnail.extension
        );
        setBlurDataUrl("/placeholder.png");
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
            obj={series}
            busy={busy}
            basicInfo={
              <BasicSeriesInfo thumbnailUrl={thumbnailUrl} blurDataUrl={blurDataUrl} series={series} />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
              <GridItem>
                <ServerSideComicsList
                  comicsList={series.comics}
                  comicsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ComicsList comicsList={creatorComics} eventsBusy={false} />
              </GridItem>
            </Grid>
          </DetailLayout>
        </Box>
      )}
    </Layout>
  );
}

function BasicSeriesInfo({ thumbnailUrl, blurDataUrl, series, ...props }) {
  const linkColor = useColorModeValue("#0000EE", "white");

  const linkDict = {
    detail: "Legacy Details (Marvel.com)",
    wiki: "Official MCU Details (Marvel.com)",
    comiclink: "Comics Link (Marvel.com)",
  };
  return (
    <Stack
      direction={{ base: "column", lg: "column" }}
      sx={{ display: "flex", padding: "5px" }}
    >
      <Box>
        <NextImage
          src={thumbnailUrl}
          alt={series.title}
          width={402}
          height={402}
          style={{ borderRadius: "5px" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
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
                href={"/characters/" + character.resourceURI.substring(47)}
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
          {series.events.available == 0 && <Text>No events available.</Text>}
        </ul>
      </Box>
    </Stack>
  );
}

export default SeriesDetails;
