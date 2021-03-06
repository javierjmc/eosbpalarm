const rankIcons = {
    arrowUp: 'img/arrow-up.png',
    arrowDown: 'img/arrow-down.png',
    minus: 'img/minus.png'
}

const FIRST = 1
const SELECTED_BP_LIMIT = 21

let minute = 1000 * 60
const defaultAlarmTimer = minute * 3 // 3m by default

var favoriteBlockProducerName = 'eosswedenorg'
var favoriteBlockProducerCurrentRanking = 500
var refreshInterval

/**
 * Initializes the dApp.
 * */
function load() {
    getChainState()
    refreshBlockProducers()
    setRefreshInterval(defaultAlarmTimer)
}

/**
 * Sets the refresh refreshInterval
 *
 * @param timeInterval the time interval to create the refresh interval with.
 * */
function setRefreshInterval(timeInterval) {
    refreshInterval = setInterval(() => refreshBlockProducers(), timeInterval)
}

/**
 * Checks the ranking of the following block producer.
 *
 * @param newRank is the rank of the block producer after the refresh interval got triggered.
 * */
function checkRanking(newRank) {
    if (newRank === favoriteBlockProducerCurrentRanking){
        return
    }

    var audio
    if (newRank === FIRST) {
        audio = audios.fly
    } else if (newRank > SELECTED_BP_LIMIT) { //went to standby mode
        audio = audios.standby
    } else if (favoriteBlockProducerCurrentRanking < newRank) { //went down in rank
        audio = audios.down
    } else if (favoriteBlockProducerCurrentRanking > newRank) { //went up in rank
        audio = newRank === SELECTED_BP_LIMIT ? audios.powerUp : audios.levelUp
    }

    playAudio(audio, newRank === FIRST)
    setLastUpdateTime()
}