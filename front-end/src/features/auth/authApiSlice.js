import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials, logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserData: builder.query({
            query: () => '/auth/user',
            providesTags: ['User']
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ ...data, persist: true }));
                } catch (err) {
                    console.error('Login failed:', err);
                }
            }
        }),
        register: builder.mutation({
            query: userData => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...userData }
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.error('Logout failed:', err);
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log('Refresh successful, new data:', data);
                    const { accessToken } = data;
                    dispatch(setCredentials({ accessToken }));
                } catch (err) {
                    console.error('Refresh failed:', err);
                }
            }
        }),
        getCurrentUser: builder.query({
            query: () => '/auth/me',
            providesTags: ['User']
        }),
        getPendingTrips: builder.query({
            query: () => `/users/pending-trips`, // Updated endpoint
            providesTags: ['PendingTrips']
        }),
        addPendingTrip: builder.mutation({
            query: (tripId) => ({
                url: `/users/pending-trips`, // Updated endpoint
                method: 'POST',
                body: { tripId }
            }),
            invalidatesTags: ['PendingTrips']
        }),
        removePendingTrip: builder.mutation({
            query: (tripId) => ({
                url: `/users/pending-trips/${tripId}`, // Updated endpoint
                method: 'DELETE',
            }),
            invalidatesTags: ['PendingTrips']
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshMutation,
    useGetCurrentUserQuery,
    useGetPendingTripsQuery,
    useAddPendingTripMutation,
    useRemovePendingTripMutation
} = authApiSlice;