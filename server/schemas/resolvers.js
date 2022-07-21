const { User } = require("../models/index");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      return User.find({});
    },

    me: async (parent, args, context, info) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).populate(
          "Book"
        );
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    login: async (parent, { email, password }, context, info) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args, context, info) => {
      console.log(args);
      const user = await User.create(args);

      if (!user) {
        new AuthenticationError("Something went wrong");
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { _id, input }, context, info) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: _id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        console.log(updatedUser);
        return updatedUser;
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },

    removeBook: async (parent, { _id, bookId }, context, info) => {
      console.log(_id, bookId);
      const updatedUser = await User.findOneAndUpdate(
        { _id: _id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("could not find user");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;

// mutation {
//   saveBook(_id: "62d99bb47db1b14a00f90b51", input:{
//     authors:["andrew", "harry"]
//     description:"a great book"
//     title:"the adventure"
//     bookId: "sdfklj4834hsdg"
//     image:"https://googleImages/356343gfj4j"
//     link:"http://googlebooks.com?name=theAdventure"

//   }){
//       username
//     _id
//     savedBooks{
//   bookId
//     title}
//     }
//   }
