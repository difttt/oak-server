var express = require("express");
var router = express.Router();
var uuid = require("uuid");
const { Keyring } = require("@polkadot/keyring");
const { ApiPromise, WsProvider } = require('@polkadot/api');

var oak_js_library = require("oak-js-library");
var oakConstants = oak_js_library.oakConstants;
var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.STUR);
var types = require("@polkadot/api/types");

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

async function buildExtrinsic() {
  // known mnemonic, well, now it is - don't use it for funds
  const MNEMONIC =
    "when flight maximum result trim wool legal emotion major photo alien emotion";

  // type: ed25519, ssFormat: 42 (all defaults)
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 51 });
  const account_pair = keyring.createFromUri(MNEMONIC);

  const senderAddress = "68H3fAKnJ6ahvzgcayZGoE7Rg7v828in5xjvouaQdginBgtu";

  const providedID = uuid.v4();
  console.log("####### providedID", providedID);

  const recurrer = new oak_js_library.Recurrer()
  const recurrences = 3
  // output is a 5-item array of unix timestamps
  const timestamps = recurrer.getHourlyRecurringTimestamps(Date.now(), recurrences)

  for (let index = 0; index < timestamps.length; index++) {
    const element = timestamps[index];
    timestamps[index] = Math.floor(element / 1000);
  }

  const message = "Subscription Notification";
  
  let hex = await scheduler.buildScheduleNotifyExtrinsic(
    account_pair,
    providedID,
    timestamps,
    message,
  );

  return hex
}

async function sendExtrinsic() {
  const customErrorHandler = (result) => {
    console.error("###### error", JSON.stringify(result));
  };
  let hex = await buildExtrinsic();
  console.log("###before send hex");
  const txHash = await scheduler.sendExtrinsic(hex, customErrorHandler);
  console.log("###after send hex");

  console.log("###txHash", txHash);

  return txHash;
}

module.exports = router;
