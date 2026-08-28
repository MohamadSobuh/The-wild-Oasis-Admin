import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${(props) =>
    props.align === "center" &&
    css`
      align-items: center;
    `}

  ${(props) =>
    props.type === "horizontal" &&
    css`
      justify-content: space-between;
      align-items: center;
    `}

  ${(props) =>
    props.type === "vertical" &&
    css`
      flex-direction: column;
      gap: 1.6rem;
    `}
    ${(props) =>
    props.type === "margin" &&
    css`
      gap: 1.6rem;
      margin-top: 10px;
    `}
`;

Row.defaultProps = {
  type: "vertical",
};

export default Row;
