import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> comicsBusy, comicList
 * @returns 
 */
function CreatorsList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Creators: " : props.heading}</Heading>
            {!props.creatorsBusy && (
                <ul className={utilStyles.list}>
                    {props.creatorsList.data.results.map((creator) => (
                        <li key={creator.id}>
                            <Link href={"/creators/" + creator.id}>
                                <a className={utilStyles.nextLink}>{creator.firstName + " " + creator.lastName}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.creatorsList.data.count == 0 || props.creatorsList.data.results.length == 0) && <Text>No creators found</Text>}
                </ul>
            )}
            {props.creatorsBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default CreatorsList;
