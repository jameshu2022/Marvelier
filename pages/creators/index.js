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
import { useListView } from "../../components/ListView.js";
import ToggleListView from "../../components/ToggleListView.js";
import CreatorBox from "../../components/CreatorBox";

const schema = yup.object().shape({
  creatorName: yup.string().required("Creator name is required."),
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

  useEffect(() => {
    let limit = 14;
    let max = 5600;
    let url = "/api/creators/getrandom?limit=" + limit + "&max=" + max;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setBusy(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (data) => {
    let newName = data.creatorName.replaceAll(" ", "+");
    let url = "/creators/search?creatorName=" + newName;
    router.push(url);
  };

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading sx={{ paddingBottom: "1rem" }}>Find Creators</Heading>
        <ToggleListView />
      </Box>

      <Box>
        <Box sx={{ marginBottom: "1.5rem" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel htmlFor="creatorName">Creator Name</FormLabel>
              <Input
                id="creatorName"
                placeholder="Creator Name"
                {...register("creatorName")}
              ></Input>
            </FormControl>
            {errors?.creatorName && (
              <Text color="red" className="error-message">
                {errors.creatorName.message}
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
              {suggestions.data.results.map((creator) => (
                <GridItem key={creator.id}>
                  <CreatorBox creator={creator} />
                </GridItem>
              ))}
            </Grid>
          )}
          {!busy && listView.listView && (
            <ul className={utilStyles.list}>
              {suggestions.data.results.map((creator) => (
                <li key={creator.id}>
                  <Link href={"/creator/" + creator.id}>
                    <a className={utilStyles.nextLink}>
                      {creator.firstName + " " + creator.lastName}
                    </a>
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
 * This function gets a list of creators with a random offset sorted
 * by modified date (Because of marvel API limitations)
 * limit -> number of results returned (from 0 - 100)
 * max -> keep around 0 - 5600
 */
// async function getRandomCreators(limit, max) {
//   let randomOffset = Math.floor(Math.random() * max);
//   let { hashed, ts } = getApiHash();
//   let url =
//     "https://gateway.marvel.com:443/v1/public/creators?orderBy=modified&limit=" +
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
//   var res = await getRandomCreators(14, 5600);
//   var creators = await res.json();

//   return {
//     props: {
//       creators,
//     },
//   };
// }

export default Index;
