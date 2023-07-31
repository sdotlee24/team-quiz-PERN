import express from 'express';
import { quizRouter  } from './router/router';
import cors from 'cors';
const app = express();
app.use(cors());


app.use(quizRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})