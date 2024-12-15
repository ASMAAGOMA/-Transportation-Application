import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const tripsAdapter = createEntityAdapter({})

const initialState = tripsAdapter.getInitialState()

export const tripsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPendingTrips: builder.query({
            query: () => '/users/pending-trips',
            transformResponse: responseData => {
                // More robust error handling
                if (!responseData) {
                    console.error('No response data received');
                    return tripsAdapter.setAll(initialState, []);
                }
                
                // Handle both array and object responses
                const trips = Array.isArray(responseData) ? responseData : [responseData];
                
                const loadedTrips = trips.map(trip => {
                    if (!trip) return null;
                    return {
                        ...trip,
                        id: trip._id || trip.id,
                        destination: trip.destination || 'Unknown Destination',
                        // Add other fallback values
                    };
                }).filter(trip => trip !== null);
                
                return tripsAdapter.setAll(initialState, loadedTrips);
            },
            transformErrorResponse: (response, meta, arg) => {
                console.error('Get Pending Trips Error:', response);
                return response;
            },
            providesTags: ['PendingTrip']
        }),
        addPendingTrip: builder.mutation({
            query: tripId => ({
                url: '/users/pending-trips',
                method: 'POST',
                body: { tripId }
            }),
            transformErrorResponse: (response, meta, arg) => {
                // Log the full error for debugging
                console.error('Add Pending Trip Error:', response);
                return response;
            },
            invalidatesTags: ['PendingTrip']
        }),
        removePendingTrip: builder.mutation({
            query: tripId => ({
                url: `/users/pending-trips/${tripId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['PendingTrip']
        }),
        getTrips: builder.query({
            query: () => '/trips',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                if (!responseData || !Array.isArray(responseData)) {
                    return tripsAdapter.setAll(initialState, []);
                }
                const loadedTrips = responseData.map(trip => ({
                    ...trip,
                    id: trip._id || trip.id
                }));
                return tripsAdapter.setAll(initialState, loadedTrips)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Trip', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Trip', id }))
                    ]
                } else return [{ type: 'Trip', id: 'LIST' }]
            }
        }),
        addNewTrip: builder.mutation({
            query: initialTrip => ({
                url: '/trips',
                method: 'POST',
                body: initialTrip
            }),
            invalidatesTags: [{ type: 'Trip', id: "LIST" }]
        }),
        updateTrip: builder.mutation({
            query: trip => ({
                url: '/trips',
                method: 'PATCH',
                body: trip
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Trip', id: arg.id }]
        }),
        deleteTrip: builder.mutation({
            query: id => ({
                url: '/trips',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Trip', id: arg }]
        }),
    }),
})

export const {
    useGetTripsQuery,
    useAddNewTripMutation,
    useUpdateTripMutation,
    useDeleteTripMutation,
    useGetPendingTripsQuery,
    useAddPendingTripMutation,
    useRemovePendingTripMutation
} = tripsApiSlice

// returns the query result object
export const selectTripsResult = tripsApiSlice.endpoints.getTrips.select()

// creates memoized selector
const selectTripsData = createSelector(
    selectTripsResult,
    tripsResult => tripsResult.data
)

export const {
    selectAll: selectAllTrips,
    selectById: selectTripById,
    selectIds: selectTripIds
} = tripsAdapter.getSelectors(state => selectTripsData(state) ?? initialState)