export default {
  routes: [
    {
      method: "GET",
      path: "/products/latest-featured",
      handler: "product.latestFeatured",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/products/:id/related",
      handler: "product.relatedProducts",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
