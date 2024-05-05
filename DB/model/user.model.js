import mongoose, {Schema,model} from 'mongoose'

const userSchema = new Schema ({

userName: {
type: String, 
required:true,
min:4,
max:20
},
 email:{
type: String,
required:true,
unique:true,

},
password: {
type: String,
 required:true,},

confirmEmail:{
     type: Boolean,
      default: false,},


role:{ 
    type: String,
    required:true,
      enum: ['HealthcareProfessional', 'Student']
},
sendCode:{
    type:String,
    default:null,
},
changePasswordTime:{
type:Date,
},
},{
    timestamps:true,
});
const userModel = mongoose.models.User || model('User', userSchema);
 export default userModel;