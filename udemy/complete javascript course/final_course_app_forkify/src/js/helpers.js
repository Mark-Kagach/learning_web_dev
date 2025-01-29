import { TIMEOUT_SEC } from './config.js';
import { uploadRecipe } from './model.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // we use race of the url fetch with the timeout promise because people could have a bad connection
    // and the fetch could take forever. To avoid that we race it with the timeout promise

    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // we can't just alert the error because getJSON is an async function, so it returns a promise
    // and the promise will be resolved, not rejected, so in model.js we won't be able to catch error
    // alert(err);
    // to fix that we need to re-throw the error, so the promise is returned as rejected
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // we use race of the url fetch with the timeout promise because people could have a bad connection
    // and the fetch could take forever. To avoid that we race it with the timeout promise

    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    // we can't just alert the error because getJSON is an async function, so it returns a promise
    // and the promise will be resolved, not rejected, so in model.js we won't be able to catch error
    // alert(err);
    // to fix that we need to re-throw the error, so the promise is returned as rejected
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // we can't just alert the error because getJSON is an async function, so it returns a promise
    // and the promise will be resolved, not rejected, so in model.js we won't be able to catch error
    // alert(err);
    // to fix that we need to re-throw the error, so the promise is returned as rejected
    throw err;
  }
};
*/
