const express = require("express");
const cors = require("cors");
const conf = require("./config");
const api = require("./api");
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Test back-end" });
});

app.use("/api", api);

app.listen(conf.port, () => {
    console.log(`Server is running on port ${conf.port}.`);
});