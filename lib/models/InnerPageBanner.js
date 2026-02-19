import mongoose from 'mongoose'


const InnerBannerPageSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true
    },
    image: {
        url: String,
        public_id: String,
    },
},
    {
        timestamps: true
    })

const InnerBannerPageModel = mongoose.models.InnerBannerbanner || mongoose.model('InnerBannerbanner', InnerBannerPageSchema);

export default InnerBannerPageModel;