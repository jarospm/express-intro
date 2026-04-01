import { Router } from 'express';
import { z } from 'zod';

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

// Zod schema for validating user input on POST /users
const UserSchema = z.object({
  name: z.string().min(3).max(12),
  age: z.number().min(18).max(100).optional().default(28),
  email: z.email().transform((s) => s.toLowerCase()),
});

// Zod schema for the login fields from RandomUser API
const RandomLoginSchema = z.object({
  results: z.array(
    z.object({
      login: z.object({
        username: z.string(),
      }),
      registered: z.object({
        date: z.string(),
      }),
    })
  ),
});

const router = Router();

// Fetch a random person from the external API and return name + country.
// .parse() validates the data at runtime and throws ZodError if it doesn't match.
router.get('/random-person', async (_req, res) => {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const parsed = RandomPersonSchema.parse(data);

  const person = parsed.results[0];

  res.json({
    fullName: `${person.name.first} ${person.name.last}`,
    country: person.location.country,
  });
});

// Accept a user object, validate with Zod, return 201 or 400
router.post('/users', (req, res) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(z.treeifyError(result.error));
    return;
  }

  res.status(201).json({ user: result.data });
});

// Fetch a random user's login info and registered date
router.get('/random-login', async (_req, res) => {
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const parsed = RandomLoginSchema.parse(data);

  const user = parsed.results[0];
  const registeredDate = user.registered.date.slice(0, 10);

  res.json({
    username: user.login.username,
    registeredDate,
    summary: `${user.login.username} (registered on ${registeredDate})`,
  });
});

export default router;
