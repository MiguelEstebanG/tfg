import pkg from 'mongoose';
const { Schema, model } = pkg;

const InterviewSchema = new Schema(
    {
        job: { type: String, trim: true },
        interviewer: { type: String, required: true, trim: true },
        interviewee: { type: String, trim: true },
        place: { type: String, trim: true },
        date: { type: String, trim: true },
        extraInfo: {type: String},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Interview", InterviewSchema)