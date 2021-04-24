module.exports = function(mongoose) {
    
    const postSchema = {
        title: String,
        content: String
    }

    var models = {
        Post: mongoose.model("Post", postSchema)
    }

    return models;
}