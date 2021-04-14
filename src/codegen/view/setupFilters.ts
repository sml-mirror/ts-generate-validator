import { outWarning } from './../utils/error';
import { Environment } from 'nunjucks';

export const setupFilters = (nsEnv: Environment): void => {
  nsEnv.addFilter('validatorPayloadValueFilter', (str: string, property: string) => {
    if (property !== 'typeDescription') {
      return str;
    }

    return str.replace(/\{[^{}]+\}{1}?/gm, (match) => {
      try {
        const typeDesc = JSON.parse(match);

        if (['nested', 'enum'].includes(typeDesc?.type)) {
          return match
            .split(',')
            .map((record) => {
              const [prop, val] = record.split(':');
              if (prop.indexOf('typeDescription') > -1) {
                const unescapedVal = val.replace(/["'`]+/gm, '');
                return [prop, unescapedVal].join(':');
              }
              return record;
            })
            .join(',');
        }

        return match;
      } catch (err) {
        outWarning(err.message);
        return match;
      }
    });
  });
};
