// ./src/api/product/routes/custom-routes.js
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
      path: "/products/related/:id",
      handler: "product.relatedProducts", // Esse é o handler que criamos no controlador
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
