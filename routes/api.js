var express = require("express");
var router = express.Router();
var uuid = require("uuid");

var oak_js_library = require("oak-js-library");
var oakConstants = oak_js_library.oakConstants;
var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.TUR);
var observer = new oak_js_library.Observer(oakConstants.OakChains.TUR);

//----------------------------------------------------------------

const extrinsic = [
  {
    senderAddress: "68H3fAKnJ6ahvzgcayZGoE7Rg7v828in5xjvouaQdginBgtu",
    providedID: 0,
    timestamps: [],
    message: "Subscription Notification",
    signer: "",
  },
];

// ------------------------------------------------

//定义一个json对象,用作给前端的请求返回值
const hash = [
  {
    id: 0,
    hash: "",
  },
];

router.get("/hash", function (req, res, next) {
  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data: hash,
  });
  //表示结束
  res.end();
});

//post 请求，处理前端提供的数据
router.post("/extrinsic", function (req, res) {
  //解析
  const extrinsicHex = req.body;
  console.log("extrinsicHex:", extrinsicHex);

  //增加
  extrinsic.push({
    senderAddress: "68H3fAKnJ6ahvzgcayZGoE7Rg7v828in5xjvouaQdginBgtu",
    providedID: uuid.v4(),
    ...extrinsicHex,
    signer: "15willis,",
  });

  sendExtrinsic();

  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    extrinsic,
  });
  //表示结束
  res.end();
});

//delete 请求，处理前端提供的数据
router.delete("/extrinsic/:id", function (req, res) {
  //解析
  const id = req.params.id;
  console.log("id:", id);

  extrinsic.forEach((item, key) => {
    if (item.providedID == id) {
      extrinsic.splice(key, 1);
    }
  });

  res.send({
    success: true, //表示状态
    extrinsic,
  });
  //表示结束
  res.end();
});

//----------------------------------------------------------------

const data = [
  {
    id: 1,
    title: "OAK API",
  },
];

//get request
router.get("/product", function (req, res, next) {
  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data,
  });
  //表示结束
  res.end();
});

//post 请求，处理前端提供的数据
router.post("/product", function (req, res) {
  //解析
  const product = req.body;
  console.log("product:", product);
  //增加
  data.push({
    ...product, //一个字段居然可以被赋值一个json
    id: new Date().getTime(),
  });

  console.log(data);

  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data,
  });
  //表示结束
  res.end();
});

//delete 请求，处理前端提供的数据
router.delete("/product/:id", function (req, res) {
  //解析
  const id = req.params.id;
  console.log("id:", id);

  data.forEach((item, key) => {
    if (item.id == id) {
      data.splice(key, 1);
    }
  });

  res.send({
    success: true, //表示状态
    data,
  });
  //表示结束
  res.end();
});

router.get("/", async function (req, res, next) {
  const taskQueueTaskHashes = await observer.getAutomationTimeTaskQueue();
  // observer.getAutomationTimeTaskQueue();

  const data1 = await observer.getAutomationTimeTaskQueue();

  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data1,
  });
  //表示结束
  res.end();
});

router.get("/", async function (req, res, next) {
  const taskQueueTaskHashes = await observer.getAutomationTimeTaskQueue();
  // observer.getAutomationTimeTaskQueue();

  const data1 = await observer.getAutomationTimeTaskQueue();

  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data1,
  });
  //表示结束
  res.end();
});

module.exports = router;
