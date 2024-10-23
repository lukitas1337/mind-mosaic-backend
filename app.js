import express from "express";
import dotenv from "dotenv";
import { queryDB } from "./db.js";
import cors from "cors";
// const { neon } = require("@neondatabase/serverless");
dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json(), cors());

app.get("/api/v1/blogPosts", async (req, res) => {
  try {
    const blogPosts = await queryDB(`SELECT * FROM BlogPosts`);
    res.status(200).json(blogPosts);
  } catch (error) {
    console.log("can not fetch the data: " + error);
    res.status(500).json({ error: "can not fetche the data" });
  }
});

app.get("/api/v1/blogPosts/:id", async (req, res) => {
  try {
    const id = req.params.id * 1;
    const post = await queryDB(
      `SELECT name,author,content,date FROM BlogPosts WHERE id=$1 `,
      [id]
    );
    res.status(200).json(post);
  } catch (error) {
    console.log("can not fetch the data: " + error);
    res.status(500).json({ error: "can not fetch the data" });
  }
});

app.post("/api/v1/blogPosts", async (req, res) => {
  try {
    const { title, author, content } = req.body;
    await queryDB(
      `INSERT INTO BlogPosts (name, author, content)
  VALUES ($1, $2, $3) RETURNING *`,
      [title, author, content]
    );
    const blogPosts = await queryDB(`SELECT * FROM BlogPosts`);
    res.status(201).json(blogPosts);
  } catch (error) {
    console.log("can not create the data: " + error);
    res.status(500).json({ error: "can not create the data" });
  }
});

app.put("/api/v1/blogPosts/:id", async (req, res) => {
  try {
    const id = req.params.id * 1;
    const { name, author, content } = req.body;
    await queryDB(
      `UPDATE BlogPosts
  SET name = $1, author = $2 ,content = $3
  WHERE id = $4 RETURNING *`,
      [name, author, content, id]
    );
    const blogPosts = await queryDB(`SELECT * FROM BlogPosts`);
    res.status(200).json(blogPosts);
  } catch (error) {
    console.log("can not update the data: " + error);
    res.status(500).json({ error: "can not update the data" });
  }
});

app.delete("/api/v1/blogPosts/:id", async (req, res) => {
  try {
    const id = req.params.id * 1;
    await queryDB(`DELETE FROM BlogPosts WHERE id = $1 RETURNING *`, [id]);
    const posts = await queryDB(`SELECT * FROM BlogPosts`);
    res.status(200).json(posts);
  } catch (error) {
    console.log("can not delete the data: " + error);
    res.status(500).json({ error: "can not delete the data" });
  }
});
app.get("*", (req, res) => {
  res.status(500).send("Server error!");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1/blogPosts`);
});
