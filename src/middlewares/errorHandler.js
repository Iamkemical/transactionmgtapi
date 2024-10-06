const catchAsync = (func) => {
    const handler = (req, res, next) => {
        func(req, res, next).catch(next);
    };

    return handler;
}

module.exports = catchAsync;