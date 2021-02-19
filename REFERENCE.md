## Troubleshooting guide

1. TypeScript error: Property 'year' has no initializer and is not definitely assigned in the constructor.

We need to add below to tsconfig.json

```json
"strictPropertyInitialization": false
```

2. Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

Add sourceType in parserOptions.

```js
'parserOptions': {
  'ecmaVersion': 12,
  'sourceType': 'module'
},
```

3. @typescript-eslint/parser loading error

Error

```
ESLint : Failed to load parser '@typescript-eslint/parser' declared in '.eslintrc.js': Cannot find module '@typescript-eslint/parser'
```

Config that giving us the error

```js
module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'parser': '@typescript-eslint/parser',
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  }
};
```

Update

```js
module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:fp/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    'fp',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
          extensions: ['.ts'],
          paths: ['node_modules/', 'node_modules/@types']
      },
      typescript: {},
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'radix': 'off',
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  },
  overrides: [
    // Models use classes and decorators
    {
      files: ['src/entities/*.ts'],
      rules: {
        'fp/no-class': 'off',
        'fp/no-this': 'off',
        'fp/no-mutation': 'off',
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['src/services/SessionService.ts'],
      rules: {
        'fp/no-mutation': ['off'],
        'fp/no-nil': ['off'],
      },
    },
  ]
};
```

3. Error: Error while loading rule '@typescript-eslint/await-thenable': You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.

This one is easy. We need to add tsconfig in the parserOptions.

```json
 "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "tsconfigRootDir": "functions" 
  },
  "plugins": ["@typescript-eslint"],
```

## DynamoDB

1. About local dynamodb setup

