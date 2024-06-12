const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'predictions', url: 'http://prediction-service:4001' },
            { name: 'dashboard', url: 'http://dashboard-service:4002' },
        ],
    }),
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Gateway ready at ${url}`);
});
