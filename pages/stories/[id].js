import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout.js";
import ServerSideComicsList from "../../components/lists/ServerSideComicsList";
import ServerSideEventsList from "../../components/lists/ServerSideEventsList";
import ServerSideSeriesList from "../../components/lists/ServerSideSeriesList";

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

import RandomSpinner from "../../components/RandomSpinner";
import DetailLayout from "../../components/DetailLayout.js";
import ServerSideCharacterList from "../../components/lists/ServerSideCharacterList.js";
import Link from "next/link.js";

function StoryDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [story, setStory] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  // const thumbnailUrl =(props.details.data.results[0].thumbnail.path.slice(-9) === "available" ? "/noimageavailable.png" :
  //   props.details.data.results[0].thumbnail.path +
  //   "/detail." +
  //   props.details.data.results[0].thumbnail.extension);

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/stories/" + id + "/shortdetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setStory(data.data.results[0]);
        setThumbnailUrl(
          data.data.results[0].thumbnail == null ||
            data.data.results[0].thumbnail.path.slice(-9) === "available"
            ? "/noimageavailable.png"
            : data.data.results[0].thumbnail.path +
                "/detail." +
                data.data.results[0].thumbnail.extension
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
            obj={story}
            busy={busy}
            basicInfo={
              <BasicStoryInfo thumbnailUrl={thumbnailUrl} blurDataUrl={blurDataUrl} story={story} />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
              <GridItem>
                <ServerSideCharacterList
                  charactersList={story.characters}
                  charactersBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideComicsList
                  comicsList={story.comics}
                  comicsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideEventsList
                  eventsList={story.events}
                  eventsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideSeriesList
                  seriesList={story.series}
                  seriesBusy={false}
                />
              </GridItem>
            </Grid>
          </DetailLayout>
        </Box>
      )}
    </Layout>
  );
}

function BasicStoryInfo({ thumbnailUrl, blurDataUrl, story, ...props }) {
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
          src={thumbnailUrl == null ? notAvailableUrl : thumbnailUrl}
          alt={story.title}
          width={402}
          height={402}
          style={{ borderRadius: "5px" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </Box>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <Heading fontSize="lg">Story Info:</Heading>
        <Text paddingTop="0.25rem">
          <strong>Description: </strong>
          {story.description == "" || story.description == null
            ? "No description available."
            : story.description}
        </Text>
        <Box>
          <Heading fontSize="md" paddingTop="0.25rem">Original Issue:</Heading>
            {story.originalIssue.name == "" ||
            story.originalIssue.name == null ? (
              "No original issue available."
            ) : (
              <Link
                href={
                  "/comics/" + story.originalIssue.resourceURI.substring(43)
                }
              >
                <Text
                  textDecoration="underline"
                  cursor="pointer"
                  color={linkColor}
                >
                  {story.originalIssue.name}
                </Text>
              </Link>
            )}
        </Box>
      </Box>
    </Stack>
  );
}

export default StoryDetails;
