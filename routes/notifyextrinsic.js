var express = require("express");
var router = express.Router();
var uuid = require("uuid");
const { Keyring } = require("@polkadot/keyring");

var oak_js_library = require("oak-js-library");
var oakConstants = oak_js_library.oakConstants;
var scheduler = new oak_js_library.Scheduler(oakConstants.OakChains.TUR);
var observer = new oak_js_library.Observer(oakConstants.OakChains.TUR);

router.get("/", async function (req, res, next) {
  const txHash = await sendExtrinsic();
  // observer.getAutomationTimeTaskQueue();
  res.status(200);
  //把值返回给用户，json嵌套json
  res.send({
    success: true, //表示状态
    txHash,
  });
  //表示结束
  res.end();
});

async function buildExtrinsic() {
  // known mnemonic, well, now it is - don't use it for funds
  const MNEMONIC =
    "when flight maximum result trim wool legal emotion major photo alien emotion";

  // type: ed25519, ssFormat: 42 (all defaults)
  const keyring = new Keyring();
  const pair = keyring.createFromUri(MNEMONIC);

  const senderAddress = "68H3fAKnJ6ahvzgcayZGoE7Rg7v828in5xjvouaQdginBgtu";

  const providedID = uuid.v4();
  const timestamps = [1656838800, 1656838800];
  const message = "Subscription Notification";

  let hex = scheduler.buildScheduleNotifyExtrinsic(
    senderAddress,
    providedID,
    timestamps,
    message,
    pair
  );

  return hex;
}

async function sendExtrinsic() {
  const customErrorHandler = (result) => {
    console.error(result);
  };
  let hex = buildExtrinsic();
  const txHash = await scheduler.sendExtrinsic(hex, customErrorHandler);

  return txHash;
}

module.exports = router;
