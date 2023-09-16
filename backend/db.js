const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
var Todo = require("./todo");

const uri =
  "mongodb+srv://duyguduygu:123@tododb.2tvok6t.mongodb.net/?retryWrites=true&w=majority";

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB'ye başarıyla bağlandı");

    const express = require("express");
    const app = express();
    app.use(express.json());

    const cors = require("cors");
    app.use(
      cors({
        credentials: true,
        origin: ["*"],
      })
    );

    app.get("/api/getall", async (req, res) => {
      try {
        const todos = await Todo.find({});
        res.send(todos);
      } catch (err) {
        console.error("Verileri alırken hata oluştu:", err);
        res.status(500).send("Verileri alırken hata oluştu");
      }
    });

    app.post("/api/add", async (req, res) => {
      try {
        const { work } = req.body;
        const todo = await Todo({
          work: work,
          isCompleted: false,
        });
        await todo.save();
        res.send({ message: "Todo kaydı başarılı" });
        
      } catch (err) {
        console.error("Verileri kaydederken hata oluştu:", err);
        res.status(500).send("Verileri kaydederken hata oluştu");
      }
    });

    app.post("/api/delete", async (req, res) => {
        try {
          const { _id } = req.body;
          const result = await Todo.deleteOne({ _id });
      
          if (result.deletedCount === 1) {
            res.send({ message: "Todo silme işlemi başarılı" });
          } else {
            res.status(404).send({ message: "Belirtilen _id'ye sahip bir Todo bulunamadı" });
          }
        } catch (err) {
          console.error("Verileri silerken hata oluştu:", err);
          res.status(500).send("Verileri silerken hata oluştu");
        }
      });

    app.post("/api/update", async(req, res) => {
      try {
        const newTodo = await Todo(req.body);
        await Todo.findByIdAndUpdate(newTodo._id, newTodo);
        res.send({ message: "Todo kaydı başarılı" });
      } catch (err) {
        console.error("Verileri güncellerken hata oluştu:", err);
        res.status(500).send("Verileri güncellerken hata oluştu");
     
      }
    });

    const port = 5000;
    app.listen(port, () => {
      console.log("http://localhost:" + port + " üzerinde dinleniyor.");
    });
  } catch (error) {
    console.error("MongoDB'ye bağlanırken hata oluştu:", error);
  }
}

connectToMongoDB();
