import { API } from "@/utils/api"
import React, { useState } from "react"
import getError from "@/utils/getError"
import { toast } from "react-toastify"

const useRegister = () => {
    const [form, setForm] = useState<IRegister>({
        fullname: "",
        email: "",
        password: "",
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [error, setError] = useState<string>(" ")
    const [isSuccess, setIsSucces] = useState<boolean>(false)

    const handleChange = (Event: React.ChangeEvent<HTMLInputElement>) => (
        setForm({
            ...form,
            [Event.target.name]: Event.target.value,
        })
    )

    const handleRegister = async () => {
        try {
            setIsLoading(true)
            const response = await API.post("register", form)

            toast.success(response.data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })

            setIsError(false)
            setError("")
            setIsSucces(true)
        } catch(error) {
            setIsError(true)
            const err = getError(error)
            setError(err as string)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        form,
        handleChange,
        handleRegister,
        isLoading,
        isError,
        error,
        isSuccess
    }
}

export default useRegister