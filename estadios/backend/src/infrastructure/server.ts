import { createServer } from './http/express.server.js';

const PORT = process.env.PORT || 4000;
const app = createServer();

app.listen(PORT, () => {
    console.log(`[Estadios Backend] Listening on port ${PORT}`);
});