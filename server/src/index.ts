import express from 'express';
import { quizRouter  } from './router/router';
import cors from 'cors';
import path from 'path';

export const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cors());
app.use(quizRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})