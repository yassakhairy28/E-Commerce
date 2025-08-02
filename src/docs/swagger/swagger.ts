import swaggerJSDoc from "swagger-jsdoc";

// swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the E-Commerce platform",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/docs/**/*.swagger.ts"],
};
// generate swagger spec
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
