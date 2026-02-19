import mongoose from 'mongoose'

const FinancialHealthUsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    score: {
        type: String,
        required: true
    },
    healthprofile: {
        type: String,
    },
    result: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            default: ""
        },
        mark: {
            type: Number,
            required: true
        }
    }],
    isComplete: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })

const FinancialHealthUsersModel = mongoose.models.FinancialHealthUsers || mongoose.model('FinancialHealthUsers', FinancialHealthUsersSchema);

export default FinancialHealthUsersModel;
