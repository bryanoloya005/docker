const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

function requireSupabase(req, res, next) {
  if (!supabase) {
    return res.status(500).json({
      error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in your .env file."
    });
  }
  next();
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get("/api/products", requireSupabase, async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post("/api/products", requireSupabase, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const price = Number(req.body.price);

  if (!name || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Enter a product name and a valid non-negative price." });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ name, price })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put("/api/products/:id", requireSupabase, async (req, res) => {
  const name = String(req.body.name || "").trim();
  const price = Number(req.body.price);

  if (!name || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({ error: "Enter a product name and a valid non-negative price." });
  }

  const { data, error } = await supabase
    .from("products")
    .update({ name, price })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete("/api/products/:id", requireSupabase, async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Product deleted" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});
