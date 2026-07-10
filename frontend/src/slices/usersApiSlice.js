import { apiSlice } from './apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth',
        method: 'POST',
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: '/auth/profile',
      }),
      providesTags: ['User'],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: '/orders/myorders',
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useGetMyOrdersQuery,
} = usersApiSlice;
