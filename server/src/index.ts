import express from 'express';
import { quizRouter  } from './router/router';
import cors from 'cors';
const app = express();
app.use(cors());


app.use(quizRouter);


app.listen(3001, () => {
    console.log("listening on port 3001");
})