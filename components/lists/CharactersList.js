import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import utilStyles from "../../styles/utils.module.css";

/**
 * 
 * @param {*} props -> comicsBusy, comicList
 * @returns 
 */
function CharactersList(props) {
    return (
        <Box>
            <Heading fontSize="md">{props.heading == null ? "Characters: " : props.heading}</Heading>
            {!props.charactersBusy && (
                <ul className={utilStyles.list}>
                    {props.charactersList.data.results.map((character) => (
                        <li key={character.id}>
                            <Link href={"/characters/" + character.id}>
                                <a className={utilStyles.nextLink}>{character.name}</a>
                            </Link>
                        </li>
                    ))}
                    {(props.charactersList.data.count == 0 || props.charactersList.data.results.length == 0) && <Text>No comics found</Text>}
                </ul>
            )}
            {props.charactersBusy && <Spinner color="purple.500" size="xl" />}
        </Box>
    );
}

export default CharactersList;
