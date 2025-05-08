import { createContext, useContext, useEffect, useState } from 'react';
import { getLogger } from '@/utils/logger/logger';
import buildClient from '@/api/build-client';
import { mockUserData } from '@/shared/data/current-user';

const AuthContext = createContext(null);
const logger = getLogger('use-auth');

export function AuthProvider({ children, currentUser: initialUser }) {
    const [currentUser, setCurrentUser] = useState(process.env.NEXT_PUBLIC_isLocal === 'true' ? mockUserData.currentUser : initialUser || null);
    const [loading, setLoading] = useState(!initialUser && process.env.NEXT_PUBLIC_isLocal !== 'true');
    
    useEffect(() => {
        if (!initialUser && process.env.NEXT_PUBLIC_isLocal !== 'true') {
            const fetchUser = async () => {
                try {
                    const client = buildClient();
                    const { data } = await client.get('/api/users/currentuser');
                    logger.info(`AuthProvider - Fetched CurrentUser: ${JSON.stringify(data.currentUser)}`);
                    setCurrentUser(data.currentUser);
                } catch (error) {
                    logger.error('AuthProvider - Error fetching currentUser: ' + error);
                } finally {
                    setLoading(false); // Set loading to false once fetching is complete
                }
            };
            fetchUser();
        } else {
            setLoading(false); // Set loading to false immediately if initialUser is present or using mock data
        }
    }, [initialUser]);
    
    logger.info(`AuthProvider - CurrentUser: ${currentUser?.name}, Env: ${process.env.NEXT_PUBLIC_isLocal}`);
    
    return (
      <AuthContext.Provider value={{ currentUser, loading }}>
          {children}
      </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext in components
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};
