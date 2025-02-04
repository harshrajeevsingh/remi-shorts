import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface Iuser{
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<Iuser>(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
    },
    {timestamps: true}
)

//use function only, not arrow function
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model("User", userSchema);
// model is used to craete a new model while models is an array of all the models associated with this mongoose instance

export default User;    