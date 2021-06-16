import Flex, { FlexProps } from "components/Flex";
import { ReactComponent as LogoSvg } from "./logo.svg";

const Logo = (props: FlexProps) => (
  <Flex
    display="inline-block"
    lineHeight="0"
    width="121px"
    height="24px"
    {...props}
  >
    <LogoSvg width="100%" height="100%" />
  </Flex>
);

export default Logo;
