
const express = require('express');
const cors = require('cors');
const levenshtein = require('fast-levenshtein');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const clipDatabase = [
  { phrase: "la crepe au sucre des bronzes", url: "/clips/bronzes_crepe.mp4" },
  { phrase: "c est pas faux", url: "/clips/kaamelott_cest_pas_faux.mp4" },
  { phrase: "je suis ton pere", url: "/clips/starwars_pere.mp4" }
];

function cleanText(input) {
  return input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[.,'"!?]/g, "").trim();
}

app.post('/api/search', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Aucune phrase fournie' });

  const cleanedQuery = cleanText(query);
  let bestMatch = null;
  let bestDistance = Infinity;

  clipDatabase.forEach(clip => {
    const dist = levenshtein.get(cleanedQuery, clip.phrase);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = clip;
    }
  });

  if (bestDistance <= 5) {
    res.json({ result: bestMatch });
  } else {
    res.json({ result: null });
  }
});

app.listen(PORT, () => {
  console.log(`ClipFinder backend running on http://localhost:${PORT}`);
});
