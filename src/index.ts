// src/index.ts
import express from 'express';
import * as ResourceController from './controllers/resourceController';
import connectToMongoDB from './connection_providers/mongoose.connection.provider';

const app = express();
const PORT = 3000;

app.get('/api/resource', ResourceController.getResource);

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
