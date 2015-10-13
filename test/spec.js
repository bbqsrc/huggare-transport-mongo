'use strict';

require('co-mocha');

const expect = require('chai').expect;

const huggare = require('huggare'),
      mongodb = require('mongodb'),
      MongoTransport = require('../index');

const MONGO_URL = 'mongodb://localhost:27017/huggareTransportTest';

describe('Mongo transport', function() {
  beforeEach(function*() {
    const db = yield (new mongodb.MongoClient()).connect(MONGO_URL);

    yield db.dropDatabase();

    yield db.close();
  });

  it('should create a record in the database', function*() {
    const db = yield (new mongodb.MongoClient()).connect(MONGO_URL);

    const logger = new huggare.Logger();

    logger.addTransport(MongoTransport({
      collection: db.collection('logs')
    }));

    logger.i('TestTag', 'This is a simple message');

    const r = yield db.collection('logs').findOne({ tag: 'TestTag' });

    expect(r).to.exist;
    expect(r.message).to.equal('This is a simple message');
  });

  it('should store a `data` property for extra metadata', function*() {
    const db = yield (new mongodb.MongoClient()).connect(MONGO_URL);

    const logger = new huggare.Logger();

    logger.addTransport(MongoTransport({
      collection: db.collection('logs')
    }));

    logger.i('TestTag', { meta: 'data' });

    const r = yield db.collection('logs').findOne({ tag: 'TestTag' });

    expect(r).to.exist;
    expect(r.data.meta).to.equal('data');
  });
});
