import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getApiHash from "../../../util/getApiHash";

import Layout from "../../../components/Layout.js";
import ServerSideComicsList from "../../../components/lists/ServerSideComicsList";
import ServerSideEventsList from "../../../components/lists/ServerSideEventsList";
import ServerSideSeriesList from "../../../components/lists/ServerSideSeriesList";
import ServerSideCharacterList from "../../../components/lists/ServerSideCharacterList";

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
import InternalLinkLi from "../../../components/lists/InternalLinkLi";
import Link from "next/link";

function StoryDetails(props) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [comicsList, setComicsList] = useState({});
  const [comicsBusy, setComicsBusy] = useState(true);

  const [eventsList, setEventsList] = useState({});
  const [eventsBusy, setEventsBusy] = useState(true);

  const [seriesList, setSeriesList] = useState({});
  const [seriesBusy, setSeriesBusy] = useState(true);

  const [storiesList, setStoriesList] = useState({});
  const [storiesBusy, setStoriesBusy] = useState({});

  const linkColor = useColorModeValue("#0000EE", "white");
  const borderColor = useColorModeValue("purple.200", "purple.600");

  const { id } = router.query;

  const linkDict = {
    detail: "Legacy Details (Marvel.com)",
    wiki: "Official MCU Details (Marvel.com)",
    comiclink: "Comics Link (Marvel.com)",
  };
  // console.log(props.details);
  // console.log(props.characterComics);
  // console.log(props.characterEvents);
  // console.log(props.characterSeries);
  // console.log(props.characterStories);
  const story = props.details.data.results[0];

  const imageFinished = () => {
    // console.log("FINISHED");
    setImageLoaded(true);
  };

  const thumbnailUrl = null;
  if (props.details.data.results[0].thumbnail != null) {
    props.details.data.results[0].thumbnail.path +
      "/detail." +
      props.details.data.results[0].thumbnail.extension;
  }

  const notAvailableUrl =
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/detail.jpg";

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
          <GridItem colSpan={{base : 1, md : 3}}>
            <Heading sx={{ padding: "2px 2px 4px 4px" }}>{story.title}</Heading>
          </GridItem>
          <GridItem colSpan={1}>
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
                  onLoad={(e) => {
                    e.target.src.indexOf("data:image/gif;base64") < 0 &&
                      imageFinished();
                  }}
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
                  <Text paddingTop="0.25rem">
                    <strong>Original Issue: </strong>
                    {story.originalIssue.name == "" ||
                    story.originalIssue.name == null ? (
                      "No original issue available."
                    ) : (
                      <Link
                        href={"/comics/" + story.originalIssue.resourceURI.substring(43)}
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
                  </Text>
                </Box>
                <Box>
                  <Text><strong>Creators: </strong></Text>
                  <ul className={utilStyles.list}>
                    {story.creators.items.map((creator, index) => (
                      <InternalLinkLi
                      key={index}
                        index={index}
                        href={creator.resourceURI.substring(45)}
                        color={linkColor}
                      >
                        {creator.name + " (" + creator.role + ")"}
                      </InternalLinkLi>
                    ))}
                  </ul>
                </Box>
              </Box>
            </Stack>
          </GridItem>

          <GridItem>
            <Box sx={{ paddingLeft: "0.5rem" }}>
              <Heading fontSize="3xl">You might like...</Heading>
              <Grid gridTemplateColumns={{base : "1fr", md : "1fr 1fr"}} gap={1}>
                <GridItem>
                  <ServerSideCharacterList
                    heading="Characters:"
                    charactersList={story.characters}
                    charactersBusy={false}
                  />
                </GridItem>
                <GridItem>
                  <ServerSideComicsList
                    heading="Other Comics From the Story: "
                    comicsList={story.comics}
                    comicsBusy={false}
                  />
                </GridItem>
                <GridItem>
                  <ServerSideSeriesList
                    heading="Series: "
                    seriesList={story.series}
                    seriesBusy={false}
                  />
                </GridItem>
                <GridItem>
                  <ServerSideEventsList
                    heading="Events: "
                    eventsList={story.events}
                    eventsBusy={false}
                  />
                </GridItem>
              </Grid>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
}

async function getUserDetails(id) {
  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/stories/" +
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
  let res = await getUserDetails(id);
  let details = await res.json();

  // console.log("details " + details);
  return {
    props: {
      details,
    },
  };
}

export default StoryDetails;
