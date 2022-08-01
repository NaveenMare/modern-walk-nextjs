import Layout from "@components/Layout";
import { useEffect, useState } from "react";
import styles from "@styles/Clothing.module.scss";
import Card from "@components/card/Card";
import { Items, CategoryDetails } from "@typesData/items";
import { useQuery } from "@tanstack/react-query";
import { ProductAPI } from "@services/product.services";
import { ClothingType } from "@services/product.services";
import { useRouter } from "next/router";

export enum categoriesEnum {
  men = "men",
  women = "women",
  electronics = "electronics",
  jewelary = "jewelary",
}

export default function Products() {
  const router = useRouter();
  const { products } = router.query;

  // if (products) {
  //   if (
  //     !Object.values(categoriesEnum).includes(
  //       products as unknown as categoriesEnum
  //     )
  //   ) {
  //     router.push("/404");
  //   }
  // }
  const [categoryDetails, setCategoryDetails] =
    useState<CategoryDetails | null>(null);

  const { isLoading, data } = useQuery([router.query.products], async () => {
    return await ProductAPI.clothing(router.query.products);
  });

  useEffect(() => {
    switch (products) {
      case "women":
        setCategoryDetails({
          id: 1,
          categoryTitle: "Women's Clothing",
          url: "women",
        });
        break;
      case "men":
        setCategoryDetails({
          id: 2,
          categoryTitle: "Men's Clothing",
          url: "men",
        });
        break;
    }
  }, [products]);

  return (
    <Layout>
      <div>
        <h2>{categoryDetails?.categoryTitle}</h2>
        <div className={styles.clothingContainer}>
          {isLoading && <div>Loading...</div>}
          {!data?.error ? (
            data?.result?.map((item: Items) => (
              <Card key={item.id} data={item} type={categoryDetails?.id} />
            ))
          ) : (
            <div>{data?.error?.message}</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
