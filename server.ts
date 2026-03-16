import express from 'express';
import { z } from 'zod';

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get('/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// Zod schema — defines the expected shape of the RandomUser API response.
// Only includes the fields we need; Zod ignores extra fields by default.
const RandomPersonSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),
      location: z.object({
        country: z.string(),
      }),
    })
  ),
});

// Fetch a random person from the external API and return name + country.
// .parse() validates the data at runtime and throws ZodError if it doesn't match.
app.get('/random-person', async (_req, res) => {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const parsed = RandomPersonSchema.parse(data);

  const person = parsed.results[0];

  res.json({
    fullName: `${person.name.first} ${person.name.last}`,
    country: person.location.country,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
