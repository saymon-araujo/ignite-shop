import { styled } from "../styles";

const Button = styled("button", {
  color: "$primary",
  backgroundColor: "blue",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "green",
  },
});

export default function Home() {
  return (
    <>
      <h1>Hello World</h1>
      <Button>Click Me</Button>
    </>
  );
}
