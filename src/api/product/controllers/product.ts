const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async latestFeatured(ctx) {
    const latestProducts = await strapi.entityService.findMany(
      "api::product.product",
      {
        sort: { createdAt: "desc" },
        limit: 8,
        populate: ["mainImage", "secondImage", "thirdImage"],
      }
    );

    const featuredProducts = await strapi.entityService.findMany(
      "api::product.product",
      {
        filters: { isFeatured: true },
        sort: { createdAt: "desc" },
        limit: 8,
        populate: ["mainImage", "secondImage", "thirdImage"],
      }
    );
    const formatImageData = (image) => {
      if (!image || !image.formats) return null;
      return Object.keys(image.formats).reduce((acc, format) => {
        acc[format] = {
          url: image.formats[format].url,
          width: image.formats[format].width,
          height: image.formats[format].height,
        };
        return acc;
      }, {});
    };

    const formatProductData = (product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      isFeatured: product.isFeatured,
      stock: product.stock,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    });

    const formattedLatestProducts = latestProducts.map(formatProductData);
    const formattedFeaturedProducts = featuredProducts.map(formatProductData);

    return ctx.send({
      latestProducts: formattedLatestProducts,
      featuredProducts: formattedFeaturedProducts,
    });
  },
}));
