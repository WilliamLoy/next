import styled from "styled-components";
import { css, all } from "components/system";

interface QouteProps {
  children: React.ReactNode;
}

export default function Qoute({ children, ...props }: QouteProps) {
  return <StyledQoute {...props}>{children}</StyledQoute>;
}

const StyledQoute = styled("blockquote")(
  css({
    boxSizing: "border-box",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    p: 6,
    borderLeftWidth: "8px",
    borderLeftStyle: "solid",
    borderLeftColor: "dark-purple",
    boxShadow: "0 8px 64px rgb(0 0 0 / 12%)",
    my: 3,
    mx: 0,
    "&::before": {
      content: '"“"',
      position: "absolute",
      top: 4,
      left: 4,
      color: "lighter-gray",
      fontSize: "140px",
      opacity: "0.87",
    },
  }),
  all
);
