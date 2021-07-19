import styled from "styled-components";
import css from "@styled-system/css";
import NextImage from "next/image";
import Box from "components/Box";
import Flex from "components/Flex";
import Button from "components/Button";
import enterprise from "pages/features/assets/enterprise-bg.png";
import core from "pages/features/assets/core-bg.png";

export interface FeatureTileProps {
  children: React.ReactNode;
  title: string;
  src: string;
  href?: string;
  feature: "enterprise" | "core";
}

const FeatureTile = ({
  children,
  src,
  title,
  feature,
  href,
}: FeatureTileProps) => {
  const backgroundImage = feature === "enterprise" ? enterprise : core;
  return (
    <StyledWrapper>
      {/* top half */}
      <Flex
        flexDirection="column"
        alignItems="center"
        py={3}
        px={4}
        backgroundImage={`url("${backgroundImage}")`}
        backgroundPosition="center"
        backgroundSize="cover"
        borderRadius="8px 8px 0 0"
      >
        <NextImage src={src} alt={`${title}`} height={193} width={282} />
      </Flex>

      {/* bottom half */}
      <Flex flexDirection="column" pt={3} px={4} borderRadius="0 0 8px 8px">
        <Box fontSize="text-md" lineHeight="md" color="black" fontWeight="bold">
          {title}
        </Box>
        <Box fontSize="13px" lineHeight="md" color="gray" pb={3}>
          {children}
        </Box>
      </Flex>
      {href && (
        <Flex flexDirection="column-reverse" px={4} pb={4} height="100%">
          <StyledButton variant="secondary" shape="lg" as="a" href={href}>
            Learn More
          </StyledButton>
        </Flex>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Flex)(
  css({
    flexDirection: "column",
    maxWidth: "calc((100% - 80px) / 4)",
    minWidth: ["340px", "280px", "180px"],
    maxHeight: "500px",
    borderRadius: "md",
    textDecoration: "none",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.24)",
    mb: 4,
    mx: 2,
    bg: "white",
  })
);

const StyledButton = styled(Button)({
  borderWidth: "1px",
  width: "100%",
  fontWeight: "bold",
});

export default FeatureTile;
