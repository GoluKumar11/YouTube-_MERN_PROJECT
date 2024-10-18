import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema (
        {
          videoFile:{
            type:string, //cloudnery url
            required: true
          },
          thumbnail:{
            type:string, //cloudnery url
            required: true
          },
          title:{
            type:string, //cloudnery url
            required: true
          },
          description:{
            type:string, //cloudnery url
            required: true
          },
          duration:{
            type:number, //cloudnery url
            required: true
          },
          views:{
            type:number,
            default: "0"
          },
          isPublised:{
            type:Boolean,
            default:true
          },
          owner:{
            type: Schema.types.objectId,
            ref:"user"
          }
        },
        {
          timestamps:true
        }
)
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)