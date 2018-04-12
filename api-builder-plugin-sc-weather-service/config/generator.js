const path = require("path")  // This file is created during the connector generation process

// Changing its content could break your connector
module.exports = {
    availableContexts: {
        apiBuilder: "apiBuilder",
        testApiBuilder: "testApiBuilder",
        plainJS: "plainJS"
    },
    regenerateWith: {
        name: "@axway/api-builder-plugin-sc-weather-service",
        api: "http://localhost:8080/apidoc/swagger.json",
        type: "openapi",
        force: true,
        dest: path.join(process.cwd(), ".."),
        path: path.join(__dirname, "..")
    },

    // If you know that there are more recent versions of your json files please update their content
    // To refresh the connector run 'npm run refresh' from the root of your connector
    swaggerJson: require("./swagger")
}