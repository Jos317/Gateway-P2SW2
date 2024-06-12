// prediction-service/index.js
const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
  type Data {
    year: Int
    month: Int
    monto: Float
  }

  type PredictBetweenDatesWithMonths {
    original_data: [Data]
    predictions: [Data]
  }

  type DetectAnomalies {
    original_data: [Data]
    anomalies: [Data]
  }

  extend type Query {
    predictBetweenDatesWithMonths(startDate: String!, numberOfMonths: Int!): PredictBetweenDatesWithMonths
    detectAnomalies: DetectAnomalies
  }
`;

const resolvers = {
  Query: {
    predictBetweenDatesWithMonths: async (_, { startDate, numberOfMonths }) => {
      const response = await fetch('http://82.197.67.22:8080/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              predictBetweenDatesWithMonths(startDate: "${startDate}", numberOfMonths: ${numberOfMonths}) {
                original_data {
                  year
                  month
                  monto
                }
                predictions {
                  year
                  month
                  monto
                }
              }
            }
          `,
        }),
      });
      const result = await response.json();
      return result.data.predictBetweenDatesWithMonths;
    },
    detectAnomalies: async () => {
      const response = await fetch('http://82.197.67.22:8080/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
                detectAnomalies {
                    original_data {
                    year
                    month
                    monto
                    }
                    anomalies {
                    year
                    month
                    monto
                    }
                }
            }
                `,
        }),
      });
      const result = await response.json();
      return result.data.detectAnomalies;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Prediction service ready at ${url}`);
});
