import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(
  path.join(__dirname, '../swagger/swagger.yml'),
);

const options = {
  definition: swaggerDocument,
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
