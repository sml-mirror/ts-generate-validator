# ts-generate-validator

В ходе анализа популярных библиотек для валидации, таких как:

- validator.js
- class-validator
- yup
- joi
- ajv

стало понятно, что все они заставляют разработчика вручную писать валидационную схему. Т.е. во многом дублировать код на typescript.

Поэтому возникла идея сделать кодогенерацию валидации на основании TS описания. По примеру нашей библиотеки
https://www.npmjs.com/package/grunt-generate-view-model

Чего хотим от валидации:

1. изоморфность (возможность использования как на клиенте, так и на сервере);
2. не описывать отдельную схему валидации, а использовать typescript-описание;
3. для случаев, выходящих за рамки TS (проверка на соотвествие regexp, минимального значения, максимального значения и т.п.) использовать атрибуты;
4. возможность использования кастомной валидации в виде функции, возможно асинхронной;
5. асинхронная валидация;
6. мультиязычность (вывод ошибок валидации на разных языках);
7. удобство использования;

## Конфигурация

```
enum SeverityLevel {
    silent = 0,
    warning = 1,
    error = 2,
}

interface CodegenConfig {
    inputPath?: string;
    outputPath?: string;
    unknownPropertySeverityLevel?: SeverityLevel;
}

interface ValidationConfig {
    stopAtFirstError?: boolean;
    emailRegExp: RegExp;
    messages?: MessageMap;
    context?: any;
}

type GenerateValidatorConfig = CodegenConfig & ValidationConfig;
```

### Codegeneration:

`inputPath` - путь к папке с моделями для которых необходимо сгенерировать валидаторы (по умолчанию _"./src"_).
`outputPath` - путь к папке, в которой появятся сгенерированные валидаторы (по умолчанию _"./src/generated/validators"_).
`unknownPropertySeverityLevel` - уровень проверки неизвестных параметров (другие классы моделей без `@Validation` декораторов или свойства имеющие сложные типы без `@CustomValidation` декораторов):

- error - при генерации валидаторов выбрасывается ошибка
- warning - кодогенерация проходит, но в консоли появляется предупреждение об отсутствии валидации
- silent - кодогенерация проходит

(по умолчанию _"warning"_)

### Validation:

`stopAtFirstError` - не продолжать валидацию после первой найденной ошибки _(по умолчанию false)_.
`emailRegExp` - заменяет регулярное выражение по умолчанию для проверки email.
`messages` - словарь с сообщениями об ошибках _(по умолчанию используются стандартные сообщения на английском)_.
`context` - пользовательский контекст (данные), который доступен в валидаторах и функциях, генерирующих сообщения об ошибках.

### Настройка конфигурации для всего проекта

Файл `ts-generate-validator-config.json` может содержать GenerateValidatorConfig структуру для найстроки конфигурации кодогенерации и валидации.

### Настройка конфигурации во время работы приложения

`changeConfig(config: ValidationConfig)` - вызов функции в любом месте приложения изменяет глобально конфигурацию валидации.

## Валидатор JSON данных

```
<M extends Record<string, any>>(data: M, config?: ValidationConfig) => void | Promise<void>;

interface ValidationException {
    errors: ValidationError[];
}

interface ValidationError {
    field: string | string[];
    message: string;
}
```

Сгенерированная из класса-модели функция-валидатор данных является асинхронной, если хотя бы для одного из свойств в классе-модели добавлен асинхронный custom валидатор. Она принимает в качестве аргументов:
`data` - JSON данные для проверки
`config` - объект с параметрами конфигурации

**Результат выполнения:**
Пустой результат в результате успешной валидации. Если валидация завершилась неудачей, то выбрасывается `ValidationException`.

## Локализация

```
enum ValidationType = {
    number: "number",
    string: "string",
    boolean: "boolean",
}

type MessageMap = {
    [type: ValidationType]: {
        [validator: string]: Message
    }
}

type Message = string | MessageCreator;

type MessageCreator = ({
    model: string;
    field: string;
    value: string;
    expected: string;
    context: any;
}) => string
```

Сообщения об ошибках сгруппированы в карте по типу данных(type) и названию валидатора(validator).

Сообщения могу быть в виде строки или в виде функции, которая принимает первым аргументом объект со следующими параметрами:
`model` - название модели
`field` - название поля(свойства модели)
`value` - полученное значение
`expected` - ожидаемое значение
`context` - пользовательский контекст, переданный в функцию-валидатор или в декоратор `@Validation`

