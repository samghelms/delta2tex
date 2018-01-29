import parser from './src/transitionParser'
import {parserPrep} from './src/preprocessor'
import {header, footer} from './tex/headers'

const parse = (delta) => {
	const deltaCleaned = delta["ops"].flatMap(el=>Object.entries(el).flatMap(parserPrep))
	deltaCleaned.push(["endfile", ""])
	const parsed = parser(deltaCleaned)
	const [label, text] = parsed[0]
	return header.data+text+footer.data
}

module.exports = {
    parse
};