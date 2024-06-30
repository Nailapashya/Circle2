import { AxiosError } from "axios"

export default function getError(error: unknown) {
    let errorMessage: string = "Unknown Error"

    if (error instanceof AxiosError) {
        if (error.response) {
            error = error.response?.data.message //harusnya disini ada message
        } else {
            errorMessage = error?.message
        }

        return errorMessage
    }

}