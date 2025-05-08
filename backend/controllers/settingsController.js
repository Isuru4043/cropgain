// // controllers/settingsController.js
// const UserSettings = require('../models/UserSettings'); // Assuming UserSettings is a MongoDB model

// // Get User Theme
// exports.getUserTheme = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user is authenticated and `req.user` has user info
//     const userSettings = await UserSettings.findOne({ userId });

//     if (!userSettings) {
//       return res.status(404).json({ message: 'Settings not found' });
//     }

//     res.json({ theme: userSettings.theme });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Update User Theme
// exports.updateUserTheme = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user is authenticated
//     const { theme } = req.body; // Get the theme from request body

//     if (!['light', 'dark'].includes(theme)) {
//       return res.status(400).json({ message: 'Invalid theme' });
//     }

//     let userSettings = await UserSettings.findOne({ userId });

//     if (!userSettings) {
//       // Create new settings if they don't exist
//       userSettings = new UserSettings({ userId, theme });
//       await userSettings.save();
//     } else {
//       // Update existing settings
//       userSettings.theme = theme;
//       await userSettings.save();
//     }

//     res.json({ message: 'Theme updated successfully', theme: userSettings.theme });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// controllers/settingsController.js
const UserSettings = require('../models/UserSettings');

exports.updateTheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const { theme } = req.body;

    const userSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { theme },
      { new: true, upsert: true }
    );

    res.json({ theme: userSettings.theme });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTheme = async (req, res) => {
  try {
    const userId = req.user.id;
    const userSettings = await UserSettings.findOne({ userId });
    
    res.json({ theme: userSettings?.theme || 'light' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
