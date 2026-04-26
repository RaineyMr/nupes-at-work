const bcrypt = require('bcrypt');

const users = [
  { email: 'member@nupesatwork.com',   password: 'Member123!'   },
  { email: 'employer@nupesatwork.com', password: 'Employer123!' },
  { email: 'mentor@nupesatwork.com',   password: 'Mentor123!'   },
  { email: 'admin@nupesatwork.com',    password: 'Admin123!'    },
];

Promise.all(users.map(async u => ({
  ...u,
  hash: await bcrypt.hash(u.password, 10)
}))).then(results => {
  results.forEach(r => console.log(`UPDATE users SET password = '${r.hash}' WHERE email = '${r.email}';`));
});
