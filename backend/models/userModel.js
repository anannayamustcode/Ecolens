import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    cartData: {type: Object, default: {}},

}, {minimize:false})

const userModel = mongoose.model.user || mongoose.model('user', userSchema);

export default userModel;

// User Schema for MongoDB (Mongoose)

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   bio: {
//     type: String,
//     default: '',
//     maxlength: 500
//   },
//   avatarSeed: {
//     type: String,
//     default: function() {
//       return this.name || Math.random().toString(36).substring(2, 10);
//     }
//   },
//   avatarColors: {
//     type: [String],
//     default: ['#1E5128', '#4E9F3D', '#D8E9A8', '#191A19', '#1E5128']
//   },
//   stats: {
//     level: { type: Number, default: 1 },
//     xp: { type: Number, default: 0 },
//     xpToNext: { type: Number, default: 100 },
//     totalScans: { type: Number, default: 0 },
//     ecoScore: { type: String, default: 'C' },
//     sustainableChoices: { type: Number, default: 0 },
//     carbonSaved: { type: Number, default: 0 },
//     waterSaved: { type: Number, default: 0 },
//     treesPlanted: { type: Number, default: 0 },
//     streak: { type: Number, default: 0 },
//     rank: { type: String, default: 'Eco Beginner' },
//     badges: { type: Number, default: 0 },
//     challengesCompleted: { type: Number, default: 0 }
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('User', userSchema);