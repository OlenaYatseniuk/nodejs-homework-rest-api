const STATUSES = {
    401: "Unauthorized",
    404: "Not found"
}

export const createError = (status, message = STATUSES[status]) => {
    const error = new Error(message)
    error.status = status
    return error
}