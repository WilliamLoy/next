import css from "@styled-system/css";
import { Children, cloneElement, useMemo } from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import Box from "components/Box";
import Flex from "components/Flex";

type AlignValue = "left" | "center" | "right";

const getAlignItems = (align?: AlignValue) => {
  switch (align) {
    case "right":
      return "flex-end";
    case "left":
      return "flex-start";
    default:
      return align;
  }
};

interface SharedProps {
  align?: AlignValue;
  bordered?: boolean;
  caption?: string;
}

export type ImageProps = SharedProps & NextImageProps;

export const Image = ({ align, bordered, caption, ...props }: ImageProps) => {
  const imageProps = useMemo((): NextImageProps => {
    const imageTemp = {
      ...props,
      layout: "intrinsic",
      sizes: "(min-width: 1460px) 900px, 100vw",
    };

    if (!imageTemp?.src?.width || !imageTemp?.src?.height) {
      imageTemp.width = props.width
        ? parseFloat(props.width as string)
        : "auto";
      imageTemp.height = props.height
        ? parseFloat(props.height as string)
        : "auto";
    }

    return imageTemp;
  }, [props]);

  return (
    <Flex
      as="figure"
      my={3}
      flexDirection="column"
      alignItems={getAlignItems(align)}
      css={css({
        "&:fisrt-child": {
          mt: 0,
        },
        "&:last-child": {
          mb: 0,
        },
      })}
    >
      {bordered ? (
        <Box as="span" boxShadow="0 1px 4px rgba(0, 0, 0, 0.24)">
          <NextImage {...imageProps} />
        </Box>
      ) : (
        <NextImage {...imageProps} />
      )}
      {caption && (
        <Box as="figcaption" mt="2" color="gray" fontStyle="italic">
          {caption}
        </Box>
      )}
    </Flex>
  );
};

Image.defaultProps = {
  align: "left",
};

type ImageComponent = React.ReactElement<typeof Image>;

export type FigureProps = ImageProps & {
  children: ImageComponent;
};

export const Figure = ({ children, ...rest }: FigureProps) => {
  const image = Children.only<ImageComponent>(children);

  return cloneElement(image, rest);
};
