const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const products = await strapi.entityService.findMany(
      "api::product.product",
      {
        ...query,
        populate: ["mainImage", "secondImage", "thirdImage"],
      }
    );

    const formatImageData = (image) => {
      if (!image || !image.formats) return null;
      return {
        large: image.formats.large
          ? {
              url: image.formats.large.url,
              width: image.formats.large.width,
              height: image.formats.large.height,
            }
          : null,
        medium: image.formats.medium
          ? {
              url: image.formats.medium.url,
              width: image.formats.medium.width,
              height: image.formats.medium.height,
            }
          : null,
        small: image.formats.small
          ? {
              url: image.formats.small.url,
              width: image.formats.small.width,
              height: image.formats.small.height,
            }
          : null,
        thumbnail: image.formats.thumbnail
          ? {
              url: image.formats.thumbnail.url,
              width: image.formats.thumbnail.width,
              height: image.formats.thumbnail.height,
            }
          : null,
      };
    };

    const formatProductData = (product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      isFeatured: product.isFeatured,
      stock: product.stock,
      description: product.description,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    });

    const formattedProducts = products.map(formatProductData);

    return ctx.send(formattedProducts);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const product = await strapi.entityService.findOne(
      "api::product.product",
      id,
      {
        ...query,
        populate: ["mainImage", "secondImage", "thirdImage"],
      }
    );

    if (!product) {
      return ctx.notFound("Product not found");
    }

    const formatImageData = (image) => {
      if (!image || !image.formats) return null;
      return {
        large: image.formats.large
          ? {
              url: image.formats.large.url,
              width: image.formats.large.width,
              height: image.formats.large.height,
            }
          : null,
        medium: image.formats.medium
          ? {
              url: image.formats.medium.url,
              width: image.formats.medium.width,
              height: image.formats.medium.height,
            }
          : null,
        small: image.formats.small
          ? {
              url: image.formats.small.url,
              width: image.formats.small.width,
              height: image.formats.small.height,
            }
          : null,
        thumbnail: image.formats.thumbnail
          ? {
              url: image.formats.thumbnail.url,
              width: image.formats.thumbnail.width,
              height: image.formats.thumbnail.height,
            }
          : null,
      };
    };

    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      isFeatured: product.isFeatured,
      stock: product.stock,
      description: product.description,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    };

    return ctx.send(formattedProduct);
  },

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
      description: product.description,
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

  async relatedProducts(ctx) {
    const { id } = ctx.params;

    const product = await strapi.entityService.findOne(
      "api::product.product",
      id,
      {
        populate: ["categorie"],
      }
    );

    if (!product) {
      return ctx.notFound("Product not found");
    }

    const categorieId = product.categorie?.id;

    if (!categorieId) {
      return ctx.badRequest("This product does not have a category.");
    }

    const relatedProducts = await strapi.entityService.findMany(
      "api::product.product",
      {
        filters: {
          categorie: categorieId,
          id: { $ne: id },
        },
        limit: 4,
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
      stock: product.stock,
      description: product.description,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    });

    const formattedRelatedProducts = relatedProducts.map(formatProductData);

    return ctx.send({ relatedProducts: formattedRelatedProducts });
  },
}));
