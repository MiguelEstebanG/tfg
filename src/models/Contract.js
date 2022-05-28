import pkg from 'mongoose';
const { Schema, model } = pkg;

const ContractSchema = new Schema(
    {
        job:{type: String, trim: true}, //autorrelleno
        employee:{type: String, trim: true}, //autorrelleno
        employer:{type: String, trim: true}, //autorrelleno
        salary:{type: String, trim: true},
        startDate:{type: String, trim: true},
        duration:{type: String, trim: true},
        typeOfContract:{type: String, trim: true},
        activity:{type: String, trim: true},
        timetable:{type: String, trim: true},
        extraInfo:{type: String, trim: true},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Contract", ContractSchema);