
// src/services/userService.js
import bcrypt from "bcrypt";
import Validator from "../utils/Validator.js";
import { addToBlacklist } from "../utils/tokenBlacklist.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Mesure from '../models/Mesure.js';
import MesureService from "../services/mesureService.js";
import Post from "../models/Post.js";

import { ValidationError, DatabaseError } from "../errors/customErrors.js";
import { generateToken } from "../utils/tokenUtils.js";

class UserService {
  static async register(userData) {
    try {
      // Validation des données d'entrée
      const validationResult = Validator.validateUserData(userData);
      if (validationResult.error) {
        throw new ValidationError(validationResult.error.details[0].message);
      }

      const {
        name,
        email,
        password,
        type,
        profilePicture,
        bio,
        location,
        gender,
        phone,
        skills,
      } = userData;
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) throw new ValidationError("Email already in use");

      const existingPhone = await User.findByPhone(phone);
      if (existingPhone) throw new ValidationError("Phone already in use");
      const newUser = await User.create({
        name,
        email,
        password, // Le mot de passe sera haché dans le pré-hook
        type,
        profilePicture,
        bio,
        location,
        gender,
        phone,
        skills,
      });
      const token = generateToken({
        userId: newUser.id,
        type: newUser.type
      });
      return { token };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error; // Laissez passer les erreurs de validation
      }
      throw new DatabaseError(`Registration failed: ${error.message}`); // Autres erreurs
    }
  }

  static async login(email, password) {
    if (!Validator.validateEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    const user = await User.findByEmail(email);
    if (!user) throw new ValidationError("User not found");

    const isMatch = await user.comparePassword(password); // Utilisation de la méthode d'instance
    if (!isMatch) throw new ValidationError("Invalid credentials");

    const token = generateToken({
      userId: user.id,
      type: user.type
    });
    return {token};
  }

  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) throw new ValidationError("User not found");
      return user;
    } catch (error) {
      return null;
    }
  }

  static async updateCredits(userId, amount) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: amount } },
      { new: true }
    );
    if (!user) throw new ValidationError("User not found");
    return user;
  }

  static async upgradeToPremi3um(userId) {
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);

    const user = await User.findById(userId);
    if (!user) throw new ValidationError("User not found");

    if (user.credits < PREMIUM_COST) {
      throw new ValidationError("Not enough credits to upgrade to premium");
    }

    user.subscriptionType = 'premium';
    user.premiumExpiresAt = premiumExpiresAt;
    user.credits = user.credits - PREMIUM_COST + PREMIUM_DEFAULT_CREDITS;

    await user.save();

    return user;
  }

  static async checkAndUpdatePremi3umStatus(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ValidationError("User not found");

    if (user.subscriptionType === 'premium' && user.premiumExpiresAt < new Date()) {
      user.subscriptionType = 'free';
      user.premiumExpiresAt = null;
      await user.save();
    }

    return user;
  }

  static async buyCredits(userId, amount) {
    const creditsToBuy = Math.floor(amount / 100); // 1 crédit = 100F CFA
    return this.updateCredits(userId, creditsToBuy);
  }

  static async updateUser(id, updateData) {
    const validationResult = Validator.validateUserData(updateData);
    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const updatedUser = await User.update(id, updateData);
    if (!updatedUser) throw new ValidationError("User not found");
    return updatedUser;
  }

  static async deleteUser(id) {
    const deletedUser = await User.delete(id);
    if (!deletedUser) throw new ValidationError("User not found");
    return deletedUser;
  }

  static async logout(token) {
    try {
      addToBlacklist(token);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  static async getAllUsers() {
    return User.findAll();
  }

  static async getUserProfile(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ValidationError("User not found");
    }

    // Récupérez les posts de l'utilisateur (vous devez définir comment récupérer les posts)
     const userPosts = await Post.find({ userId: userId }).populate('userId');





    // Créez l'objet de profil
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      bio: user.bio,
      location: user.location,
      gender: user.gender,
      phone: user.phone,
      skills: user.skills,
      posts: userPosts,
      postCount: userPosts.length,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      isPrivate: user.isPrivate,
      notificationsEnabled: user.notificationsEnabled,
      reportCount: user.reportCount,
    };

    if (user.type === 'client') {
      const mesures = await Mesure.findOne({ userId });
      if (mesures) {
        profile.mesures = MesureService.filterMesuresByGender(mesures, user.gender);
      }
    }

    return profile;
  }

 
  

  static async searchUsersByName(name) {
    try {
      const users = await User.find(
        { name: { $regex: name, $options: 'i' } },
        'name profilePicture' // Sélectionnez seulement ces champs
      ).limit(10); // Limitez le nombre de résultats si nécessaire
  
      return users.map(user => ({
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture
      }));
    } catch (error) {
      throw new DatabaseError(`Search failed: ${error.message}`);
    }
  }

}

export default UserService;
