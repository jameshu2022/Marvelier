import { Text } from "@chakra-ui/react";

function ExternalLinkLi({index, href, children, ...props}) {
  return (
    <li key={index}>
      <Text textDecoration="underline" {...props}>
        <a target="_blank" rel="noreferrer" href={href}>
          {children}
        </a>
      </Text>
    </li>
  );
}

export default ExternalLinkLi;
