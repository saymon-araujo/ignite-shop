import { stripe } from "@/src/lib/stripe";
import { Container, ImageContainer } from "@/src/styles/pages/success";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface SucessProps {
  costumerName: string;
  product: {
    name: string;
    imageUrl: string;
  };
}

export default function Success({ costumerName, product }: SucessProps) {
  return (
    <>
      <Head>
        <title>Success | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

      <Container>
        <h1>Compra realizada com sucesso!</h1>

        <ImageContainer>
          <Image src={product.imageUrl} width={120} height={110} alt="" />
        </ImageContainer>
        <p>
          Uhuul <strong>{costumerName}</strong>, sua<strong>{product.name}</strong> já está a
          caminho da sua casa.
        </p>

        <Link href={"/"}>Voltar Ao Catálogo</Link>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const sessionId = String(query.session_id);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const costumerName = session.customer_details?.name;
  const productName = session.line_items?.data[0]?.price?.product as Stripe.Product;
  const productImg = session.line_items?.data[0]?.price?.product as Stripe.Product;

  return {
    props: {
      costumerName,
      product: {
        name: productName,
        imageUrl: productImg,
      },
    },
  };
};
