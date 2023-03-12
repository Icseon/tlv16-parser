module.exports = {

    /**
     * @author Icseon
     * @param buffer
     * @returns {Promise<[]>}
     */
    async read(buffer)
    {

        /* Array containing parsed TLVs */
        let parsed = [];

        /* Define packet offset */
        let offset = 0;

        while (offset < buffer.length)
        {

            /* Read packet type */
            const type = buffer.readUInt16LE(offset);
            const typeBytes = buffer.slice(offset, offset + 2);
            offset += 2;

            /* Read packet length */
            const length = buffer.readUInt16LE(offset);
            const lengthBytes = buffer.slice(offset, offset + 2);
            offset += 2;

            /* Read packet value */
            const value = buffer.slice(offset, offset + length);
            offset += length;

            /* Compute full buffer */
            const fullLength = typeBytes.length + lengthBytes.length + value.length;
            const fullBuffer = Buffer.concat([ typeBytes, lengthBytes, value ], fullLength);

            /* Add to parsed array */
            parsed.push({ type, length, value, fullBuffer });

        }

        return parsed;

    },

    /**
     * @author Icseon
     * @param buffer
     * @returns {Promise<[]>}
     */
    async read_strings(buffer)
    {

        /* Array containing strings that we were able to find in the buffer */
        const strings = [];

        /* Start offset */
        let start = 0;

        /* Loop through every byte in the buffer */
        for (let i = 0; i < buffer.length; i++)
        {

            /* If we've hit a null byte, we'll finalize our string */
            if (buffer[i] === 0x00)
            {
                const string = buffer.toString('utf8', start, i);

                if (string.length > 0)
                {

                    /* If the string length is greater than zero, we'll add it to our results */
                    strings.push(string);

                }

                start = i + 1;
            }

        }

        return strings;

    },

    /**
     * @author Icseon
     * @param buffer
     * @param string
     * @returns {Promise<void>}
     */
    async write_string(buffer, string)
    {
        return buffer.write(string, buffer.length);
    },

    /**
     * @author Icseon
     * @param type
     * @param value
     * @returns {Promise<Buffer>}
     */
    async build(type, value)
    {

        /* Create a buffer from the value */
        const buffer = Buffer.from(value);

        /* Get length of the buffer */
        const length = buffer.length;

        /* Allocate a new buffer for the TLV message with a size of 4 (type + length fields) plus the length of the value */
        const tlvBuffer = Buffer.alloc(4 + length);

        /* Write the type to the first two bytes of the TLV buffer using the writeUInt16BE method */
        tlvBuffer.writeUInt16LE(type, 0);

        /* Write the length to the next two bytes of the TLV buffer using the writeUInt16BE method */
        tlvBuffer.writeUInt16LE(length, 2);

        /* Finally, copy the value buffer into the TLV buffer starting from the 4th byte */
        buffer.copy(tlvBuffer, 4);

        /* Return the buffer to the stack */
        return tlvBuffer;

    }

}
