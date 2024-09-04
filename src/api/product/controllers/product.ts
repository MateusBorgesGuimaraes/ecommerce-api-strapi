// ./src/api/product/controllers/product.js
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        mainImage: {
          fields: ["url", "formats"],
        },
        secondImage: {
          fields: ["url", "formats"],
        },
        thirdImage: {
          fields: ["url", "formats"],
        },
      },
    };

    const { data, meta } = await super.find(ctx);

    const filteredData = data.map((item) => ({
      id: item.id,
      attributes: {
        ...item.attributes,
        mainImage: filterImageData(item.attributes.mainImage),
        secondImage: filterImageData(item.attributes.secondImage),
        thirdImage: filterImageData(item.attributes.thirdImage),
      },
    }));

    return { data: filteredData, meta };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        mainImage: {
          fields: ["url", "formats"],
        },
        secondImage: {
          fields: ["url", "formats"],
        },
        thirdImage: {
          fields: ["url", "formats"],
        },
      },
    };

    const { data } = await super.findOne(ctx);

    const filteredData = {
      id: data.id,
      attributes: {
        ...data.attributes,
        mainImage: filterImageData(data.attributes.mainImage),
        secondImage: filterImageData(data.attributes.secondImage),
        thirdImage: filterImageData(data.attributes.thirdImage),
      },
    };

    return { data: filteredData };
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
        where: { isFeatured: true },
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
      ...product,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    });

    const formattedLatestProducts = latestProducts.map(formatProductData);
    const formattedFeaturedProducts = featuredProducts.map(formatProductData);

    const data = {
      latestProducts: formattedLatestProducts,
      featuredProducts: formattedFeaturedProducts,
    };

    return ctx.send(data);
  },

  async relatedProducts(ctx) {
    const { id } = ctx.params;
    console.log("id aqui", id);

    const product = await strapi.entityService.findOne(
      "api::product.product",
      id,
      {
        populate: ["categorie"],
      }
    );

    if (!product) {
      return ctx.notFound("Produto não encontrado");
    }

    const relatedProducts = await strapi.entityService.findMany(
      "api::product.product",
      {
        where: {
          categorie: product.categorie.id,
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
      ...product,
      mainImage: formatImageData(product.mainImage),
      secondImage: formatImageData(product.secondImage),
      thirdImage: formatImageData(product.thirdImage),
    });

    const formattedRelatedProducts = relatedProducts.map(formatProductData);

    return ctx.send(formattedRelatedProducts);
  },
}));

const filterImageData = (image) => {
  if (!image) return null;
  const { url, formats } = image.data.attributes;
  return {
    url,
    formats: Object.keys(formats).reduce((acc, key) => {
      acc[key] = {
        url: formats[key].url,
        height: formats[key].height,
        width: formats[key].width,
      };
      return acc;
    }, {}),
  };
};
