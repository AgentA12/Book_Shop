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
        const userData = await User.findOne(
          { _id: context.user._id },
          {}
        ).populate("Book");

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
      const user = await User.create(args);

      const allusers = await User.find({});

      if (!user) {
        new AuthenticationError("Something went wrong");
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, { user }, info) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },

    removeBook: async (parent, { bookId }, { user }, info) => {
      console.log(bookId);
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
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
