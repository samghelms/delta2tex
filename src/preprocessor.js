import {formatter} from './formatter'
import {mappings} from './mappings'

Array.prototype.flatMap = function(lambda) { 
    return Array.prototype.concat.apply([], this.map(lambda))
}

const handleNewLines = (split) => {
	let ret = []
	for (let s of split.slice(0, split.length-1)) {
		if (s !== "") {
			ret.push(["insert", s])
		}
		ret.push(["newline", ""])
	}
	if (split[split.length-1] !== "") {
		ret.push(["insert", split[split.length-1]])
	}
	return ret
}

const processAtom = (key, val) => {
	if (key === "insert") {
		if (typeof val === "string" ) {
			if (val.includes("\n")) {
				const split = val.split(/\n/g)
				return handleNewLines(split)
			} else {
				return [[key, val]]
			}
		} else if(typeof val === "object") {
			if(Object.entries(val).length !== 1) {
				throw new Error("cannot handle insert type ") // TODO: state insert type
			}
			const [objKey, objVal, ] = Object.entries(val)[0]
			return [[key, formatter(objKey)(objVal)]]
		}
	} else if (key === "attributes" && typeof val === "object" ) {
		const [inner_key, _, ] = Object.keys(val)
		return [[mappings(inner_key), formatter(inner_key)(val)]]
	} 

	throw new Error("unkown type of atom")
} 

export const parserPrep = (el) => {
	el = processAtom(...el)
	return el
}