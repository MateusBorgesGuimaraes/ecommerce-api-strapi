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
  ],
};
