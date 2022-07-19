import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import utilStyles from "../../styles/utils.module.css";

function StoriesList({ storiesList, storiesBusy }) {
    return (
        <Box>
            <Heading fontSize="md">Stories: </Heading>
            {!storiesBusy && (
                <ul className={utilStyles.list}>
                    {storiesList.data.results.map((stories, index) => (
                        <li key={index}>
                            <Link href={"/stories/" + stories.id}>
                            <a className={utilStyles.nextLink}>{stories.title}</a>
                            </Link>
                        </li>
                    ))}
                    {storiesList.data.count == 0 && (
                        <Text>No stories found</Text>
                    )}
                </ul>
            )}
            {storiesBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default StoriesList;
