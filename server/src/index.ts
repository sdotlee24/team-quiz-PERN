import express from 'express';
import { quizRouter  } from './router/router';
const app = express();
app.use(quizRouter);




app.listen(3000, () => {
    console.log("listening on port 3000");
})