import Box, { BoxProps } from "components/Box";
import { Centrator } from "components/Layout";
import Heading from "components/Heading";
import spacecraftUrl from "./assets/spaceship.png";

export type Props = {
  title?: string;
  subtitle?: string;
} & BoxProps;
console.log(spacecraftUrl);

export default function Banner({ title, subtitle, ...props }: Props) {
  return (
    <Box
      as="section"
      py={[6, 11]}
      background={`url(${spacecraftUrl}) center bottom no-repeat`}
      backgroundPosition={[
        "center bottom",
        "center bottom",
        "center bottom -5vw",
      ]}
      backgroundSize={["140% auto", "100% auto"]}
      {...props}
    >
      <Centrator>
        <Heading title={title} subtitle={subtitle} maxWidth="65%" />
      </Centrator>
    </Box>
  );
}
