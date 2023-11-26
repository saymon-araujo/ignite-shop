import { Container, ImageContainer } from "@/src/styles/pages/success";
import Image from "next/image";
import Link from "next/link";

export default function Success() {
  return (
    <Container>
      <h1>Compra realizada com sucesso!</h1>

      <ImageContainer>
        <Image src="/success.png" width={130} height={145} alt="" />
      </ImageContainer>
      <p>
        Uhuul <strong>Diego Fernandes</strong>, sua<strong>Camiseta Beyond the Limits</strong> já
        está a caminho da sua casa.
      </p>

      <Link href={"/"}>Voltar Ao Catálogo</Link>
    </Container>
  );
}
