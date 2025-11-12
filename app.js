import express from "express";
import { data } from "./data.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
app.use(express.json());
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// GET /data
app.get("/data", (req, res) => {
  res.json(data);
});

// GET /data/:id
app.get("/data/:id", (req, res) => {
  let id = Number(req.params.id);
  let filtered = data.filter(item => item.id === id);
  if (filtered.length === 0)
    return res.status(404).json({ error: "Data not found" });

  let filteredItem = filtered[0];
  res.json(filteredItem);
});

// POST /data
app.post("/data", (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Unsupported Media Type");
  }

  let newItem = req.body;
  if (!newItem.forename || !newItem.surname) {
    return res.status(400).json({ error: "Invalid data" });
  }

  newItem.id = data.length ? data[data.length - 1].id + 1 : 1;
  data.push(newItem);

  res.status(201).json(newItem);
});

// DELETE /data/:id
app.delete("/data/:id", (req, res) => {
  let fid = data.findIndex(item => item.id == req.params.id);
  if (fid === -1)
    return res.status(404).json({ error: "Data not found" });

  data.splice(fid, 1);
  res.status(204).end();
});

// PUT /data/:id
app.put("/data/:id", (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Unsupported Media Type");
  }

  let id = Number(req.params.id);
  let fid = data.findIndex(item => item.id === id);

  if (fid === -1) {
    let newItem = { id, ...req.body };
    data.push(newItem);
    return res.status(201).json(newItem);
  }

  // อัปเดต field ตามคำใบ้
  data[fid].forename = req.body.forename;
  data[fid].surname = req.body.surname;

  res.status(200).json(data[fid]);
});

// POST /data/search
app.post("/data/search", (req, res) => {
  let { forename } = req.body;
  let filtered = data.filter(
    item => item.forename.toLowerCase() === forename.toLowerCase()
  );

  if (filtered.length === 0)
    return res.status(404).json({ error: "User not found" });

  res.status(200).json(filtered);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
