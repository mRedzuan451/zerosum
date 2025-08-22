const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const routes = require('./routes');
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Zero Sum Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
