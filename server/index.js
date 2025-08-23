
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
const routes = require('./routes');
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Zero Sum Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
