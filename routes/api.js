'use strict';
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  project: { type: String },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  created_on: Date,
  updated_on: Date,
  open: Boolean
})

const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      req.query.project = req.params.project;
      let data = await Issue.find(req.query);
      if (data) {
        let mapedData = data.map(obj => {
          let newObj = {
            _id: obj._id,
            issue_title: obj.issue_title,
            issue_text: obj.issue_text,
            created_by: obj.created_by,
            assigned_to: obj.assigned_to,
            status_text: obj.status_text,
            created_on: obj.created_on,
            updated_on: obj.updated_on,
            open: obj.open
          };
          return newObj;
        })
        res.json(mapedData);
      } else {
        res.json({ error: 'Project not found' })
      }
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let obj = req.body;
      // console.log(obj)
      //check for the requiered fields
      if (!obj.issue_title | !obj.issue_text | !obj.created_by) {
        return res.json({ error: "required field(s) missing" });
      }
      let newIssue = new Issue({
        project: project,
        issue_title: obj.issue_title,
        issue_text: obj.issue_text,
        created_by: obj.created_by,
        assigned_to: obj.assigned_to ? obj.assigned_to : "",
        status_text: obj.status_text ? obj.status_text : "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      })
      await newIssue.save()
        .then(savedIssue => {
          res.json({
            _id: savedIssue._id,
            issue_title: savedIssue.issue_title,
            issue_text: savedIssue.issue_text,
            created_by: savedIssue.created_by,
            assigned_to: savedIssue.assigned_to,
            status_text: savedIssue.status_text,
            created_on: savedIssue.created_on,
            updated_on: savedIssue.updated_on,
            open: savedIssue.open
          })
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err })
        })



    })

    .put(async function (req, res) {
      let project = req.params.project;
      let obj = req.body;
      if (!obj._id) {
        return res.json({ error: 'missing _id' })
      }
      if (!obj.issue_title && !obj.issue_text && !obj.created_by && !obj.assigned_to && !obj.status_text && !obj.open) {
        return res.json({ error: 'no update field(s) sent', _id: obj._id });
      }

      let doc = await Issue.findById(obj._id);
      if (!doc) {
        return res.status(500).json({ error: 'could not update', _id: obj._id })
      }
      let objKeysArray = Object.keys(obj);
      for (let i = 0; i < objKeysArray.length; i++) {
        if (obj[objKeysArray[i]]) {
          doc[objKeysArray[i]] = obj[objKeysArray[i]];
        }
      }
      doc.updated_on = new Date();
      await doc.save()
        .then(updatedDoc => {
          res.json({ result: 'successfully updated', _id: updatedDoc._id })
        })
        .catch(err2 => {
          console.log(err2)
          res.status(500).json({ error: 'could not update', _id: obj._id })
        })
    })

    .delete(async function (req, res) {
      let project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: 'missing _id' })
      }

      try {
        let issue = await Issue.findOneAndDelete({ _id: req.body._id });
        if (!issue) {
          return res.status(500).json({ error: 'could not delete', _id: req.body._id });
        }
        res.json({
          result: 'successfully deleted',
          _id: req.body._id
        })
      } catch (err3) {
        res.status(500).json({ error: 'could not delete', _id: req.body._id })
      }


    });

};
