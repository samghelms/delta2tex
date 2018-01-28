// import {attributeTypes} from './types'
export class Formatter {
	/*
	TODO: add a method to make sure identical functions don't get added. This
	method will also allow the ability to check whether or not two sections can be combined 
	later on.
	*/
	constructor(fnList = [["none", [(el, argss)=>el, "none"]]]) {
		this.fns = {}
		for(let el of fnList) {
			const [name, fmtrArgs ] = el
			const [fmtr, args] = fmtrArgs
			this.fns[name]=[fmtr, args]
		} 
	}
	merge(otherFmtr) {
		const fns = [...Object.entries(this.fns), ...Object.entries(otherFmtr.fns)]
		return new Formatter(fns)
	}

	add(fn) {
		this.fns = [...this.fns, fn]
	}

	formatInline(text) {
		for (let name of Object.keys(this.fns)) {
			const [fn, args, ] = this.fns[name]
			text = fn(text, args)
		}
		return text
	}

	formatBlock(text, pos) {
		for (let name of Object.keys(this.fns)) {
			const [fn, args, ] = this.fns[name]
			text = fn(text, args, pos)
		}
		return text
	}

	subtract(otherFmtr) {
		/*
		Takes formatters in the other formatter out of this one.
		*/
		const filtered = Object.entries(this.fns).filter((el)=>{
				const [k, v] = el
				return !otherFmtr.fns.hasOwnProperty(k)
			})
		const newFmtr = new Formatter(filtered)
		return newFmtr
	}

}

const codeBlockFormatter = (text, args, pos) => {
	if(pos === "start") {
		return "\\begin{lstlisting}\n"+text
	} else {
		return text+" \n\\end{lstlisting}"
	}	
}

const scriptFormatter = (text, args) => {
	if(args === "super") {
		return "\\textsuperscript{"+text+"}"
	} else if (args === "sub") {
		return "\\textsubscript{"+text+"}"
	} else {
		throw new Error("unknown argument "+args+" to scriptFormatter")
	}
}

const headerFormatter = (text, args) => {
	return "HEADER"+text+"HEADER"
}

const extractVals = (val) => {
	const entries = Object.entries(val)
	if(entries.length !== 1) { throw new Error("invalid val passed to Formatter")}
	return entries[0]
}

const formatters = {
	formula: (value)=>"$$ "+value+" $$",
	'code-block': (value)=> {
		const [name, args] = extractVals(value)
		return new Formatter([[name, [codeBlockFormatter, args]]])
	},
	script: (value)=> {
		const [name, args] = extractVals(value)
		return new Formatter([[name, [scriptFormatter, args]]])
	},
	header: (value)=> {
		const [name, args] = extractVals(value)
		return new Formatter([[name, [headerFormatter, args]]])
	},

}

export const formatter = (key) => {
	if (formatters.hasOwnProperty(key)) {
		return formatters[key]
	} else {
		throw "cannot format type "+key;
	}
}

const newlineFormatters = {
	/*
	Define special rules for spacing within blocks here
	*/
	'_default-space-provider': (newlineNumber)=> "\n\\vspace{"+newlineNumber+"}\n",
	'code-block': (newlineNumber)=> Array.from({length: newlineNumber}, (x,i) => "\n").join("")

}

export const getSpaceFormatting = (keys) => {
	/*
	TODO: update this for nested space formatters (probably not going to be an issue)
	*/
	let key
	const keysFiltered = keys.filter(k=>newlineFormatters.hasOwnProperty(k))
	if(keysFiltered.length > 1) {
		throw new Error("error, have not implemented nested space formatters for getSpaceFormatting() yet")
	} else if(keysFiltered.length === 1 ) {
		key = keys[0]
	} else {
		key = "_default-space-provider"
	}
	if (newlineFormatters.hasOwnProperty(key)) {
		return newlineFormatters[key]
	} else {
		throw new Error("error, with getSpaceFormatting(), check newlineFormatters and program logic")
	}
}
