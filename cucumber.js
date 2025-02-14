
module.exports = {
    default: `
        --require test/features/step_definitions/*.js
        --require test/features/*.js
        test/features/**/*.feature
    `
};