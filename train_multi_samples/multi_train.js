/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 */

const fs = require('fs');
const fetch = require('node-fetch');


function validateSamples(samples) {
  return fetch('https://api.wit.ai/samples?v=20170307', {
    method: 'POST',
    headers: {
      Authorization: `Bearer TPCV2XD22ZEC7Q6ERVIX5TNJULNZ4UIF`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(samples),
  })
    .then(res => res.json())
}

const TAB = '	';
const data = fs
  .readFileSync('./data.tsv', 'utf-8')
  .split('\r')
  .map(row => row.split(TAB));

const samples = data.map(([text, value]) => {
  return {
    text,
    entities: [
      {
        entity: 'intent',
        value,
      },
    ],
  };
});

validateSamples(samples)
  .then(res => console.log(res));
