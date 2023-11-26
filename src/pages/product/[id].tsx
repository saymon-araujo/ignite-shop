import Stripe from "stripe";
import Image from "next/image";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import { stripe } from "@/src/lib/stripe";
import { Container, ImageContainer, ProductDetails } from "@/src/styles/pages/product";
import axios from "axios";
import { useState } from "react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: Stripe.Price["unit_amount"];
    defaultPriceId: Stripe.Price["id"];
    description: string;
  };
}

export default function Product({ product }: ProductProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isFallback, push } = useRouter();

  if (isFallback) {
    return <div>Loading...</div>;
  }

  async function handleBuyProduct() {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/checkout", {
        priceId: product.defaultPriceId,
        productId: product.id,
      });

      const { checkoutUrl } = response.data;

      // Redireciona para uma rota externa
      window.location.href = checkoutUrl;

      // Redireciona para uma rota interna
      // push("/checkout");
    } catch (err) {
      setIsLoading(false);
      alert("Falha ao redirecionar para o checkout");
      console.log(err);
    }
    // stripe.redirectToCheckout({
    //   sessionId: product.defaultPriceId,
    // });
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

        <button disabled={isLoading} onClick={handleBuyProduct}>
          Comprar Agora
        </button>
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
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  };
};
