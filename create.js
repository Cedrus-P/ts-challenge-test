const fs = require('fs')
const readline = require('readline')
const path = require('path')
const request = require('request')

const sourceRootPath =
	'https://cdn.jsdelivr.net/gh/type-challenges/type-challenges/questions'
const requestInstance = request.defaults({
	baseUrl: sourceRootPath
})
function promiseReq(
	url,
	options = {
		proxy: 'http://127.0.0.1:1080'
	}
) {
	return new Promise((resolve, reject) => {
		requestInstance.get(url, options, (err, res) => {
			if (err) {
				reject(err)
			} else {
				resolve(res)
			}
		})
	})
}

const rootDirPath = path.resolve(__dirname, './challenges')
const input = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

input.question(`题目名称：`, async (name) => {
	const targetDirPath = `${rootDirPath}/${name}`
	if (!fs.existsSync(targetDirPath)) {
		fs.mkdirSync(targetDirPath)
	}

	const { body: templateContent } = await promiseReq(`/${name}/template.ts`)
	const { body: testContent } = await promiseReq(`/${name}/test-cases.ts`)

	fs.writeFileSync(`${targetDirPath}/template.ts`, templateContent)
	fs.writeFileSync(`${targetDirPath}/test-case.ts`, testContent)
	input.close()
})
