import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> comicsBusy, comicList
 * @returns 
 */
function ServerSideComicsList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Comics: " : props.heading}</Heading>
            {!props.comicsBusy && (
                <ul className={utilStyles.list}>
                    {props.comicsList.items.map((comic) => (
                        <li key={comic.resourceURI.substring(43)}>
                            <Link href={"/comics/" + comic.resourceURI.substring(43)}>
                                <a className={utilStyles.nextLink}>{comic.name}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.comicsList.available == 0 || props.comicsList == null) && <Text>No comics found</Text>}
                </ul>
            )}
            {props.comicsBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default ServerSideComicsList;
