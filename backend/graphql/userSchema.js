var GrQLSchema = require('graphql').GraphQLSchema;
var GrQLObjectType = require('graphql').GraphQLObjectType;
var GrQLList = require('graphql').GraphQLList;
var GrQLNonNull = require('graphql').GraphQLNonNull;
var GrQLID = require('graphql').GraphQLID;
var GrQLString = require('graphql').GraphQLString;
var GrQLBoolean = require('graphql').GraphQLBoolean;
var UserModel = require('../models/User');

var userType = new GrQLObjectType({
    name: 'user',
    fields: function () {
        return {
            _id: {
                type: GrQLString
            },
            username: {
                type: GrQLString
            },
            password: {
                type: GrQLString
            },
            email: {
                type: GrQLString
            }
        }
    }
})

var queryType = new GrQLObjectType({
    name: 'Query',
    fields: function(){
        return {
            users: {
                type: new GrQLList(userType),
                resolve: function(){
                    const users = UserModel.find().exec()
                    if(!users){
                        throw new Error('Error')
                    }
                    return users
                }
            },
            user: {
                type: userType,
                args: {
                    id: {
                        name: '_id',
                        type: GrQLString
                    }
                },
                resolve: function(root, params){
                    const userDetails = UserModel.findById(params.id).exec()
                    if(!userDetails){
                        throw new Error('Error')
                    }
                    return userDetails
                }
            }
        }
    }
})

var mutation = new GrQLObjectType({
    name: 'Mutation',
    fields: function() {
        return {
            signup: {
                type: userType,
                args: {
                    username: { 
                        type: new GrQLNonNull(GrQLString)
                    },
                    password: {
                        type: new GrQLNonNull(GrQLString)
                    },
                    email: {
                        type: new GrQLNonNull(GrQLString)
                    }
                },
                resolve: function (root, params) {
                    const userModel = new UserModel(params);
                    userModel.access = false;
                    const newUser = userModel.save();
                    if (!newUser){
                        throw new Error('Error');
                    }
                    return newUser
                }
            },
            login: {
                type: userType,
                args: {
                    mail: {
                        type: new GrQLNonNull(GrQLString)
                    },
                    pwd: {
                        type: new GrQLNonNull(GrQLString)
                    }
                },
                resolve: function(root, params){
                    const user = UserModel.findOne({email: params.mail}).exec()
                    if(!user){
                        throw new Error('Error')
                    }
                    return user
                }
            }
        }
    }
})

module.exports = new GrQLSchema({query: queryType, mutation: mutation});