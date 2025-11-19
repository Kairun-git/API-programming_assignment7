import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import loginRoute from "./login.js";
import dataRoute from "./data.js";

const app = express();
app.use(express.json());

// Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Login route
app.use("/login", loginRoute);

// Data routes (functions from old code + token)
app.use("/data", dataRoute);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
