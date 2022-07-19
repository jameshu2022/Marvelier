import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";

function SeriesList({ seriesList, seriesBusy }) {
    return (
        <Box>
            <Heading fontSize="md">Series: </Heading>
            {!seriesBusy && (
                <ul className={utilStyles.list}>
                    {seriesList.data.results.map((series) => (
                        <li key={series.id}>
                            <Link href={"/series/" + series.id}>
                            <a className={utilStyles.nextLink}>{series.title}</a>
                            </Link>
                        </li>
                    ))}
                    {seriesList.data.count == 0 && <Text>No series found</Text>}
                </ul>
            )}
            {seriesBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default SeriesList;
