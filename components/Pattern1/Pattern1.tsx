import styled from "styled-components";
import { css } from "components/system";
import Head from "components/Head";
import Link from "components/Link";
import Box from "components/Box";
import Flex from "components/Flex";
import Logo from "components/Logo";
import { IdiomClass, IDIOM } from "./constants";

/**
 * @returns a standalone, full-page wrapper component with blank white central card.
 * ***Not intended to be used within an MDX file.***
 */

export interface Pattern1Props {
  headTitle: string;
  headDescription: string;
  colorStyle: IdiomClass;
  children: React.ReactNode;
}

export const Pattern1 = ({
  headTitle,
  headDescription,
  colorStyle,
  children,
}: Pattern1Props) => {
  const background = IDIOM[colorStyle].background;
  const logoColor = IDIOM[colorStyle].logo;
  return (
    <>
      <Head title={headTitle} description={headDescription} />
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        // mobile height will need to be changed if longer forms are used
        height={["100vh", null]}
        minHeight={[null, "100vh"]}
        pl={[2, 4]}
        pr={[2, 4]}
        {...background}
      >
        <Box as="header" mt={[5, 9]} mb={[5, 5]} {...logoColor}>
          <Logo width={["120px", "180px"]} height={["24px", "38px"]} />
        </Box>

        <StyledCard as="section">{children}</StyledCard>

        {/* Footer: hidden on mobile */}
        <Box as="footer" mb={9} textAlign="center" fontSize="text-sm">
          <Box display={["none", "block"]} color="lightest-gray" opacity="0.8">
            © 2021 GRAVITATIONAL, INC. ALL RIGHTS RESERVED
          </Box>
          <Box
            display={["none", "flex"]}
            flexDirection="row"
            justifyContent="center"
          >
            <StyledLink scheme="terms" href="/tos/">
              TERMS OF SERVICE
            </StyledLink>
            <StyledLink scheme="terms" href="/privacy/">
              PRIVACY POLICY
            </StyledLink>
            <StyledLink scheme="terms" href="/security/">
              SECURITY POLICY
            </StyledLink>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

const StyledCard = styled(Flex)(
  css({
    maxWidth: "944px",
    width: "100%",
    backgroundColor: "white",
    flexDirection: ["column", "row"],
    borderRadius: "md",
    marginBottom: [8, 5],
    boxShadow: "0 0 64px rgba(0, 0, 0, 0.32)",
  })
);

const StyledLink = styled(Link)(
  css({
    mx: 1,
    mt: 2,
    padding: 1,
  })
);