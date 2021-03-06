const {default: mongoose} = require("mongoose");
const {CommentSchema} = require("./public.schemas");
const BlogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    overView: {type: String, required: true, maxLength: 50},
    content: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, required: true, ref: "user"},
    image: {type: String, required: true},
    tags: {type: [String], default: []},
    category: {type: mongoose.Types.ObjectId, ref: "category", required: true},
    comments: {type: [CommentSchema], default: []},
    like: {type: [mongoose.Types.ObjectId], ref: "users", default: []},
    dislikes: {type: [mongoose.Types.ObjectId], ref: "users", default: []},
    bookmarks: {type: [mongoose.Types.ObjectId], ref: "users", default: []},
}, {
    id: false,
    versionKey: false,
    toJSON: {
        virtuals: true,

    },
});

BlogSchema.virtual("writer", {
    ref: "user",
    localField: "author",
    foreignField: "_id",
});
BlogSchema.virtual("categoryName", {
        ref: "category",
        localField: "category",
        foreignField: "_id",
        justOne: true,
        options: {
            projection: {
                title: 1,
                children: 0
            },
        }
    }
)
BlogSchema.virtual("imageURL").get(function () {
    return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`;
});

function autoPopulate(next) {
    this.populate([{path: "author", select: {username: 1, email: 1, mobile: 1}}, {
        path: "categoryName",
        select: {title: 1, children: 0}
    }]);
    next()
}

BlogSchema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = {
    BlogModel: mongoose.model("blog", BlogSchema),
};
