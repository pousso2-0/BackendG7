import UserService from '../services/userService.js';

class UserController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }
            if (!password) {
                return res.status(400).json({ message: "Password is required" });
            }
            const authToken = await UserService.register(req.body);
            return res.status(201).json(authToken);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return res.status(400).json({ message: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            const authToken = await UserService.login(email, password);
            res.json(authToken);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    static async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(400).json({ message: "No token provided" });
            }
            const result = await UserService.logout(token);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getUser(req, res) {
        console.log(`Received request to get user with ID: ${req.params.id}`);
        try {
            const user = await UserService.getUserById(req.params.id); // Utiliser l'ID tel quel
            res.json(user);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    static async searchUsers(req, res) {
        try {
          const { name } = req.query;
          if (!name) {
            return res.status(400).json({ message: "Name parameter is required" });
          }
          const users = await UserService.searchUsersByName(name);
          res.json(users);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }

    static async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.id, req.body); // Utiliser l'ID tel quel
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.id); // Utiliser l'ID tel quel
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getCurrentUserProfile(req, res) {
        try {
            const profile = await UserService.getUserProfile(req.userId); // Utiliser l'ID tel quel
            res.json(profile);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    static async getUserProfileById(req, res) {
        try {
            const profile = await UserService.getUserProfile(req.params.id); // Utiliser l'ID tel quel
            if (profile.isPrivate = true) {
                return res.status(403).json({ message: "Private profile" });
            }
            res.json({
                id: profile.id,
                name: profile.name,
                type: profile.type,
                bio: profile.bio,
                location: profile.location,
                gender: profile.gender,
                posts: profile.posts,
                postCount: profile.postCount,
                followersCount: profile.followersCount,
                followingCount: profile.followingCount,
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    

   
   

}

export default  UserController;
