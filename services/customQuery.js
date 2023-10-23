exports.customQuery = {
    GET_USER_BY_EMAIL_AND_NUMBER:(email, number) => `email == "${email}" || number == "${number}"`,
    GET_ROW_BY_STRING_ATTRIBUTE_AND_ID:(attribue, Value, idAttribue) => `${attribue} == "${Value}" && ${idAttribue} == $0`,
}