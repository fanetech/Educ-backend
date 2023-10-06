module.exports.USER_ROLE = {
    founder: 'founder',
    teacher: 'teacher',
    parent: 'parent',
    student: 'student'

}
module.exports.PUPIL_ROLE = ["none", "delegate", "adjunct", "board"];
module.exports.BOOL = [true, false];
module.exports.DIVISION = ['trimester', 'semester', 'others'];
module.exports.DIVISION_VALUE = {trimester: 3, semester: 6, others: 0};
module.exports.ACTORS_ROLE = ['teacher', 'founder', 'accountant'];

//status code
module.exports.STATUS_CODE = {
    SUCCESS: 0,
    UNEXPECTED_ERROR: 1000,
    UNEXPECTED_ERROR_DB: 1001,
    NOT_DATA: 2000,
    DATA_INCORRECT: 2001,
    DATA_REQUIS: 2002,
    DATA_EXIST: 3000,
    NOT_FOUND: 4000,
}

module.exports.SERVER_STATUS = {
    SUCCESS: 200,
    UNEXPECTED_ERROR: 500,
    NOT_FOUND: 404,
    DATA_INCORRECT: 400,
    NOT_DATA: 400,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
}

module.exports.SCHEMA_FIELD = {
    user: "userId",
    school: "schoolId",
    schoolYear: "schoolYearId",
}