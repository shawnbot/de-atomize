#!/usr/bin/env node
const posthtml = require('posthtml');
const fsp = require('fs-promise');
const deatomize = require('.');

fsp.readFile(process.argv[2] || '/dev/stdin')
  .then(buffer => {
    return posthtml()
      .use(deatomize({
        scope: {tag: /./}
      }))
      .process(buffer.toString(), {});
  })
  .catch(error => console.error(error))
  .then(result => {
    console.log(result.html || 'no html?');
  });
