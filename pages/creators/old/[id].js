import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getApiHash from "../../../util/getApiHash";

import Layout from "../../../components/Layout.js";

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
import ExternalLinkLi from "../../../components/lists/ExternalLinkLi";
import RandomSpinner from "../../../components/RandomSpinner";
import ServerSideComicsList from "../../../components/lists/ServerSideComicsList";
import ServerSideEventsList from "../../../components/lists/ServerSideEventsList";
import ServerSideSeriesList from "../../../components/lists/ServerSideSeriesList";
import ServerSideStoriesList from "../../../components/lists/ServerSideStoriesList";

function CreatorDetails(props) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [comicsList, setComicsList] = useState({});
  const [comicsBusy, setComicsBusy] = useState(false);

  const [eventsList, setEventsList] = useState({});
  const [eventsBusy, setEventsBusy] = useState(false);

  const [seriesList, setSeriesList] = useState({});
  const [seriesBusy, setSeriesBusy] = useState(false);

  const [storiesList, setStoriesList] = useState({});
  const [storiesBusy, setStoriesBusy] = useState(false);

  const linkColor = useColorModeValue("#0000EE", "white");

  const { id } = router.query;

  const linkDict = {
    detail: "Legacy Details (Marvel.com)",
    wiki: "Official MCU Details (Marvel.com)",
    comiclink: "Comics Link (Marvel.com)",
  };
  // console.log(props.details);
  // console.log(props.creatorComics);
  // console.log(props.creatorEvents);
  // console.log(props.creatorSeries);
  // console.log(props.creatorStories);
  const creator = props.details.data.results[0];

  const imageFinished = () => {
    // console.log("FINISHED");
    setImageLoaded(true);
  };

  const thumbnailUrl =(props.details.data.results[0].thumbnail.path.slice(-9) === "available" ? "/noimageavailable.png" :
    props.details.data.results[0].thumbnail.path +
    "/detail." +
    props.details.data.results[0].thumbnail.extension);

  return (
    <Layout>
      {!imageLoaded && (
        <Box>
          <Spinner color="purple.500" size="xl" sx={{ marginLeft: "50%" }} />
        </Box>
      )}
      <Box
        border="6px solid"
        borderColor="purple.200"
        borderRadius="8px"
        visibility={imageLoaded ? "" : "hidden"}
      >
        <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={0}>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Heading sx={{ padding: "2px 2px 4px 4px" }}>
              {creator.firstName + " " + creator.lastName}
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
                                    alt={creator.name}
                                    onLoad={() => {
                                        setImageLoaded(true);
                                    }}
                                    borderRadius="5px"
                                /> */}

                <NextImage
                  loader={() => thumbnailUrl}
                  src={thumbnailUrl}
                  alt={creator.firstName + " " + creator.lastName}
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
                <Heading fontSize="lg" paddingTop>
                  Creator Info:
                </Heading>
                <Heading fontSize="lg">Futher Reading:</Heading>
                <ul className={utilStyles.list}>
                  {creator.urls.map((url, index) => (
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
            <Heading fontSize="3xl">You might like...</Heading>
            {!comicsBusy && !eventsBusy && !seriesBusy && !storiesBusy && (
              <Box sx={{ paddingLeft: "0.5rem" }}>
                <Grid
                  gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
                  gap={1}
                >
                  <GridItem>
                    <ServerSideComicsList
                      comicsList={creator.comics}
                      comicsBusy={false}
                    />
                  </GridItem>

                  <GridItem>
                    <ServerSideEventsList
                      eventsList={creator.events}
                      eventsBusy={false}
                    />
                  </GridItem>

                  <GridItem>
                    <ServerSideSeriesList
                      seriesList={creator.series}
                      seriesBusy={false}
                    />
                  </GridItem>

                  <GridItem>
                    <ServerSideStoriesList
                      storiesList={creator.stories}
                      storiesBusy={false}
                    />
                  </GridItem>
                </Grid>
              </Box>
            )}
            {(comicsBusy || eventsBusy || seriesBusy || storiesBusy) && (
              <RandomSpinner />
            )}
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
}

async function getUserDetails(id) {
  let { hashed, ts } = getApiHash();
  let url =
    "https://gateway.marvel.com:443/v1/public/creators/" +
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

export default CreatorDetails;
