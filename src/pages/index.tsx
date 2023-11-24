import { useKeenSlider } from "keen-slider/react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Stripe from "stripe";
import Link from "next/link";

import { HomeContainer, Product } from "../styles/pages/home";
import "keen-slider/keen-slider.min.css";
import { stripe } from "../lib/stripe";
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

interface Props {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: Stripe.Price["unit_amount"];
  }[];
}

export default function Home({ products }: Props) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          <div key={product.id}>
            {/* This Prefetch is nice */}
            <Link href={`/product/${product.id}`} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} alt="" width={520} height={480} />
                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          </div>
        );
      })}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const productsFormatted = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        //@ts-ignore
      }).format(price.unit_amount / 100),
    };
  });

  return {
    props: {
      products: productsFormatted,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
