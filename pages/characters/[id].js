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
} from "@chakra-ui/react";
import { default as NextImage } from "next/image";

import utilStyles from "../../styles/utils.module.css";
import ExternalLinkLi from "../../components/lists/ExternalLinkLi";
import RandomSpinner from "../../components/RandomSpinner";
import DetailLayout from "../../components/DetailLayout.js";

function CharacterDetails() {
  const router = useRouter();
  const [busy, setBusy] = useState(true);
  const [character, setCharacter] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [blurDataUrl, setBlurDataUrl] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let { id } = router.query;
    let url = "/api/characters/" + id + "/shortdetails";
    // console.log(url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCharacter(data.data.results[0]);
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
            obj={character}
            busy={busy}
            basicInfo={
              <BasicCharacterInfo
                thumbnailUrl={thumbnailUrl}
                blurDataUrl={blurDataUrl}
                character={character}
              />
            }
          >
            <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={1}>
              <GridItem>
                <ServerSideComicsList
                  comicsList={character.comics}
                  comicsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideEventsList
                  eventsList={character.events}
                  eventsBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideSeriesList
                  seriesList={character.series}
                  seriesBusy={false}
                />
              </GridItem>

              <GridItem>
                <ServerSideStoriesList
                  storiesList={character.stories}
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

function BasicCharacterInfo({
  thumbnailUrl,
  blurDataUrl,
  character,
  ...props
}) {
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
          alt={character.name}
          width={402}
          height={402}
          style={{ borderRadius: "5px" }}
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </Box>
      <Box sx={{ paddingTop: "0.5rem" }}>
        <Heading fontSize="lg" paddingTop>
          Character Info:
        </Heading>
        <Text paddingTop="0.25rem">
          <strong>Description: </strong>
          {character.description == ""
            ? "No description available."
            : character.description}
        </Text>
        <Heading fontSize="lg">Futher Reading:</Heading>
        <ul className={utilStyles.list}>
          {character.urls.map((url, index) => (
            <ExternalLinkLi key={index} href={url.url} color={linkColor}>
              {linkDict[url.type]}
            </ExternalLinkLi>
          ))}
        </ul>
      </Box>
    </Stack>
  );
}

export default CharacterDetails;
