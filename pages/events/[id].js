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
import CreatorsList from "../../components/lists/CreatorsList.js";
import SeriesList from "../../components/lists/SeriesList.js";
import CharactersList from "../../components/lists/CharactersList.js";

function SeriesDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [event, setEvent] = useState({});
  const [eventCharacters, setEventCharacters] = useState({});
  const [eventComics, setEventComics] = useState({});
  const [eventCreators, setEventCreators] = useState({});
  const [eventSeries, setEventSeries] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/events/" + id + "/fulldetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setEvent(data.event);
        setEventCharacters(data.eventCharacters);
        setEventComics(data.eventComics);
        setEventCreators(data.eventCreators);
        setEventSeries(data.eventSeries);
        setThumbnailUrl(
          data.event.thumbnail.path.slice(-9) === "available"
            ? "/noimageavailable.png"
            : data.event.thumbnail.path +
                "/detail." +
                data.event.thumbnail.extension
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
            obj={event}
            busy={busy}
            basicInfo={
              <BasicEventInfo thumbnailUrl={thumbnailUrl} blurDataUrl={blurDataUrl} event={event} />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
            <GridItem>
                <CharactersList
                  charactersList={eventCharacters}
                  charactersBusy={false}
                />
              </GridItem>

              <GridItem>
                <ComicsList comicsList={eventComics} comicsBusy={false} />
              </GridItem>

              <GridItem>
                <CreatorsList creatorsList={eventCreators} creatorsBusy={false} />
              </GridItem>

              <GridItem>
                <SeriesList seriesList={eventSeries} seriesBusy={false} />
              </GridItem>
            </Grid>
          </DetailLayout>
        </Box>
      )}
    </Layout>
  );
}

function BasicEventInfo({ thumbnailUrl, blurDataUrl, event, ...props }) {
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
          alt={event.title}
          width={402}
          height={402}
          style={{ borderRadius: "5px" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </Box>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <Heading fontSize="lg">Event Info:</Heading>
        <Text paddingTop="0.25rem">
          <strong>Description: </strong>
          {(event.description == "" || event.description == null)
            ? "No description available."
            : event.description}
        </Text>
        <SingleInfoDisplay
          heading="Start Date: "
          infoName="start date"
          info={event.start.substring(0, 10)}
        />
        <SingleInfoDisplay
          heading="End Date: "
          infoName="end date"
          info={event.end.substring(0, 10)}
        />
      </Box>
    </Stack>
  );
}

export default SeriesDetails;
