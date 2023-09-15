exports.customQuery = {
    GET_USER_BY_EMAIL_AND_NUMBER:(email, number) => `email == "${email}" || number == "${number}"`,
}