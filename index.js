// import 'dotenv/config'
// import express from 'express';
// import { initApp } from './src/module/app.router.js';

// const app = express();
//  const PORT = process.env.PORT || 3000;

// initApp(app,express)


// app.listen(PORT, ()=>{
// console.log( `server is running... ${PORT}`)
// })
import 'dotenv/config';
import express from 'express';
import { initApp } from './src/module/app.router.js';
// import connectDB from './DB/connection.js';

const app = express();
const PORT = process.env.PORT || 3000;

// connectDB();

initApp(app, express);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
