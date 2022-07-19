import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> comicsBusy, comicList
 * @returns 
 */
function ServerSideCharacterList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Characters: " : props.heading}</Heading>
            {!props.charactersBusy && (
                <ul className={utilStyles.list}>
                    {props.charactersList.items.map((character) => (
                        <li key={character.resourceURI.substring(44)}>
                            <Link href={"/characters/" + character.resourceURI.substring(44)}>
                                <a className={utilStyles.nextLink}>{character.name}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.charactersList.available == 0 || props.charactersList == null) && <Text>No characters found</Text>}
                </ul>
            )}
            {props.charactersBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default ServerSideCharacterList;
