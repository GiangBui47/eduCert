import { clerkClient } from '@clerk/clerk-sdk-node';

export const isAuthenticated = async (req, res, next) => {
    try {
        console.log("check auth with count violation")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        try {
            // Sử dụng networkless verification mới của Clerk
            const payload = await clerkClient.verifyToken(token);
            console.log('Token verification payload:', payload);
            
            if (!payload || !payload.sub) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token payload'
                });
            }
            
            const user = await clerkClient.users.getUser(payload.sub);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            req.user = {
                _id: user.id,
                email: user.emailAddresses[0]?.emailAddress,
                name: `${user.firstName} ${user.lastName}`,
                role: user.publicMetadata.role || 'student'
            };
            next();
        } catch (clerkError) {
            console.error('Clerk verification error:', clerkError);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication error'
        });
    }
};
