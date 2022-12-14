import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
const port = process.env.PORT || 4000;
const mongodbURI =
  process.env.mongodbURI ||
  "mongodb+srv://abc:abc@cluster0.qgyid76.mongodb.net/productdatabase?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());

let products = []; // TODO: connect with mongodb instead

let productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  createdOn: { type: Date, default: Date.now },
});
// line 22 name find krne keley kia he agr sare string pr krna ho to   productSchema.index({"$**":"text"}) lgaen ge
// productSchema.index({name:"text"})
const productModel = mongoose.model("products", productSchema);

app.post("/product", (req, res) => {
  const body = req.body;

  if (
    // validation
    !body.name ||
    !body.price ||
    !body.description
  ) {
    res.status(400).send({
      message: "required parameters missing",
    });
    return;
  }

  console.log(body.name);
  console.log(body.price);
  console.log(body.description);

  productModel.create(
    {
      name: body.name,
      price: body.price,
      description: body.description,
    },
    (err, saved) => {
      if (!err) {
        console.log(saved);

        res.send({
          message: "product added successfully",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});

app.get("/products", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "got all products successfully",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
// id pr 1 product ka data mangane keley

// app.get("/product/:id", (req, res) => {
//   const id = req.params.id;

//   productModel.findOne({ _id: id }, (err, data) => {
//     if (!err) {
//       if (data) {
//         res.send({
//           message: `get product by id: ${data._id} success`,
//           data: data,
//         });
//       } else {
//         res.status(404).send({
//           message: "product not found",
//         });
//       }
//     } else {
//       res.status(500).send({
//         message: "server error",
//       });
//     }
//   });
// });

// name find krne keley

app.get("/product/:name", (req, res) => {
console.log(req.params.name);
const querryName = req.params.name;
  productModel.find({ name:{$regex:`${querryName}`}}
    , (err, data) => {
    if (!err) {
      if (data) {
        res.send({
          message: `get product by success`,
          data: data,
        });
      } else {
        res.status(404).send({
          message: "product not found",
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
app.delete("/product/:id", (req, res) => {
  const id = req.params.id;

  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("deleted: ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully",
        });
      } else {
        res.status(404);
        res.send({
          message: "No Product found with this id: " + id,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
app.put("/product/:id", async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body.name || !body.price || !body.description) {
    // is trh jo api response message de ius ko self document api kehte hen
    res.status(400).send(` required parameter missing. example request body:
      {
          "name": "value",
          "price": "value",
          "description": "value"
      }`);
    return;
  }

  try {
    let data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("updated: ", data);

    res.send({
      message: "product modified successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
});

const __dirname = path.resolve();
app.use(
  "/",
  express.static(path.join(__dirname, "./five_princple_rest_api/build"))
);
app.use(
  "*",
  express.static(path.join(__dirname, "./five_princple_rest_api/build"))
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect(mongodbURI);

mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
