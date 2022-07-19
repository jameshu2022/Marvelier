import { Text } from "@chakra-ui/react";
import Link from "next/link";


function InternalLinkLi({index, href, color, children, ...props}) {
  return (
    <li key={index}>
      <Link href={href}>
        <Text color={color} textDecoration="underline" cursor="pointer">
          {children}
        </Text>
      </Link>
    </li>
  );
}

export default InternalLinkLi;
