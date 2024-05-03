import mongoose, {Schema,model} from 'mongoose'

const imageSchema = new Schema ({

    Path: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    //  DIDE: {
    //     type: DataTypes.INTEGER(9),
    //     allowNull: false,
    //     unique: false,
    // },
},{
    timestamps:true,
});
const imageModel = mongoose.models.Image || model('Image', imageSchema);
 export default imageModel ;