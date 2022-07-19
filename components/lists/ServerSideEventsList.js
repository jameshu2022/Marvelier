import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> eventsBusy, eventList
 * @returns 
 */
function ServerSideEventsList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Events: " : props.heading}</Heading>
            {!props.eventsBusy && (
                <ul className={utilStyles.list}>
                    {props.eventsList.items.map((event) => (
                        <li key={event.resourceURI.substring(43)}>
                            <Link href={"/events/" + event.resourceURI.substring(43)}>
                                <a className={utilStyles.nextLink}>{event.name}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.eventsList.available == 0 || props.eventsList == null) && <Text>No events found</Text>}
                </ul>
            )}
            {props.eventsBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default ServerSideEventsList;
