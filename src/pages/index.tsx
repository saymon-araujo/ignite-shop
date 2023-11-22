import Image from "next/image";
import { styled } from "../styles";
import { HomeContainer, Product } from "../styles/pages/home";

import shirt1 from "../assets/shirts/1.png";
import shirt2 from "../assets/shirts/2.png";
import shirt3 from "../assets/shirts/3.png";

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
    <HomeContainer>
      <Product>
        <Image src={shirt1} alt="" width={520} height={480} />
        <footer>
          <strong>Camiseta X</strong>
          <span>R$ 79,00</span>
        </footer>
      </Product>

      <Product>
        <Image src={shirt2} alt="" width={520} height={480} />
        <footer>
          <strong>Camiseta X2</strong>
          <span>R$ 79,00</span>
        </footer>
      </Product>
    </HomeContainer>
  );
}
