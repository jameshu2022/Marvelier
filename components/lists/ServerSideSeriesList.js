import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> seriessBusy, seriesList
 * @returns 
 */
function ServerSideSeriesList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Series: " : props.heading}</Heading>
            {!props.seriesBusy && (
                <ul className={utilStyles.list}>
                    {props.seriesList.items.map((series) => (
                        <li key={series.resourceURI.substring(43)}>
                            <Link href={"/series/" + series.resourceURI.substring(43)}>
                                <a className={utilStyles.nextLink}>{series.name}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.seriesList.available == 0 || props.seriesList == null) && <Text>No series found</Text>}
                </ul>
            )}
            {props.seriesBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default ServerSideSeriesList;
