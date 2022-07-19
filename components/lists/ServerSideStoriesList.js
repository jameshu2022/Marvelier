import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 *
 * @param {*} props -> comicsBusy, comicList
 * @returns
 */
function ServerSideStoriesList(props) {
  return (
    <Box>
      <Heading fontSize="md">
        {props.heading == null ? "Stories: " : props.heading}
      </Heading>
      {!props.storiesBusy && (
        <ul className={utilStyles.list}>
          {props.storiesList.items.map((story) => (
            <li key={story.resourceURI.substring(44)}>
              <Link href={"/stories/" + story.resourceURI.substring(44)}>
                <a className={utilStyles.nextLink}>{story.name}</a>
              </Link>
            </li>
          ))}
          {(props.storiesList.available == 0 || props.storiesList == null) && (
            <Text>No stories found</Text>
          )}
        </ul>
      )}
      {props.storiesBusy && <Spinner color="purple.500" size="xl" />}
    </Box>
  );
}

export default ServerSideStoriesList;
