var express = require("express");
var router = express.Router();
var uuid = require("uuid");

var oak_js_library = require("oak-js-library");
var oakConstants = oak_js_library.oakConstants;
var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.STUR);
var observer = new oak_js_library.Observer(oakConstants.OakChains.STUR);

router.get("/hash", async function (req, res, next) {
  //获取哈希
  const taskQueueTaskHashes = await observer.getAutomationTimeTaskQueue();

  res.status(200);

  res.send({
    success: true,
    hashes: taskQueueTaskHashes,
  });
  //表示结束
  res.end();
});

module.exports = router;
