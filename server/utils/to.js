/**
 * Util helper to reduce the use of try-catch blocks in
 * ES7 async/await code.
 *
 * Uses GO style error handling, first value is error
 * while second one is success data.
 *
 * We can use 'to' when writing our ES7 async/await code as
 * const [error, data] = await to(something-with-promise)
 * this way we don't have to write try-catch for error
 * handling, we just have to check for the error
 * constant or the data constant.
 *
 * ref: https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
 *
 * @param {Promise} promise
 * @returns {[*, *]} first element contains error(if any) or null and second element contains success data
 */
const to = promise => {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
};

module.exports = to;
