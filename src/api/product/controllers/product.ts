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

    // Chama a função padrão do find
    const { data, meta } = await super.find(ctx);

    // Personalize a resposta para incluir apenas os campos desejados
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
}));

// Função para filtrar os dados da imagem
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
