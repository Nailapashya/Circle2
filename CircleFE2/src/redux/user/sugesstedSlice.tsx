// Apa itu redux?
// Redux merupokan sebuah package yang membantu mendistribusikan pemanggilan ke seluruh Aplikasi kita

// Contohnya adalah pengeras suara yang berfungsi untuk menyampaikan sebuah informasi secara global
// jadi setiap yang ada di aplikasi dapat menerima informasi tersebut tanpa harus berada dalam ruang yang sama

import { API } from "@/utils/api"
import getError from "@/utils/getError"
import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
// payload action ini tipe dari si redux toolkit yang secara default membawa payload
// createAsyncThunk ini sama aaja fungsinya kaya async, memanggil data secara asinkron dalam pemanggilan API


import { createSlice } from "@reduxjs/toolkit"
// ini untuk ngebuat slice di reduxnya. fungsinya untuk membagi kode agar mudah dikelola


const jwtToken = localStorage.getItem("jwtToken")

type initialStateT = {
    data: UserProfileType | null;
    isLoading: boolean;
    isError: boolean;
    error: string;
}

const initialState: initialStateT = {
    data: null,
    isLoading: true,
    isError: false,
    error: "",
}


export const getSuggested = createAsyncThunk(
    "suggested",
    async (_, { rejectWithValue }) => {

        try {
            const response = await API.get(`getSuggested`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })

            return response.data.data
        } catch (error) {
            return rejectWithValue({ errorMessage: getError(error) })
        }
    }
)

const suggestedSlice = createSlice({
    name: "suggested",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSuggested.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            getSuggested.fulfilled,
            (state, action: PayloadAction<UserProfileType>) => {
                state.data = action.payload;
                state.isLoading = false;
                state.isError = false;
                state.error = "";
            }
        );
        builder.addCase(
            getSuggested.rejected,
            (state, action: PayloadAction<any>) => {
                state.data = null;
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload?.errorMessage || "Unkwown Error"
            }
        );
    }
})

export default suggestedSlice.reducer