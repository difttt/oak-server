var express = require("express");
var router = express.Router();
var uuid = require("uuid");
const { Keyring } = require("@polkadot/keyring");
const { ApiPromise, WsProvider } = require("@polkadot/api");

var oak_js_library = require("oak-js-library");
var oakConstants = oak_js_library.oakConstants;

router.get("/", async function (req, res, next) {
  const txHash = await sendExtrinsic();
  // observer.getAutomationTimeTaskQueue();
  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    data: txHash,
  });
  //表示结束
  res.end();
});

async function buildExtrinsic(times, msg) {
  //MNEMONIC
  const MNEMONIC =
    "when flight maximum result trim wool legal emotion major photo alien emotion";

  // type: ed25519, ssFormat: 42 (all defaults)
  const keyring = new Keyring({ type: "sr25519", ss58Format: 51 });
  const account_pair = keyring.createFromUri(MNEMONIC);

  //1.address
  const senderAddress = "68H3fAKnJ6ahvzgcayZGoE7Rg7v828in5xjvouaQdginBgtu";

  //2.providedID
  const providedID = uuid.v4();
  console.log("####### providedID", providedID);

  const recurrer = new oak_js_library.Recurrer();
  // const recurrences = 3;
  let recurrences = times;
  console.log("####### recurrences", recurrences);
  //3.timestamps
  const timestamps = recurrer.getHourlyRecurringTimestamps(
    Date.now(),
    recurrences
  );

  for (let index = 0; index < timestamps.length; index++) {
    const element = timestamps[index];
    timestamps[index] = Math.floor(element / 1000);
  }

  //4.message
  // const message = "Subscription Notification";
  let message = msg;
  console.log("###### message", message);

  var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.STUR);
  
  //extrinsic object
  let hex = await scheduler.buildScheduleNotifyExtrinsic(
    account_pair,
    providedID,
    timestamps,
    message
  );

  return hex;
}

async function sendExtrinsic() {
  //error handler
  const customErrorHandler = (result) => {
    console.error("###### error", JSON.stringify(result));
  };

  //get hex
  let hex = await buildExtrinsic();
  console.log("###before send hex");

  var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.STUR);

  //convert tex and send extrinsic
  const txHash = await scheduler.sendExtrinsic(hex, customErrorHandler);
  console.log("###after send hex");

  console.log("###txHash", txHash);

  return txHash;
}

//post 请求，处理前端提供的数据
router.get("/extrinsic/:times/:message", async function (req, res) {
  //parse
  const extrinsicHex = req.params;
  console.log("parsed extrinsicHex:", extrinsicHex);

  let hex = await buildExtrinsic(extrinsicHex.times, extrinsicHex.message);
  console.log("built hex", hex);

  const txHash = await sendExtrinsic();

  res.send(txHash);

  res.end();
});

module.exports = router;
