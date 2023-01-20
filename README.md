## tlv16-parser
Simple tlv16 data parser with string utility functions


## Usage
```js
const parser = require('tlv16-parser');

/* Read tlv16 messages */
const messages = await parser.read(data); // [ { type, length, value }, ... ]

/* Read strings from buffer */
const strings = await parser.read_strings(data); // [ 'Hello', 'Icseon' ]

/* Create tlv16 buffer */
const message = await parser.build(11000 /* f82a */, data);

/* Add string to buffer */
await parser.write_string(data, 'Hello');

```
