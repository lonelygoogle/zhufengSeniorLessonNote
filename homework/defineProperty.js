let a = {}
Object.defineProperty(a, 'name', {
	enumerable: false,
	// writable: true,
	configurable: true,
	// value: '黄雨萌',
	get() {
		console.log('get')
		return 1
	},
	set(val) {
		console.log('设置值')
	},
})
a.name = 100
console.log(a.name)
