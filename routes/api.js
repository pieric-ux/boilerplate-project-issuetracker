'use strict';

const mongoose = require('mongoose');
const Issue = require('../models/Issues.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res) {
      try {
        const project = req.params.project;
        const filterParams = { project };
        
        const queryParams = ['_id', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text'];

        queryParams.forEach((param) => {
          if(req.query[param]) {
            filterParams[param] = req.query[param];
          }
        });

        const issues = await Issue.find(filterParams);

        const result = issues.map((issue) => ({
            assigned_to: issue.assigned_to,
            status_text: issue.status_text,
            open: issue.open,
            _id: issue._id,
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            created_by: issue.created_by,
            created_on: issue.createdAt,
            updated_on: issue.updatedAt
        }));

        res.json(result);
        
      }
      catch (err) {
        console.error(err);
      }
    })
    
    .post(async function (req, res) {
      try {
        const project = req.params.project;
        const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

        if(!issue_title || !issue_text || !created_by) {
          return res.json ({ error: 'required field(s) missing' });
        }

        const issue = await Issue.create({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text
        });

        res.json({
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          open: issue.open,
          _id: issue._id,
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          created_on: issue.createdAt,
          updated_on: issue.updatedAt
        });
      }
      catch (err) {
        console.error(err);
      }
    })
    
    .put(async function (req, res) {
      try {
        const project = req.params.project;
        const _id = req.body._id;

        if(!_id) {
          return res.json({ error: 'missing _id' });
        }

        const updateParams = {};

        const updateFields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'];

        updateFields.forEach((field) => {
          if(req.body[field]) {
            updateParams[field] = req.body[field];
          }
        });

        if(Object.keys(updateParams).length === 0) {
          return res.json({ error: 'no update field(s) sent', '_id': _id });
        }

        const issue = await Issue.findByIdAndUpdate(_id, updateParams, {new: true});

        if(!issue) {
          return res.json({ error: 'could not update', '_id': _id });
        }

        res.json({ result: 'successfully updated', '_id': _id });

      }
      catch (err) {
        console.error(err);
      }
    })
    
    .delete( async function (req, res) {
      try {
        const project = req.params.project;
        const _id = req.body._id;

        if(!_id) {
          return res.json({ error: 'missing _id' });
        }

        const issue = await Issue.findByIdAndDelete(_id);

        if(!issue) {
          return res.json({ error: 'could not delete', '_id': _id });
        }

        res.json( { result: 'successfully deleted', '_id': _id });
      }
      catch (err) {
        console.error(err);
      }
    });
};
