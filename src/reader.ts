import * as fs from 'node:fs';
import yaml from 'js-yaml';

const acceptedExtensions = ['.json', '.yaml', '.yml'];

const readFileAsync = async (path: string) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Reads a CloudFormation template from the given path.
 * The template can be either JSON or YAML.
 *
 * @param path Path to the CloudFormation template
 * @throws Error if the file extension is not one of the accepted extensions
 */
export const readTemplate = async (path: string) => {
  const extension = path.substring(path.lastIndexOf('.'));
  if (!acceptedExtensions.includes(extension)) {
    throw new Error(
      `Invalid input extension "${extension}". Accepted extensions are ${acceptedExtensions.join(
        ', '
      )}.`
    );
  }
  const fileContent = await readFileAsync(path);

  // Check if the file is valid JSON or YAML
  switch (extension) {
    case '.json':
      try {
        JSON.parse(fileContent);
      } catch (e) {
        throw new Error(`Invalid JSON file: ${e}`);
      }
      break;
    case '.yaml':
    case '.yml':
      try {
        yaml.load(fileContent);
      } catch (e) {
        throw new Error(`Invalid YAML file: ${e}`);
      }
      break;
  }

  return fileContent;
};
