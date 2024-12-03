import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (accessToken) => {
    const response = await fetch('http://localhost:3500/auth/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return await response.json();
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        user: null, 
        token: null, 
        isLoggedIn: false,
        persist: false,
        status: 'idle',
        error: null
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, user } = action.payload;
            state.token = accessToken;
            state.user = user; // Add this line
            state.isLoggedIn = true;
            console.log('setCredentials reducer called. New state:', state);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.persist = false;
            state.status = 'idle';
            state.error = null;
        },
        updateUserFavorites: (state, action) => {
            if (state.user) {
                state.user.favorites = action.payload;
            }
        },
        togglePersist: (state) => {
            state.persist = !state.persist;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'succeeded';
                console.log('User data fetched successfully:', state.user);
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.log('Failed to fetch user data:', action.error.message);
            });
    }
});

export const { setCredentials, logOut, togglePersist, updateUserFavorites } = authSlice.actions;

export default authSlice.reducer;

// Selectors to access state
export const selectCurrentUser = (state) => {
    console.log('selectCurrentUser called. Current user:', state.auth.user);
    return state.auth.user;
};

export const selectCurrentToken = (state) => {
    console.log('selectCurrentToken called. Current token:', state.auth.token);
    return state.auth.token;
};

export const selectIsLoggedIn = (state) => {
    console.log('selectIsLoggedIn called. Is logged in:', state.auth.isLoggedIn);
    return state.auth.isLoggedIn;
};
export const selectPersist = (state) => state.auth.persist;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => 
    state.auth.user?.roles.includes('Admin') || false;