const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Openlogo API Documentation",
      version: "1.0.0",
      description:
        "Openlogo is your partner in logo exploration. Our platform boasts a collection of APIs designed to simplify the process of obtaining company logos.",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
