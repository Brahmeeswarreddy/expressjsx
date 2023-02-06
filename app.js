const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json())

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is starting at 3000");
    });
  } catch (e) {
    console.log(`DB:Error${e.message}`);
    process.exit(1);
  }
};
app.get("/movies/",(request,response)=>{
    const getAllMovies=`
    SELECT 
    *
    FROM Movie 
    ORDER BY movie_id`;
    const movieArray=await db.all(getAllMovies);
    response.send(movieArray)
})

app.post("/movies/",(request,response)=>{
    const movieDetails=request.body;
    const {directorId,movieName,leadActor}=movieDetails;
    const addMovie=`
    INSERT INTO
    movie(movie_id,movie_name,lead_actor)
    VALUES 
    (`${directorId}`,`${movieName}`,`${leadActor}`)`
    const dbResponse=await db.run(addMovie);
    response.send("Movie Successfully Added")

})

app.get("/movies/:movieId/",async(request,response)=>{
    const {movieId}=request.params
    const getMovie=`
    SELECT * FROM movie
    WHERE movie_id=${movieId}`;
    const movie=await db.get(getMovie);
    response.send(movie)
})
app.put("/movies/:movieId/",(request,response)=>{
    const{movieId}=request.params
    const movieDetails=request.body;
    const{directorId,movieName,leadActor}=movieDetails;
    const updateMovie=`
    UPDATE movie 
    SET directorId=${directorId},movieName=${movieName},
    leadActor=${leadActor} 
    WHERE movieId=${movieId}`;
    await db.run(updateMovie);
    response.send("Movie Details Updated")

})
app.delete("/movies/:movieId/",(request,response)=>{
    const {movieId}=request.params;
    const deleteMovie=`
    DELETE FROM movie 
    WHERE movie_id=${movieId}`;
    await db.run(deleteMovie);
    response.send("Movie Removed")
})
app.get("/directors/",(request,response)=>{
    const getAllDirectors=`
    SELECT 
    *
    FROM director 
    ORDER BY directorId`;
    const DirectorArray=await db.all(getAllDirectors);
    response.send(DirectorArray)

})
app.get("/directors/:directorId/movies/",(request,response)=>{
        const{directorId}=request.params
    const allMovie=`
    SELECT * FROM movies ORDER BY directorId=${directorId}`;
    const directors=await db.all(allMovie);
    response.send(directors)
})