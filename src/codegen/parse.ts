import { parseStruct, Decorator, ImportNode } from 'ts-file-parser';
import * as fs from 'fs';
// import * as path from 'path';
// import { ArrayType, BasicType } from 'ts-file-parser';

export interface DecoratedClassFieldMetadata {
  name: string;
  type: any;
  optional: any;
  decorators: Decorator[];
}

export interface DecoratedClassMetadata {
  name: string;
  decorators: Decorator[];
  fields: DecoratedClassFieldMetadata[];
}

export interface InputFileMetadata {
  name: string;
  imports: string[];
  classes: DecoratedClassMetadata[];
}

export const parseInputFiles = (files: string[]): InputFileMetadata[] => {
  return files.map((file) => {
    console.log(`Reading ${file}...`);
    const content = fs.readFileSync(file, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const structure = parseStruct(content, {}, file);

    //if (file.match(/^.*common.ts$/)) {
    //console.log(JSON.stringify(structure, null, 4));
    //}

    return {
      name: structure.name.replace(/\/+/g, '.'),
      imports: buildImports(structure._imports),
      classes: []
    };
  });
};

const buildImports = (importNodes: ImportNode[]): string[] => {
  return importNodes.map((iNode) => {
    return `import { ${iNode.clauses.join(', ')} } from ${iNode.absPathNode.join('/')}`;
  });
};