Our local DynamoDB setup will persist the data (see https://www.mydatahack.com/how-to-persist-data-in-local-dynamodb-docker-container).

Run `docker-compose up` to start the container then try to run these command to see if the container works.

Once the local DynamoDB is up, we can just use `yarn load-fixtures` to load the data by loadFixture.ts. It uses dynamodb-data-mapper to load the data from the fixture data.

```bash
# Create tables and load fixture data
yarn load-fixtures

# List Table
aws dynamodb list-tables --endpoint-url http://localhost:8111

# Scan table to check the loaded data
aws dynamodb scan --endpoint-url http://localhost:8111 --table-name local_movies

# Delete unnecessary tables
aws dynamodb delete-table --endpoint-url http://localhost:8111 --table-name Music 
```

2. Command example to create a table with CLI

```bash
# Create Table
aws dynamodb create-table \
--endpoint-url http://localhost:8111 \
--table-name Movies \
--attribute-definitions \
    AttributeName=Artist,AttributeType=S \
    AttributeName=SongTitle,AttributeType=S \
--key-schema \
    AttributeName=Artist,KeyType=HASH \
    AttributeName=SongTitle,KeyType=RANGE \
--provisioned-throughput \
    ReadCapacityUnits=10,WriteCapacityUnits=5


# Update table with GSI
aws dynamodb update-table \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --attribute-definitions AttributeName=title,AttributeType=S \
  --global-secondary-index-updates \
  "[{\"Create\":{\"IndexName\": \"MovieTitle-index\",\"KeySchema\":[{\"AttributeName\":\"title\",\"KeyType\":\"HASH\"}], \
  \"ProvisionedThroughput\": {\"ReadCapacityUnits\": 5, \"WriteCapacityUnits\": 5      },\"Projection\":{\"ProjectionType\":\"ALL\"}}}]"

# Query table with GSI
 aws dynamodb query \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --index-name MovieTitle-index \
  --key-condition-expression "title = :name" \
  --expression-attribute-values  '{":name":{"S":"Blade Runner"}}'

# Query table by ID (HashKey)
aws dynamodb query \
  --endpoint-url http://localhost:8111 \
  --table-name local_movies \
  --key-condition-expression "id = :id" \
  --expression-attribute-values  '{":id":{"S":"ea8663db-29e4-42bd-bf76-04b4b0e2f597"}}'
```

## Reference for Library Installations

1. Using apollo-server-lambda which uses apollo-server as a base and have the wrapper to create lambda handler to convert event data into graphql query.

```bash
yarn add apollo-server-lambda graphql
# build error not found these modules, so manually installed them.
yarn add bufferutil utf-8-validate
```

2. Using dynamodb-data-mapper as ORM and aws-sdk for connecting to DynamoDb

```bash
yarn add @aws/dynamodb-data-mapper aws-sdk @aws/dynamodb-data-mapper-annotations
```

3. Using serverless-offline to spin up lambda

```bash
yarn add --dev serverless-offline
```

## Reference for dynamodb-data-mapper annotation

This is from googling, but looking at the source code, I don't think it supports GSI or LSI with annotation.

```ts
@table('items')
class Item {
  @hashKey({ // <-- this is your normal hash key (shared by table and of LSI)
    indexKeyConfigurations:{
      ItemIdIndex: 'HASH' // The key (ItemIdIndex) is the name of the index; the value is the key type ('HASH' or 'RANGE')
    }
  })
  itemId: string;

  @rangeKey() // <-- this is your normal range key (not part of LSI)
  displayName: string;

  @attribute({
    // And this other attribute acts as the LSI's RangeKey
    indexKeyConfigurations: {
      ItemIdIndex: 'RANGE'
    }
  })
  foo: string;

  @attribute()
  bar: string;
}
```

## DynamoDB data mapper troubleshoot

1. Error: The number of conditions on the keys is invalid

`GetItem` in DynamoDB needs the same number of key conditions as the number of keys. So, the method below doesn't work when table has hash and range keys.

```ts
@Query(_returns => Movie)
  async Movie(@Arg("id") id: string) {
    return await mapper.get(Object.assign(new Movie, {
      id
    }));
  }
```

So, using query method is the way to go.

```ts
@Query(_returns => Movie)
  async Movie(@Arg("id") id: string) {
    return await mapper.query(Movie, { id });
  }
```

# GraphQL Queries and Mutations

1. Queries

```graphql
query getAllMovies {
  movies {
    id
    title
    year
    country
    director
    description
		whyShouldWeWatch
    language
    genra
    cast {
      character
      actor
    }
    quotes {
      quote
    }
  }
}

query getMovieById {
  movieById(id: "5a28c037-10b9-4bac-8ebe-87df63ad1b0b"){
    id
    title
    year
    country
    director
    description
		whyShouldWeWatch
    language
    genra
    cast {
      character
      actor
    }
    quotes {
      quote
    }
  }
}
```

2. Mutations

```graphql
mutation createMovie {
  createMovie(movie: {
    
      title: "Full Metal Jacket",
      year: 1887,
      country: "United States",
      director: "Stanley Kubrick",
      description: "A classic Vietnam war film by Kubric",
      whyShouldWeWatch: "The intensity of the subject matter, acting and storyline makes this film a must-see.",
      language: "English",
      genra: [
        "War"
      ],
      cast: [
        {
          character: "Private/Sergeant J. T. \"Joker\" Davis",
          actor: "Matthew Modine"
        },
        {
          character: "Private Leonard \"Gomer Pyle\" Lawrence",
          actor: "Vincent D'Onofrio"
        },
        {
          character: "Gunnery Sergeant Hartman",
          actor: "Lee Ermey"
        },
        {
          character: "Private/Sergeant \"Cowboy\" Evans",
          actor: "Arliss Howard"
        },
        {
          character: "Animal Mother",
          actor: "Adam Baldwin"
        }
      ],
      quotes: [
        {
          quote: "Soldiers: This is my rifle. There are many others like it, but this one is mine. My rifle is my best friend. It is my life. I must master it as I must master my life. Without me, my rifle is useless. Without my rifle, I am useless. I must fire my rifle true. I must shoot straighter than my enemy, who is trying to kill me. I must shoot him before he shoots me. I will. Before God I swear this creed: my rifle and myself are defenders of my country, we are the masters of our enemy, we are the saviors of my life. So be it, until there is no enemy, but peace. Amen."
        },
        {
          quote: "Gunnery Sgt. Hartman: I am Gunnery Sgt. Hartman, your senior drill instructor. From now on you will speak only when spoken to, and the first and last words out of your filthy sewers will be 'Sir.' Do you maggots understand that?"
        },
        {
          quote: "Pvt. Pyle: Seven-six-two-millimeter, full metal jacket."
        },
        {
          quote: "Gunnery Sgt. Hartman: There is no racial bigatory here. I don't look down on nigger, kikes, wogs or greasers. Here, you're all equally worthless."
        },
        {
          quote: "Gunnery Sgt. Hartman: Do you maggots understand that?,Soldiers: Sir, yes, sir,Gunnery Sgt. Hartman: Bullshit, I can't hear you."
        },
        {
          quote: "Alejandro Sosa: I told you a long time ago, you fucking little monkey, not to fuck me!"
        },
        {
          quote: "Gunnery Sgt. Hartman: Holy Jesus! What is that? What the fuck is that?! What is that, Pvt. Pyle?,Pvt. Pyle: Sir, a jelly doughnut, sir!,Gunnery Sgt. Hartman: A Jelly doughnut?"
        },
        {
          quote: "Da Nang Hooker: Well, baby, me so horny. Me so HORNY. Me love you long time. You party?"
        }
      ]
    }) {
      id
      title
      year
      country
      director
      description
      whyShouldWeWatch
      language
      genra
      cast {
        character
        actor
      }
      quotes {
        quote
      }
    }
}

```
