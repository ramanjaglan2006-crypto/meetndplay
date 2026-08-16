const User = require('../models/User');
const Connection = require('../models/Connection');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Simple privacy check for location, etc. can be added here
        // E.g., if privacy.locationVisibility === 'Matches only', check connections
        
        let shouldHideLocation = false;
        if (user.privacy?.locationVisibility === 'Private') {
            shouldHideLocation = true;
        } else if (user.privacy?.locationVisibility === 'Matches only') {
            const isConnected = await Connection.findOne({
                $or: [
                    { senderId: req.userId, receiverId: user._id, status: 'accepted' },
                    { senderId: user._id, receiverId: req.userId, status: 'accepted' }
                ]
            });
            if (!isConnected) shouldHideLocation = true;
        }

        const userObj = user.toObject();
        if (shouldHideLocation) {
            delete userObj.location;
            delete userObj.locationName;
        }

        if (user.privacy?.ageVisibility === 'Private') {
            delete userObj.age;
        }

        res.json(userObj);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { bio, age, gender, sports, achievements, teams, interests, availability, preferences, privacy, photos, locationName, lat, lon } = req.body;
        const updateData = {};
        
        if (bio !== undefined) updateData.bio = bio;
        if (age !== undefined) updateData.age = age;
        if (gender !== undefined) updateData.gender = gender;
        if (sports !== undefined) updateData.sports = sports;
        if (achievements !== undefined) updateData.achievements = achievements;
        if (teams !== undefined) updateData.teams = teams;
        if (interests !== undefined) updateData.interests = interests;
        if (availability !== undefined) updateData.availability = availability;
        if (preferences !== undefined) updateData.preferences = preferences;
        if (privacy !== undefined) updateData.privacy = privacy;
        if (photos !== undefined) updateData.photos = photos;
        if (locationName !== undefined) updateData.locationName = locationName;
        
        if (lat !== undefined && lon !== undefined) {
            updateData.location = { type: 'Point', coordinates: [lon, lat] };
        }

        const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true, runValidators: true }).select('-passwordHash');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getDiscoverUsers = async (req, res) => {
    try {
        const { lat, lon, radius = 50000, sport, page = 1 } = req.query;
        const limit = 20;
        const skip = (page - 1) * limit;

        if (!lat || !lon) return res.status(400).json({ error: 'Location required' });

        let query = { 
            _id: { $ne: req.userId }, 
            status: 'active',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        };

        if (sport) query.sports = sport;

        // Progressive expansion could be handled by the frontend passing larger radius if empty
        const users = await User.find(query)
            .select('name photos bio sports skill_level location')
            .skip(skip)
            .limit(limit);

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile, getUserProfile, updateProfile, getDiscoverUsers };
