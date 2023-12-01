const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var _id;
  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Test Title',
        issue_text: 'Test Text',
        created_by: 'Test Creator',
        assigned_to: 'Test Assignee',
        status_text: 'Test Status'
      })
      .end(function (err, res) {
        _id = res.body._id;
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Test Title');
        assert.equal(res.body.issue_text, 'Test Text');
        assert.equal(res.body.created_by, 'Test Creator');
        assert.equal(res.body.assigned_to, 'Test Assignee');
        assert.equal(res.body.status_text, 'Test Status');
        done();
      })
  })
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .post('/api/issues/apitest')
    .send({
      issue_title: 'Test Title',
      issue_text: 'Test Text',
      created_by: 'Test Creator'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.issue_title, 'Test Title');
      assert.equal(res.body.issue_text, 'Test Text');
      assert.equal(res.body.created_by, 'Test Creator');
      assert.equal(res.body.assigned_to, '');
      assert.equal(res.body.status_text, '');
      done();
    })
  })

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .post('/api/issues/apitest')
    .send({
      issue_title: 'Test Title',
      issue_text: 'Test Text'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'required field(s) missing');
      done();
    })
  })

  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest')
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      assert.property(res.body[0], 'assigned_to');
      assert.property(res.body[0], 'status_text');
      assert.property(res.body[0], 'open');
      assert.property(res.body[0], '_id');
      assert.property(res.body[0], 'issue_title');
      assert.property(res.body[0], 'issue_text');
      assert.property(res.body[0], 'created_by');
      assert.property(res.body[0], 'created_on');
      assert.property(res.body[0], 'updated_on');
      done();
    })
  })

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest?open=true')
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      assert.property(res.body[0], 'assigned_to');
      assert.property(res.body[0], 'status_text');
      assert.property(res.body[0], 'open');
      assert.property(res.body[0], '_id');
      assert.property(res.body[0], 'issue_title');
      assert.property(res.body[0], 'issue_text');
      assert.property(res.body[0], 'created_by');
      assert.property(res.body[0], 'created_on');
      assert.property(res.body[0], 'updated_on');
      done();
    })
  })

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .get('/api/issues/apitest?open=true&created_by=Test Creator')
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      assert.property(res.body[0], 'assigned_to');
      assert.property(res.body[0], 'status_text');
      assert.property(res.body[0], 'open');
      assert.property(res.body[0], '_id');
      assert.property(res.body[0], 'issue_title');
      assert.property(res.body[0], 'issue_text');
      assert.property(res.body[0], 'created_by');
      assert.property(res.body[0], 'created_on');
      assert.property(res.body[0], 'updated_on');
      done();
    })
  })

  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: _id,
      issue_title: 'Test Title 2'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.result, 'successfully updated');
      assert.equal(res.body._id, _id);
      done();
    })
  })

  test( 'Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: _id,
      issue_title: 'Test Title 3',
      issue_text: 'Test Text 3'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.result, 'successfully updated');
      assert.equal(res.body._id, _id);
      done();
    })
  })

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      issue_title: 'Test Title 3',
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'missing _id');
      done();
    })
  })

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: _id
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'no update field(s) sent');
      assert.equal(res.body._id, _id);
      done();
    })
  })

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .put('/api/issues/apitest')
    .send({
      _id: '656a34193da0fdfd31b214c8',
      issue_title: 'Test Title 3',
      issue_text: 'Test Text 3'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'could not update');
      assert.equal(res.body._id, '656a34193da0fdfd31b214c8');
      done();
    })
  })

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .send({
      _id: _id
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.result, 'successfully deleted');
      assert.equal(res.body._id, _id);
      done();
    })
  })

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .send({
      _id: '656a34193da0fdfd31b214c8'
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'could not delete');
      assert.equal(res.body._id, '656a34193da0fdfd31b214c8');
      done();
    })
  })

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai
    .request(server)
    .keepOpen()
    .delete('/api/issues/apitest')
    .send({
      _id: ''
    })
    .end(function (err, res) {
      assert.equal(res.status, 200);
      assert.equal(res.body.error, 'missing _id');
      done();
    })
  })
  
});