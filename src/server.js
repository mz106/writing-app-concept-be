require("dotenv").config();
const express = require("express");
const connection = require("./db/connection");
const app = express();

const { WebSocket } = require("ws");

const Text = require("./db/models/text");

app.use(express.json());

connection();

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  let newText;
  ws.on("message", async function incoming(message) {
    // Parse the WebSocket message and save to MongoDB
    // console.log("message: ", message);
    const textData = JSON.parse(message);
    console.log("textData: ", textData);
    try {
      if (textData.textId === "") {
        console.log("inside no textid");
        newText = await Text.create({ text: textData.text });
        console.log(newText);
        const returnMessage = JSON.stringify({ id: newText._id });
        console.log("return message: ", returnMessage);
        ws.send(returnMessage);
        return;
      }
      console.log("");
      newText = await Text.findByIdAndUpdate(textData.textId, {
        text: textData.text,
      });
      console.log("netText: ", newText);
      // newText = await Text.create({ text: textData.text });
      const updated = await Text.findOne({ _id: textData.textId });
      console.log("updated: ", updated);
      const returnMessage = JSON.stringify({ id: textData.textId });
      ws.send(returnMessage);
      // newText = await Text.create({ text: textData.text });

      // const returnMessage = JSON.stringify(newText._id);
      // ws.send(returnMessage);
      console.log("Text saved to MongoDB:", newText);
    } catch (error) {
      console.error("Error saving text to MongoDB:", error);
    }
  });
});

app.listen(5001, () => {
  console.log("connection: ", process.env.MONGO_URI);
  console.log("Server is listening on port 5001");
});