Например:

```
const map: MessagesMap = {
    number: {
        min: ({ expected }) => 'Минимально разрешенное количество ${expected}',
        type: 'Значение должно быть числом',
    }
}
```

## Декораторы

### Для классов-моделей

- `@Validation(config?: ValidationConfig)` - помечает класс, как требующий генерации функции-валидатора.

- `@RequiredOneOfValidation(fields: string[], message?: Message)` - добавляет к нескольким свойствам класса, перечисленным в первом аргументе fields, валидатор, проверяющий заполненность как минимум одного из указанных полей.

### Для свойств классов-моделей

- **all types**

  - `@TypeValidation(message: Message)` - заменяет стандартное сообщение об ошибке для валидатора типа.

  - `@CustomValidation(validator: CustomValidator, message: Message)` - добавляет к свойству пользовательский валидатор

  ```
  type CustomValidator = <
      M extends Record<string, any>,
      F extends keyof M,
      C extends any
  >(
      fieldValue: M[F],
      modelValues: M,
      context: C
  ) => boolean;
  ```

  - `@IgnoreValidation` - помечает свойство как игнорируемое в функции-валидаторе - оно не будет проверяться на соответствие типу, а любые примененные декораторы будут проигнорированы. По умолчанию значение этого свойства не добавляется к результату валидации, но это поведение может быть переопределено в свойстве `stripIgnored` в `ValidationConfig`.

- **number**

  - `@MinValidation(trashold: number, message?: Message)` - добавляет валидатор, который проверяет число на соответствие минимальному значению `trashold`(включительно).

  - `@MaxValidation(trashold: number, message?: Message)` - добавляет валидатор, который проверяет число на соответствие максимальному значению `trashold`(включительно).

  - `@EqualValidation(value: number, message?: Message)` - добавляет валидатор, который проверяет соответствие числа значению, переданному в первом аргументе.

  - `@NegativeValidation(message?: Message)` - добавляет валидатор, который проверяет - является ли число отрицательным.

  - `@PositiveValidation(message?: Message)` - добавляет валидатор, который проверяет - является ли число положительным.

  - `@IntegerValidation(message?: Message)` - добавляет валидатор, который проверяет - является ли число целым.

  - `@FloatValidation(message?: Message)` - добавляет валидатор, который проверяет - содержит ли число плавающую точку.

  - `@LessThanValidation(propName: string, message?: Message)` - добавляет валидатор, который проверяет - является ли число меньшим, чем число в свойстве `propName`.

  - `@MoreThanValidation(propName: string, message?: Message)` - добавляет валидатор, который проверяет - является ли число большим, чем число в свойстве `propName`.

  - `@EqualToValidation(propName: string, message?: Message)` - добавляет валидатор, который проверяет соответствие числа значению, содержащемуся в свойстве `propName`.

- **string**
  - `@TrimValidation(message?: Message)` - добавляет валидатор, который проверяет отсутствие пробелов в начале и конце строки.

  - `@LowercaseValidation(message?: Message)` - добавляет валидатор, который проверяет отсутствие заглавных букв в строке.

  - `@UppercaseValidation(message?: Message)` - добавляет валидатор, который проверяет отсутствие строчных букв в строке.

  - `@MinLengthValidation(trashold: number, message?: Message)` - добавляет валидатор, который проверяет длину строки на соответствие максимальному значению `trashold`(включительно).

  - `@maxLength(trashold: number, message?: Message)` - добавляет валидатор, который проверяет длину строки на соответствие максимальному значению `trashold`(включительно).

  - `@EmailValidation(message?: Message)` - добавляет валидатор, который проверяет - является ли строка корректным email адресом.

  - `@UrlValidation(message?: Message)` - добавляет валидатор, который проверяет - является ли строка корректным url адресом.

  - `@MatchValidation(regexp: RegExp, message?: Message)` - добавляет валидатор, который проверяет строку на соответствие регулярному выражению, переданному в первом аргументе.

  - `@EqualValidation(value: string, message?: Message)` - добавляет валидатор, который проверяет - соответствует ли строка значению, переданному в первом аргументе.

  - `@EqualToValidation(propName: string, message?: Message)` - добавляет валидатор, который проверяет - соответствует ли строка значению, содержащемуся в свойстве `propName`.
