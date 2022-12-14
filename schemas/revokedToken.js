import { Schema, model } from "mongoose";

const revokedToken = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
})

const RevokedToken = model('revokedToken', revokedToken)

export default RevokedToken