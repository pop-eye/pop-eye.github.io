"use strict";

(function () {
  if (!console) {
    console = {};
  }
  var old = console.log;
  var logger = document.getElementById("log");
  console.log = function (message) {
    var date = new Date();
    var dateStr =
      // ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      // ("00" + date.getDate()).slice(-2) + "/" +
      // date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);

    if (typeof message == "object") {
      logger.innerHTML +=
        `<code>isObject - ${dateStr} > ` +
        (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) +
        `</code> <hr />`;
    } else {
      logger.innerHTML += `<code>${dateStr} > ` + message + `</code> <hr />`;
    }
  };

  if (!("NDEFReader" in window)) {
    console.log(
      "Web NFC is not available. Please use Chrome Android 89 or above."
    );
  }
})();

scanButton.addEventListener("click", async () => {
  console.log("User clicked scan button");

  try {
    const ndef = new NDEFReader();
    await ndef.scan();
    console.log("Scan started");

    ndef.addEventListener("readingerror", () => {
      console.log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", (event) => {
      console.log("event = " + JSON.stringify(event));
      /*       console.log(
        `Serial Number: ${serialNumber} <br />> Records: (${JSON.stringify(
          message.records
        )})<br />)`
      );
 */
      const message = event.message;
      console.log("serialNumber = " + event.serialNumber + " records = " + JSON.stringify(message.records));
      for (const record of message.records) {
        console.log(
          "\n Record type:  " +
            record.recordType +
            "\n  MIME type:    " +
            record.mediaType +
            "\n  Record id:    " +
            record.id
        );
        switch (record.recordType) {
          case "text":
            // TODO: Read text record with record data, lang, and encoding.
            break;
          case "url":
            // TODO: Read URL record with record data.
            break;
          default:
          // TODO: Handle other records with record data.
        }
      }
    });
  } catch (error) {
    console.log("Argh! " + error);
  }
});

writeButton.addEventListener("click", async () => {
  console.log("User clicked write button");
  try {
    await ndef.write({
      records: [
        { recordType: "url", data: "https://w3c.github.io/web-nfc/" },
        { recordType: "url", data: "https://web.dev/nfc/" },
      ],
    });
    console.log(`Message written!`);
  } catch (error) {
    console.log(`Write failed :-( try again: ${error}.`);
  }

  /* try {
    const ndef = new NDEFReader();
    await ndef.write("Hello world!");
    console.log("Message written");
  } catch (error) {
    console.log("Argh! " + error);
  } */
});
