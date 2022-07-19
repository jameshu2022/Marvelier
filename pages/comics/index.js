import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import utilStyles from "../../styles/utils.module.css";
import getApiHash from "../../util/getApiHash.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Text,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import Layout from "../../components/Layout.js";
import ComicBox from "../../components/ComicBox";
import { useListView } from "../../components/ListView";
import ToggleListView from "../../components/ToggleListView";

const schema = yup.object().shape({
  comicName: yup.string().required("Comic name is required."),
});

function Index(props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  const listView = useListView();

  const [busy, setBusy] = useState(true);
  const [suggestions, setSuggestions] = useState({});

  const onSubmit = (data) => {
    let newName = data.comicName.replaceAll(" ", "+");
    let url = "/comics/search?comicName=" + newName;
    router.push(url);
  };

  useEffect(() => {
    let limit = 14;
    let max = 52000;
    let url = "/api/comics/getrandom?limit=" + limit + "&max=" + max;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setSuggestions(data);
        setBusy(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading sx={{ paddingBottom: "1rem" }}>Find Comics</Heading>
        <ToggleListView />
      </Box>

      <Box>
        <Box sx={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel htmlFor="comicName">Comic Name</FormLabel>
              <Input
                id="comicName"
                placeholder="Comic Name"
                {...register("comicName")}
              ></Input>
            </FormControl>
            {errors?.comicName && (
              <Text color="red" className="error-message">
                {errors.comicName.message}
              </Text>
            )}
            <Button sx={{ marginTop: "0.2rem" }} type="submit">
              Submit
            </Button>
          </form>
        </Box>
        <Box>
          <Text sx={{ paddingBottom: "0.25rem" }} fontWeight="bold">
            Stuck? Some suggestions below
          </Text>
          {!busy && !listView.listView && (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr",
                xl: "1fr 1fr 1fr",
              }}
              gap={2}
            >
              {suggestions.data.results.map((comic) => (
                <GridItem key={comic.id}>
                  <ComicBox comic={comic} />
                </GridItem>
              ))}
            </Grid>
          )}
          {!busy && listView.listView && (
            <ul className={utilStyles.list}>
              {suggestions.data.results.map((comic) => (
                <li key={comic.id}>
                  <Link href={"/comics/" + comic.id}>
                    <a className={utilStyles.nextLink}>{comic.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {busy && (
            <Box marginBottom="5rem">
              <Spinner marginLeft="50%" size="xl" color="purple.500" />
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

// /**
//  * This function gets a list of comics with a random offset sorted
//  * by modified date (Because of marvel API limitations)
//  * limit -> number of results returned (from 0 - 100)
//  * max -> keep around 0 - 5200
//  */
// async function getRandomComics(limit, max) {
//   let randomOffset = Math.floor(Math.random() * max);
//   let { hashed, ts } = getApiHash();
//   let url =
//     "https://gateway.marvel.com:443/v1/public/comics?orderBy=onsaleDate&limit=" +
//     limit +
//     "&offset=" +
//     randomOffset +
//     "&ts=" +
//     ts +
//     "&apikey=" +
//     process.env.PUBLIC_API_KEY +
//     "&hash=" +
//     hashed;

//   return fetch(url);
// }

// export async function getServerSideProps() {
//   var res = await getRandomComics(14, 52000);
//   var comics = await res.json();

//   return {
//     props: {
//       comics,
//     },
//   };
// }

export default Index;
