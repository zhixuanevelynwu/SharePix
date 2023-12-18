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

function updatePage(xhr) {
  if (xhr.status == 200) {
    let response = JSON.parse(xhr.responseText);
    let id = response["id"];
    let likes = response["likes"];
    updateLikes(id, likes);
    return;
  }
}

function updateLikes(id, likes) {
  let postList = document.getElementsByClassName("published-art")[0].childNodes;
  console.log(postList);
  console.log(postList[0]);
  console.log(id, likes);
}

/** Like work */
function like(e, entry) {
  let liked = false;
  if (e.classList.contains("liked")) {
    e.classList.remove("liked");
  } else {
    e.classList.add("liked");
    liked = true;
  }
  console.log(entry);
  // Initialize a new XML HTTP request
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) {
      return;
    }
    updatePage(xhr);
  };

  // Make post
  xhr.open("POST", "/sharepix/like-work", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(
    "liked=" +
      liked +
      "&csrfmiddlewaretoken=" +
      getCSRFToken() +
      "&pid=" +
      entry
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
