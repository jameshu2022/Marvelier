import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";

function EventsList({eventsList, eventsBusy}) {
    return (
        <Box>
            <Heading fontSize="md">Events: </Heading>
            {!eventsBusy && (
                <ul className={utilStyles.list}>
                    {eventsList.data.results.map((event, index) => (
                        <li key={event.id}>
                            <Link href={"/events/" + event.id}>
                            <a className={utilStyles.nextLink}>{event.title}</a>
                            </Link>
                        </li>
                    ))}
                    {eventsList.data.count == 0 && <Text>No events found</Text>}
                </ul>
            )}
            {eventsBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default EventsList;
