"use strict";
/** Functions related to publishing artwork */
function publish() {
  // Get string representation of the canvas
  // https://github.com/processing/p5.js/issues/5263
  // https://stackoverflow.com/questions/38561578/xmlhttprequest-sending-image-file
  let myCanvas = document.getElementById("my-canvas");
  let dataURI = myCanvas.toDataURL("image/png");
  console.log(dataURI);

  // Initialize a new XML HTTP request
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) {
      return;
    }
    if (xhr.status == 200) {
      alert("Work published");
    } else {
      alert("Status: " + xhr.status);
    }
  };

  // Make post
  xhr.open("POST", "/sharepix/publish-work", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(
    "art=" +
      encodeURIComponent(dataURI) +
      "&csrfmiddlewaretoken=" +
      getCSRFToken()
  );
}

/** Helper functions */
function getDateTimeString() {
  let t = new Date();
  let ap = t.getHours() >= 12 ? "PM" : "AM";
  let h = t.getHours() >= 12 ? t.getHours() - 12 : t.getHours();
  let hstr = h < 10 ? "0" + h : h;
  let mstr = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
  let fstr =
    t.getMonth() +
    1 +
    "/" +
    t.getDate() +
    "/" +
    t.getFullYear() +
    " " +
    hstr +
    ":" +
    mstr +
    " " +
    ap;
  return fstr;
}

function getCSRFToken() {
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.startsWith("csrftoken=")) {
      return c.substring("csrftoken=".length, c.length);
    }
  }
  return "unknown";
}

function sanitize(s) {
  // Be sure to replace ampersand first
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
