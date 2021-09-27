import Section from "components/Section";
import SectionHeader, { SectionHeaderProps } from "components/SectionHeader";
import TryTeleport from "components/TryTeleport";
import { Centrator } from "components/Layout";
import NextImage, { ImageProps } from "next/image";
import accessPlane from "./assets/access-plane-all.png";
import MDX from "components/MDX";

type CaseStudyProps = {
  children: React.ReactNode;
  companyLogo: ImageProps;
} & SectionHeaderProps;

const ACCESS_LINK = {
  href: "../..",
  text: "Learn more",
  variant: "secondary",
  shape: "outline",
} as const;

export default function CaseStudy({
  mode,
  subtitle,
  title,
  description,
  bg,
  link,
  companyLogo,
  children,
}: CaseStudyProps) {
  return (
    <>
      <SectionHeader
        mode={mode}
        subtitle={subtitle}
        title={title}
        description={description}
        bg={bg}
        link={link}
      >
        <NextImage {...companyLogo} />
      </SectionHeader>
      <Section
        bg="wavelight"
        color="darkest"
        backgroundPosition="top left"
        backgroundSize="auto"
      >
        <Centrator mt={[7, 11]} mb={[0, 8]} flexDirection="column">
          <MDX>{children}</MDX>
        </Centrator>
      </Section>
      <SectionHeader
        mode="full"
        subtitle="Teleport is part of the"
        title="Access Plane"
        description="Teleport provides an Access Plane that consolidates access controls and auditing across all environments - infrastructure, applications and data."
        bg="wave"
        link={ACCESS_LINK}
      >
        <NextImage
          src={accessPlane}
          width={588}
          height={356}
          layout="intrinsic"
          alt="Teleport Access Plane"
        />
      </SectionHeader>
      <TryTeleport />
    </>
  );
}
