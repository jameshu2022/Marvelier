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
} from "@chakra-ui/react";
import { default as NextImage } from "next/image";

import utilStyles from "../../styles/utils.module.css";
import ExternalLinkLi from "../../components/lists/ExternalLinkLi";
import RandomSpinner from "../../components/RandomSpinner";
import DetailLayout from "../../components/DetailLayout.js";

function CreatorDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [creator, setCreator] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/creators/" + id + "/shortdetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setCreator(data.data.results[0]);
        setThumbnailUrl(
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
            obj={creator}
            busy={busy}
            basicInfo={
              <BasicCreatorInfo thumbnailUrl={thumbnailUrl} blurDataUrl={blurDataUrl} creator={creator} />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
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
          </DetailLayout>
        </Box>
      )}
    </Layout>
  );
}

function BasicCreatorInfo({ thumbnailUrl, blurDataUrl, creator, ...props }) {
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
          loader={() => thumbnailUrl}
          src={thumbnailUrl}
          alt={creator.firstName + " " + creator.lastName}
          width={402}
          height={402}
          style={{ borderRadius: "5px" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </Box>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <Heading fontSize="lg" paddingTop>
          Creator Info:
        </Heading>
        <Heading fontSize="lg">Futher Reading:</Heading>
        <ul className={utilStyles.list}>
          {creator.urls.map((url, index) => (
            <ExternalLinkLi key={index} href={url.url} color={linkColor}>
              {linkDict[url.type]}
            </ExternalLinkLi>
          ))}
        </ul>
      </Box>
    </Stack>
  );
}

export default CreatorDetails;
