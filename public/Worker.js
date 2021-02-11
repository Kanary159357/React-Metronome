self.timerID = null

self.interval = 100

// event handler for Worker.postMessage
self.onmessage = ({ data }) => {
	switch (data.message) {
		case "start":
			self.start()
			break
		case "stop":
			self.stop()
			break
		case "interval":
			self.changeInterval(data.interval)
			break
		case "close":
			self.stop()
			self.close()
			break
	}
}

// starts the timer
self.start = () => {
	console.log('hello');
	self.timerID = setInterval(self.tick, self.interval)
}

// stops the interval
self.stop = () => {
	clearInterval(self.timerID)
    self.timerID = null
}

// stops the timer, changes the interval and starts timer again
self.changeInterval = (interval) => {
	self.interval = interval
	if (timerID) {
		self.stop()
		self.start()
	}
}

// posts the tick message
self.tick = () => {
	postMessage("tick")
}