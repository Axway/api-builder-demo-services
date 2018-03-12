module.exports = {
    GetHeadlinesByCountry: {
        operationId: "GetHeadlinesByCountry",
        description: "Get the headlines filtered by country and category.",
        path: "/news/headlines",
		method: "get",
		// HACK FOR NOW UNTIL AXWAY REQUESTER UPDATED
        uri: `http://${(process.env.NEWS_HOST || 'localhost')}:${parseInt(process.env.NEWS_PORT) || 8080}/api/news/headlines`,
        parameters: {
            query: [
                {
                    "in": "query",
                    name: "country",
                    type: "string"
                },
                {
                    "in": "query",
                    name: "category",
                    type: "string"
                }
            ],
            header: [],
            path: [],
            formData: [],
            body: []
        },
        responses: {
            "200": {
                description: "Success."
            },
            "400": {
                description: "Bad Request"
            },
            "401": {
                description: "Authorization Required"
            },
            "500": {
                description: "Server Error"
            }
        },
        outputContentType: [
            "application/json"
        ],
        securityDefinitions: {
            basicAuth: {
                type: "basic",
                description: "Require authorized access to API"
            }
        }
    }
}
