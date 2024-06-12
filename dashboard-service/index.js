// prediction-service/index.js
const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const { buildFederatedSchema } = require('@apollo/federation');

class ApiService extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://152.67.56.238:5000/api/';
    }

    async gastosCategoriaTop5() {
        return this.get('gastos-categoria-top5');
    }

    async distribucionGastosPorCategoria() {
        return this.get('distribucion-gastos-por-categoria');
    }

    async promedioGastos() {
        return this.get('promedio-gastos');
    }
}

const typeDefs = gql`
    type CategoriaMonto {
        categoria: String
        monto: Float
    }

    type GastosCategoriaTop5 {
        IA: String
        top_5_categorias: [CategoriaMonto]
    }

    type DistribucionGastos {
        descripcion: String
        distribucion_gastos: [CategoriaMonto]
    }

    type PromedioGastos {
        descripcion: String
        promedio_gastos_por_anio: [PromedioAnual]
        promedio_gastos_por_dia: [PromedioDiario]
        promedio_gastos_por_mes: [PromedioMensual]
    }

    type PromedioAnual {
        anio: String
        promedio: Float
    }

    type PromedioDiario {
        dia: String
        promedio: Float
    }

    type PromedioMensual {
        mes: String
        promedio: Float
    }

    extend type Query {
        gastosCategoriaTop5: GastosCategoriaTop5
        distribucionGastosPorCategoria: DistribucionGastos
        promedioGastos: PromedioGastos
    }
`;

const resolvers = {
    Query: {
        gastosCategoriaTop5: async (_, __, { dataSources }) => {
            const response = await dataSources.apiService.gastosCategoriaTop5();
            return {
                IA: response.IA,
                top_5_categorias: response.top_5_categorias.map(([categoria, monto]) => ({
                    categoria,
                    monto,
                })),
            };
        },
        distribucionGastosPorCategoria: async (_, __, { dataSources }) => {
            const response = await dataSources.apiService.distribucionGastosPorCategoria();
            const distribucion_gastos = Object.entries(response.distribucion_gastos).map(([categoria, monto]) => ({
                categoria,
                monto,
            }));
            return {
                descripcion: response.descripcion,
                distribucion_gastos,
            };
        },
        promedioGastos: async (_, __, { dataSources }) => {
            const response = await dataSources.apiService.promedioGastos();
            const promedio_gastos_por_anio = Object.entries(response.promedio_gastos_por_anio).map(([anio, promedio]) => ({
                anio,
                promedio,
            }));
            const promedio_gastos_por_dia = Object.entries(response.promedio_gastos_por_dia).map(([dia, promedio]) => ({
                dia,
                promedio,
            }));
            const promedio_gastos_por_mes = Object.entries(response.promedio_gastos_por_mes).map(([mes, promedio]) => ({
                mes,
                promedio,
            }));
            return {
                descripcion: response.descripcion,
                promedio_gastos_por_anio,
                promedio_gastos_por_dia,
                promedio_gastos_por_mes,
            };
        },
    },
};

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    dataSources: () => ({
        apiService: new ApiService(),
    }),
});

server.listen({ port: 4002 }).then(({ url }) => {
    console.log(`Prediction service ready at ${url}`);
});
