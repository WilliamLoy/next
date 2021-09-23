import { useEffect, useState } from "react";
import styled from "styled-components";
import Box from "components/Box";
import { CompanyId } from "components/Company";
import Flex from "components/Flex";
import { css, transition } from "components/system";
import Pagination from "./Pagination";
import Review from "./Review";

const SWITCH_TIMEOUT = 5000;
export interface Props {
  dark: boolean;
  reviews: CompanyId[];
}

export default function Feedback({ reviews, dark }: Props) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hovered || focused) {
        return;
      }
      setActive((current) => {
        if (current === reviews.length - 1) {
          return 0;
        }
        return current + 1;
      });
    }, SWITCH_TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [hovered, focused, active, reviews.length]);

  return (
    <Box as="section" pt={[3, 8]} pb={[2, 3]} width="100%" overflow="hidden">
      <div
        role="button"
        tabIndex={0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          outline: "none !important",
          border: "none",
          backgroundColor: "transparent",
          transition: transition([["transform", "shift"]]),
          transform: `translate3d(${-100 * active}vw, 0, 0)`,
        }}
      >
        <StyledList>
          {reviews.map((id) => (
            <Flex
              key={id}
              as="li"
              justifyContent="center"
              width="100%"
              flexShrink={0}
              px={[3, 0]}
            >
              <Review company={id} />
            </Flex>
          ))}
        </StyledList>
      </div>
      {reviews.length > 1 && (
        <Pagination
          mt={[2, 3]}
          pages={reviews}
          selected={active}
          dark={dark}
          onClick={setActive}
        />
      )}
    </Box>
  );
}

const StyledList = styled("ul")(
  css({
    display: "flex",
    m: 0,
    p: 0,
    listStyle: "none",
  })
);
