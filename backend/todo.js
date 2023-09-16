var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    work: String,
    isCompleted: Boolean,
});

var Todo = mongoose.model('Todo', todoSchema);


module.exports= Todo;