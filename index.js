'use strict';

const TAG = 'MongoTransport';

function MongoTransport(collection) {
  this.log = function log(ts, severity, tag, data) {
    /* eslint-disable consistent-this */

    // Kill feedback loop, eg a wtf occurred.
    if (tag === TAG) {
      return;
    }

    const logger = this;

    const record = {
      ts, severity, tag
    };

    // Check for message
    if (data.message) {
      record.message = data.message;
      delete data.message;
    }

    // Check for error
    if (data.err) {
      record.error = data.err;
      delete data.err;
    }

    record.data = data;

    collection.insertOne(record, err => {
      if (err) {
        logger.wtf(TAG, err);
      }
    });
  };
}

module.exports = opts => {
  const transport = new MongoTransport(opts.collection);

  return transport.log;
};
