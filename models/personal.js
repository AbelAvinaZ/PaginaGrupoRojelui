const mongoose = require("mongoose");
const Review = require('./review')
const Schema = mongoose.Schema;

const PersonalSchema = new Schema({
    name: String,
    birthdate: String,
    startdate: String,
    workstation: String,
    comment: String,
    location: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

PersonalSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Personal", PersonalSchema)