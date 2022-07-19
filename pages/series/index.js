import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import utilStyles from "../../styles/utils.module.css";
import getApiHash from "../../util/getApiHash.js";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import SeriesBox from "../../components/SeriesBox";
import { useListView } from "../../components/ListView";
import ToggleListView from "../../components/ToggleListView";

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

const schema = yup.object().shape({
  seriesTitle: yup.string().required("Series title is required."),
});

function Index(props) {
  // console.log(props);
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

  useEffect(() => {
    let limit = 14;
    let max = 12000;
    let url = "/api/series/getrandom?limit=" + limit + "&max=" + max;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setBusy(false);
      });
  }, []);

  const onSubmit = (data) => {
    // console.log(data);

    let newName = data.seriesTitle.replaceAll(" ", "+");
    let url = "/series/search?seriesTitle=" + newName;
    router.push(url);
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading sx={{ paddingBottom: "1rem" }}>Find Series</Heading>
        <ToggleListView />
      </Box>

      <Box>
        <Box sx={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel htmlFor="seriesTitle">Series Title</FormLabel>
              <Input
                id="seriesTitle"
                placeholder="Series Title"
                {...register("seriesTitle")}
              ></Input>
            </FormControl>
            {errors?.seriesTitle && (
              <Text color="red" className="error-message">
                {errors.seriesTitle.message}
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
              {suggestions.data.results.map((series) => (
                <GridItem key={series.id}>
                  <SeriesBox series={series} />
                </GridItem>
              ))}
            </Grid>
          )}
          {!busy && listView.listView && (
            <ul className={utilStyles.list}>
              {suggestions.data.results.map((series) => (
                <li key={series.id}>
                  <Link href={"/series/" + series.id}>
                    <a className={utilStyles.nextLink}>{series.title}</a>
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

/**
 * This function gets a list of heroes with a random offset sorted
 * by modified date (Because of marvel API limitations)
 * limit -> number of results returned (from 0 - 100)
 * max -> keep around 0 - 1200
 */
// async function getRandomSeries(limit, max) {
//   let randomOffset = Math.floor(Math.random() * max);
//   let { hashed, ts } = getApiHash();
//   let url =
//     "https://gateway.marvel.com:443/v1/public/series?orderBy=modified&limit=" +
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
//   var res = await getRandomSeries(14, 12000);
//   var series = await res.json();

//   return {
//     props: {
//       series,
//     },
//   };
// }

export default Index;
