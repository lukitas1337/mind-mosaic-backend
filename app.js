const express = require("express");
const { neon } = require("@neondatabase/serverless");

const PORT = 8000;
const app = express();
app.use(express.json());
const sql = neon(
  "postgresql://neondb_owner:HzSmBMAT0yu4@ep-delicate-bush-a5lmrzuk.us-east-2.aws.neon.tech/neondb?sslmode=require"
);

app.get("/api/v1/blogPosts", async (req, res) => {
  const blogPosts = await sql`SELECT * FROM BlogPosts`;

  res.status(200).json(blogPosts);
});

app.get("/api/v1/blogPosts/:id", async (req, res) => {
  const id = req.params.id * 1;
  const post =
    await sql`SELECT name,author,content,date FROM BlogPosts WHERE id= ${id}`;
  res.status(200).json(post);
});

app.post("/api/v1/blogPosts", async (req, res) => {
  await sql`INSERT INTO BlogPosts (name, author, content)
VALUES (${req.body.name}, ${req.body.author}, ${req.body.content})`;
  const blogPosts = await sql`SELECT * FROM BlogPosts`;
  res.status(201).json(blogPosts);
});

app.put("/api/v1/blogPosts/:id", async (req, res) => {
  const id = req.params.id * 1;
  const updatedPost = req.body;
  await sql`UPDATE BlogPosts
SET name = ${req.body.name}, author = ${req.body.author} ,content = ${req.body.content}
WHERE id = ${id};`;
  const blogPosts = await sql`SELECT * FROM BlogPosts`;
  res.status(200).json(blogPosts);
});

app.delete("/api/v1/blogPosts/:id", async (req, res) => {
  const id = req.params.id * 1;
  await sql`DELETE FROM BlogPosts WHERE id = ${id}`;
  const posts = await sql`SELECT * FROM BlogPosts`;
  res.status(204).json(posts);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1/blogPosts`);
});
