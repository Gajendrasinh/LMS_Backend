const ERROR_CODES = {
    100: {
        status: 400,
        message: 'Not Found'
    },
    101: {
        status: 200,
        message: 'Please provide valid email and password'
    },
    102: {
        status: 422,
        message: 'User already exist'
    }, 
    103: {
        status: 400,
        message: 'You are not authorized to access this route'
    },
    104: {
        status: 422,
        message: 'Email already exist'
    },
    105: {
        status: 400,
        message: 'There is no record with this id'
    },
    106: {
        status: 422,
        message: 'Please provide valid status type for webinar. It should be upcoming, ongoing, completed'
    },
    107: {
        status: 422,
        message: 'Cannot delete particular data because its contains foreign constraints with other data'
    },
    108: {
        status: 422,
        message: 'Cannot register staff to another college.'
    },
    109: {
        status: 422,
        message: 'You cannot view staff details of another college'
    },
    110: {
        status: 422,
        message: 'Please provide ids to delete selected records'
    },
    111: {
        status: 422,
        message: 'Total marks and individual questions marks summation are not equal'
    },
    112: {
        status: 422,
        message: 'You are not able to submit exam because your no of attempts has been exceeded'
    },
    112: {
        status: 422,
        message: 'Please provide category id'
    }
}

module.exports = ERROR_CODES;