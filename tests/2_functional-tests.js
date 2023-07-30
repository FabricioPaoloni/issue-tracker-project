const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongoose').Types;

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let testId;
    //#1
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/issues/apitest/')
            .send({
                issue_title: 'Automatic Test',
                issue_text: 'Automatic test using chai-http',
                created_by: 'Fabri',
                assigned_to: 'Fabri-s test',
                status_text: 'test iniciated'
            })
            .end((err, res) => {
                testId = res.body._id;
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.issue_title, 'Automatic Test');
                assert.equal(res.body.issue_text, 'Automatic test using chai-http');
                assert.equal(res.body.created_by, 'Fabri');
                assert.equal(res.body.assigned_to, 'Fabri-s test');
                assert.equal(res.body.status_text, 'test iniciated');
                assert.equal(res.body.open, true);
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })


    // #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/issues/apitest/')
            .send({
                issue_title: 'automaticTest',
                issue_text: 'Automatic test using chai-http',
                created_by: 'Fabri',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.issue_title, 'automaticTest');
                assert.equal(res.body.issue_text, 'Automatic test using chai-http');
                assert.equal(res.body.created_by, 'Fabri');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.equal(res.body.open, true);
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })

    // #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/issues/apitest/')
            .send({
                issue_title: 'Automatic Test',
                issue_text: 'Automatic test using chai-http',
                // created_by: 'Fabri',
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'required field(s) missing');
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })

    // #4
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .get('/api/issues/apitest/')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.isArray(res.body);
                // console.log(res.body);
                res.body.map(object => {
                    assert.typeOf(object.issue_title, 'string');
                    assert.typeOf(object.issue_text, 'string');
                    assert.typeOf(object.created_by, 'string');
                    assert.typeOf(object.assigned_to, 'string');
                    assert.typeOf(object.status_text, 'string');
                    assert.typeOf(object.open, 'boolean');
                })
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })

    // #5 
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .get('/api/issues/apitest?crated_by=Fabri')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.isArray(res.body);
                // console.log(res.body);
                res.body.map(object => {
                    assert.typeOf(object.issue_title, 'string');
                    assert.typeOf(object.issue_text, 'string');
                    assert.typeOf(object.created_by, 'string');
                    assert.typeOf(object.assigned_to, 'string');
                    assert.typeOf(object.status_text, 'string');
                    assert.typeOf(object.open, 'boolean');
                    assert.equal(object.created_by, 'Fabri');
                })
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })

    // #6 
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .get('/api/issues/apitest?crated_by=Fabri&issue_title=automaticTest')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.isArray(res.body);
                // console.log(res.body);
                res.body.map(object => {
                    assert.typeOf(object.issue_title, 'string');
                    assert.typeOf(object.issue_text, 'string');
                    assert.typeOf(object.created_by, 'string');
                    assert.typeOf(object.assigned_to, 'string');
                    assert.typeOf(object.status_text, 'string');
                    assert.typeOf(object.open, 'boolean');
                    assert.equal(object.created_by, 'Fabri');
                    assert.equal(object.issue_title, 'automaticTest');

                })
                // assert.typeOf(res.body.created_on, 'date');
                // assert.typeOf(res.body.updated_on, 'date');
                done();
            })
    })

    // #7
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: testId,
                issue_text: 'Issue updated by test.'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, testId);
                done();
            })
    })

    // #8
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: testId,
                issue_title: 'Multiple fields update',
                issue_text: 'Issue updated by test.',
                assigned_to: 'Update multiple fields on an issue test.'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, testId);
                done();
            })
    })

    // #9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                issue_title: 'Multiple fields update',
                issue_text: 'Issue updated by test.',
                assigned_to: 'Update multiple fields on an issue test.'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    })

    // #10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: testId
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, testId);
                done();
            })
    })

    // #11
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .put('/api/issues/apitest')
            .send({
                _id: 'asdasdasdasd',
                issue_title: 'invalid id'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, 'asdasdasdasd');
                done();
            })
    })

    // #12 
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            .send({
                _id: testId
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, testId);
                done();
            })
    })

    // #13
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
        let invalidId = new ObjectId();
        chai.request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            .send({
                _id: `${invalidId}`
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, invalidId);
                done();
            })
    })

    // #14
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
        chai.request(server)
            .keepOpen()
            .delete('/api/issues/apitest')
            // .send({
            // })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.equal(res.body.error, 'missing _id');
                done();
            })
    })
    //#n



});
