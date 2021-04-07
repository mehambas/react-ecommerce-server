require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, PUT, PATCH, POST, DELETE",
    credentials: true,
  })
)

const Schema = mongoose.Schema

mongoose.connect(process.env.BAGLANTI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// MONGODB SCHEMAS START//

const productSchema = {
  product_name: String,
  category: String,
  category_url: String,
  images: {
    one: String,
    two: String,
    three: String,
    four: String,
  },
  stock: {
    s: Number,
    m: Number,
    l: Number,
    xl: Number,
  },
  brand: String,
  description: Number,
  discount_price: Number,
  normal_price: Number,
  star: {
    count: Number,
    point: String,
  },
  color: String,
  parameters: {
    installments: String,
    guarantee: String,
    cargo: String,
  },
  sale_number: Number,
  gender: String,
}

const commentsSchema = {
  product_id: String,
  name: String,
  content: String,
  date: String,
  user_name: String,
  star: Number,
  like: Number,
  dislike: Number,
}

const categorySchema = {
  category_name: String,
  category_url: String,
  category_description: String,
}

// MONGODB SCHEMAS END //

// MONGODB MODELS START //

const Product = mongoose.model("Product", productSchema)
const Comment = mongoose.model("Comment", commentsSchema)
const Category = mongoose.model("Category", categorySchema)

// MONGODB MODELS END //

app.get("/", (req, res) => {
  res.send("hosgelmissen")
})

// ********** PRODUCT API *********** //
app.post("/api/product/create", (req, res) => {
  let product1 = new Product({
    product_name: "CAPSULE MYEABORSA - Across body bag",
    category: "Bags",
    category_url: "bags",
    images: {
      one:
        "https://img01.ztat.net/article/spp-media-p1/49694ed32cf1359c9db6c9866483c7e8/fe16f9d773044c4fb95ca70937083864.jpg?imwidth=1800&filter=packshot",
      two:
        "https://img01.ztat.net/article/spp-media-p1/1c3f43f88f65459593c7f10df995c9ea/b93e4c4ea4954a23b7150728986c25a7.jpg?imwidth=762",
      three:
        "https://img01.ztat.net/article/spp-media-p1/c69c27bb5a504759883bdcfda5f1c9e4/cb10042dd9f6484e8e386e2700aeb97d.jpg?imwidth=762",
      four:
        "https://img01.ztat.net/article/spp-media-p1/a9ff23a5d0964b058559a6cbce5b3f66/848f3ba59eb54a6193604d36fadf4ed9.jpg?imwidth=762",
    },
    stock: {
      s: 23,
      m: 13,
      l: 23,
      xl: 14,
    },
    brand: "Emporio Armani",
    description: `Outer material: Polyurethane
Fabric: Faux leather
Fastening: Magnet
Article number: EA851H051-K11
Height: 16 cm (Size One Size)
Length: 21 cm (Size One Size)
Width: 7 cm (Size One Size)
Carrying handle: 7 cm (Size One Size)
`,
    discount_price: 149.99,
    normal_price: 159.95,
    star: {
      count: 74,
      point: "4.6",
    },
    color: "denim/tabacco",
    parameters: {
      installments: "12 Months",
      guarantee: "30 Day return",
      cargo: "Free",
    },
    sale_number: 99,
    gender: "Female",
  })

  product1.save((err) => {
    if (!err) {
      res.send([
        {
          sonuc: "basarili",
        },
      ])
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

// -------- //

// PRODUCT DETAIL API //

app.get("/api/product/detail/:id", (req, res) => {
  Product.find({ _id: req.params.id }, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

// PRODUCT DETAIL END //

// SIMILAR PRODUCTS API START//
/* kategorisi ayni olan ve o kategoride cok satanlari getirebiliriz. */

app.get("/api/product/similar/:category_url/:product_id", (req, res) => {
  Product.find(
    {
      category_url: req.params.category_url,
      _id: { $nin: req.params.product_id },
    },
    (err, results) => {
      if (!err) {
        res.send(results)
      } else {
        res.send([
          {
            sonuc: "hata",
          },
        ])
      }
    }
  )
    .sort({ sale_number: -1 })
    .limit(5)
})

// SIMILAR PRODUCTS API END//

// FEATURED PRODUCTS API START //

app.get("/api/featuredproducts/:category_url", (req, res) => {
  Product.find({ category_url: req.params.category_url }, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
    .sort({ sale_number: -1 })
    .limit(5)
})

// FEATURED PRODUCTS API END //

// NEW ARRIVALS API START //

app.get("/api/newarrivals", (req, res) => {
  Product.find({}, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
    .sort({ _id: -1 })
    .limit(5)
})

// NEW ARRIVALS API END //

/************ COMMENTS API  *************+*/

app.get("/api/comments/:id", (req, res) => {
  Comment.find({ product_id: req.params.id }, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

app.post("/api/comment/create", (req, res) => {
  let comment1 = new Comment({
    product_id: req.body.product_id,
    name: req.body.name,
    content: req.body.content,
    date: "22-01-2020",
    user_name: req.body.user_name,
    star: req.body.star,
    like: 0,
    dislike: 0,
  })

  comment1.save((err) => {
    if (!err) {
      res.send([
        {
          sonuc: "basarili",
        },
      ])
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

/***************** CATEGORY API  +**********************/

app.get("/api/category/:category_url/:page", (req, res) => {
  let select = req.query.option
  let mySort = {}
  let brands =
    req.query.brand === null || req.query.brand === "" ? "" : req.query.brand
  let minPrice = parseInt(req.query.min)
  let maxPrice = parseInt(req.query.max)
  let searchCriterias = { category_url: req.params.category_url }

  if (minPrice > 0 && maxPrice === 0) {
    maxPrice = 9999999
  }
  if ((minPrice === 0 && maxPrice > 0) || (minPrice > 0 && maxPrice > 0)) {
    searchCriterias["discount_price"] = {
      $gt: minPrice,
      $lt: maxPrice,
    }
  }

  if (brands !== "") {
    let tempArr = brands.split(",")
    if (tempArr.length > 0) {
      searchCriterias["brand"] = {
        $in: tempArr,
      }
    }
  }

  if (select === "mostpopular") {
    mySort = {
      sale_number: -1,
    }
  } else if (select === "latestitems") {
    mySort = {
      _id: -1,
    }
  } else if (select === "cheapest") {
    mySort = {
      discount_price: 1,
    }
  }

  Product.find(searchCriterias, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
    .sort(mySort)
    .limit(4)
    .skip((req.params.page - 1) * 4)
})

app.get("/api/productcount/:category_url", (req, res) => {
  let brands =
    req.query.brand === null || req.query.brand === "" ? "" : req.query.brand
  let minPrice = parseInt(req.query.min)
  let maxPrice = parseInt(req.query.max)
  let searchCriterias = { category_url: req.params.category_url }

  if (minPrice > 0 && maxPrice === 0) {
    maxPrice = 9999999
  }
  if ((minPrice === 0 && maxPrice > 0) || (minPrice > 0 && maxPrice > 0)) {
    searchCriterias["discount_price"] = {
      $gt: minPrice,
      $lt: maxPrice,
    }
  }

  if (brands !== "") {
    let tempArr = brands.split(",")
    if (tempArr.length > 0) {
      searchCriterias["brand"] = {
        $in: tempArr,
      }
    }
  }

  Product.find(searchCriterias, (err, result) => {
    if (!err) {
      res.send({
        count: result.length,
      })
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

/* get brands according to categories */

app.get("/api/category/filter/brand/:category_url", (req, res) => {
  let category_url = req.params.category_url

  Product.distinct("brand", (err, results) => {
    if (!err) {
      res.send(results)
    } else {
      res.send(err)
    }
  })
})

///////////////////////// CATEGORY API ////////////////////

app.post("/api/category/create", (req, res) => {
  let category = new Category({
    category_name: req.body.name,
    category_url: req.body.url,
    category_description: req.body.description,
  })

  category.save((err) => {
    if (!err) {
      res.send({
        result: "successful",
      })
    } else {
      res.send({
        result: "error",
      })
    }
  })
})

/* get category */

app.get("/api/category/:category_url", (req, res) => {
  Category.find({ category_url: req.params.category_url }, (err, result) => {
    if (!err) {
      res.send(result)
    } else {
      res.send([
        {
          sonuc: "hata",
        },
      ])
    }
  })
})

app.listen(3001)
