var Arrow = require('arrow');
var Model = Arrow.createModel('User', {
    "description": "The registered users.",
    "connector": "memory",
    "fields": {
        "uid": {
            "type": "string",
            "description": "The user id.",
            "required": true
        },
        "city": {
            "type": "string",
            "description": "The users city.",
            "required": true
        },
        "country": {
            "type": "string",
            "description": "The users two character country code.",
            "required": true
        },
        "interest": {
            "type": "string",
            "description": "The category of headline the user is interested in.",
            "default": "Technology",
            "required": true
        }
    },
    "actions": []
});
module.exports = Model;