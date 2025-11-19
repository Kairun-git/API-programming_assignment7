import { Router } from "express";
import { verifyToken } from "./login.js";

const router = Router();

// your original dataset
let data = [
    { id: 1, forename: "Tim", surname: "Berners-Lee" },
    { id: 2, forename: "Roy", surname: "Fielding" }
];

// GET /data
router.get("/", verifyToken, (req, res) => {
    res.json(data);
});

// GET /data/:id
router.get("/:id", verifyToken, (req, res) => {
    let id = Number(req.params.id);
    let filtered = data.filter(item => item.id === id);
    if (filtered.length === 0)
        return res.status(404).json({ error: "Data not found" });
    res.json(filtered[0]);
});

// POST /data
router.post("/", verifyToken, (req, res) => {
    if (!req.is("application/json"))
        return res.status(415).json({ error: "Unsupported Media Type" });

    let newItem = req.body;
    if (!newItem.forename || !newItem.surname)
        return res.status(400).json({ error: "Invalid data" });

    newItem.id = data.length ? data[data.length - 1].id + 1 : 1;
    data.push(newItem);

    res.status(201).json(newItem);
});

// PUT /data/:id
router.put("/:id", verifyToken, (req, res) => {
    if (!req.is("application/json"))
        return res.status(415).json({ error: "Unsupported Media Type" });

    let id = Number(req.params.id);
    let index = data.findIndex(item => item.id === id);

    if (index === -1) {
        let newItem = { id, ...req.body };
        data.push(newItem);
        return res.status(201).json(newItem);
    }

    data[index].forename = req.body.forename;
    data[index].surname = req.body.surname;
    res.status(200).json(data[index]);
});

// DELETE /data/:id
router.delete("/:id", verifyToken, (req, res) => {
    let index = data.findIndex(item => item.id == req.params.id);
    if (index === -1)
        return res.status(404).json({ error: "Data not found" });

    data.splice(index, 1);
    res.status(204).end();
});

// POST /data/query
router.post("/search", verifyToken, (req, res) => {
    let { forename } = req.body;
    let filtered = data.filter(item =>
        item.forename.toLowerCase() === forename.toLowerCase()
    );

    if (filtered.length === 0)
        return res.status(404).json({ error: "User not found" });

    res.status(200).json(filtered);
});

export default router;
