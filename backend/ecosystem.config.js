module.exports = {
    apps : [
        {
            name: 'eLearn',
            script: './bin/www',
            watch: false,
            env: {
                'PORT': '80',
                'NODE_ENV': 'production'
            }
        }
    ]
}