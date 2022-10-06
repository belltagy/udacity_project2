import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get( "/filteredimage", async ( req: Request, res: Response) => {
    const image_url:string  = req.query.image_url 

    // check the image_url query character
    if (!image_url) {
      return res.sendStatus(400).send({ message: "Incorrect url"});
    } 
  
    try {
      const imageUrlPath = await filterImageFromURL(image_url) 
      return  res.status(200).sendFile(imageUrlPath, async() => {
        await deleteLocalFiles([imageUrlPath]);
         }
       );
    } catch (err) {

      console.log(err)
      return res.status(422).send( { message: "Error in filtering image" } );

    }})

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();