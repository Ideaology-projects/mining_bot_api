declare module 'swagger-jsdoc' {
  export interface SwaggerDefinition {
    openapi: string;
    info: {
      title: string;
      version: string;
      description?: string;
    };
    servers?: Array<{ url: string }>;
    [key: string]: any;
  }

  export interface Options {
    definition: SwaggerDefinition;
    apis: string[];
  }

  function swaggerJSDoc(options: Options): object;
  export = swaggerJSDoc;
}
