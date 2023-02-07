const getRandomInt = (_max, _min) => {
    return Math.floor(Math.random() * (_max - _min) + _min);
}

const getRandom = _limit => {
    return Math.random() * _limit;
}

export { getRandom, getRandomInt };