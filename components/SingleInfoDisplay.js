import { Text } from "@chakra-ui/react";

/**
 *
 * @param {*} props
 * props.heading -> what heading will be displayed
 * props.infoName -> variable name (comic.format, comic.price, etc)
 * props.info -> variable itself(comic.format, etc)
 * @returns
 */
function SingleInfoDisplay(props) {
  return (
    <Text>
      <strong>{props.heading}</strong>
      {props.info == "" ? `No ${props.infoName} available.` : props.info}
    </Text>
  );
}

export default SingleInfoDisplay;
