import Stripe from "stripe";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import { stripe } from "@/src/lib/stripe";
import { Container, ImageContainer, ProductDetails } from "@/src/styles/pages/product";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: Stripe.Price["unit_amount"];
    description: string;
  };
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button>Comprar Agora</button>
      </ProductDetails>
    </Container>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Search the most popular products and add the to the paths array

  return {
    paths: [
      {
        params: { id: "prod_P3ie1gQK8QOVEj" },
      },
    ],
    fallback: true,
    // fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id ? params?.id : "0";

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          //@ts-ignore
        }).format(price.unit_amount / 100),
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
