import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> comicsBusy, comicList
 * @returns 
 */
function ComicsList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Comics: " : props.heading}</Heading>
            {!props.comicsBusy && (
                <ul className={utilStyles.list}>
                    {props.comicsList.data.results.map((comic) => (
                        <li key={comic.id}>
                            <Link href={"/comics/" + comic.id}>
                                <a className={utilStyles.nextLink}>{comic.title}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.comicsList.data.count == 0 || props.comicsList.data.results.length == 0) && <Text>No comics found</Text>}
                </ul>
            )}
            {props.comicsBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default ComicsList;
