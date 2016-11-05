import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import AWS from 'aws-sdk';
AWS.config = new AWS.Config({
  accessKeyId: 'AKIAJK4R2PIDJYTBTWFA', secretAccessKey: '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', region: 'us-west-1'
});
var s3 = new AWS.S3();
 
export const Notes = new Mongo.Collection('notes');
Meteor.notes = Notes;

import { HTTP } from 'meteor/http';

Meteor.startup(function () {

  Meteor.publish('presences', function() {
    return Presences.find({}, { userId: true });
  });

  Meteor.publish('users', function () {
    return Meteor.users.find({});
  });

  Meteor.publish('notes', function () {
    return Notes.find({}, {userId: true});
  });

  Meteor.methods({
    'updateRating'({newReviews, _id}) {
      Meteor.users.update(_id,
        { $set: { 'reviews': newReviews } 
      });
    },

    'addNote'({text, userId, date, noteType}) {
      Meteor.notes.insert(
        { 
          'text': text, 
          'userId': userId, 
          'title': date, 
          'noteType': noteType
        }
      )
    },

    'updateNote'({noteId, text, userId, date, noteType}) {
      Meteor.notes.update(noteId,
        { 
          'text': text, 
          'userId': userId, 
          'title': date, 
          'noteType': noteType
        }
      )
    },

    'getVideos'() {
      console.log('yo');
      params = {Bucket: 'invalidmemories', Key: 'arealvid95996.webm'}
      s3.getObject(params, (err, data) => {
        if (err) {
          console.log('err getting vid', err);
        } else {
          console.log('got vid', data);
        }
      });
    }
  });

  WebApp.connectHandlers.use("/token", function(req, res, next) {

    HTTP.post('https://api.cognitive.microsoft.com/sts/v1.0/issueToken', 
      {
        headers: {
          'Ocp-Apim-Subscription-Key': '0b2cbbe3d7fc4dcf816e237665026012',
        },
        data: ""
      }, function(err, resp) {
        if (err) console.log(err);
        res.writeHead(200);
        res.end(resp.content);
    });


  });
});

