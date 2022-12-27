const mongoose = require('mongoose');


const dataSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    text: {
        type: String,
        required: [true, 'Please Enter Text']
    }

},
    {
    timestamps: true
}
)

const Data = mongoose.model('Data', dataSchema)

module.exports = Data;