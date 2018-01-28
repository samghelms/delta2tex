import actions from './actions'
import {Formatter, getSpaceFormatting} from './formatter'

const concatObj = {
	insert: {
		insert: (atomNext, atomTop) => ["insert", atomNext+atomTop],
		newline: (atomNext, atomTop) => ["block", {text: atomNext, newlineCt: 1}],
		attributes_block: (atomNext, atomTop) => ["block", {text: atomNext, formatters: atomTop, newlineCt: 0}],
		endfile: (atomNext, atomTop) => ["block", {text: atomNext, newlineCt: 0}],
		attributes_inline: (atomNext, atomTop) => ["insert", atomTop.formatInline(atomNext)],
	},
	block: {
		newline: (atomNext, atomTop) => ["block", {...atomNext, newlineCt: atomNext.newlineCt+1}],
		attributes_block: (atomNext, atomTop) => ["block", {...atomNext, text: atomNext.text, formatters: atomNext.formatters.merge(atomTop) }],
		attributes_inline: (atomNext, atomTop) => ["block", atomTop.formatInline(atomNext)],
		block: (atomNext, atomTop) => {
			const nxtFmtr = atomNext.formatters? atomNext.formatters: new Formatter()
			const topFmtr = atomTop.formatters? atomTop.formatters: new Formatter()
			// const fmtr = nxtFmtr.diff(topFmtr)
			// topFmtr needs to know if it is inside of something already, and nxtFmtr needs to know whether to end blocks or not
			// if inside of something, don't place a new start (remove the formatter)
			const startFmtr = topFmtr.subtract(nxtFmtr)
			// We don't need to place an end statement if the top is a continutation
			const endFmtr = nxtFmtr.subtract(topFmtr)

			const blockLabels = Object.keys(topFmtr.fns).filter(k=>nxtFmtr.fns.hasOwnProperty(k))
			const sep = getSpaceFormatting(blockLabels)(atomNext.newlineCt)

			const text = endFmtr.formatBlock(atomNext.text, "end")+sep+startFmtr.formatBlock(atomTop.text, "start")
			// get remaining formatters
			return ["block", {text:text, formatters: topFmtr, newlineCt: atomTop.newlineCt}]
		},
	},

	attributes_inline: {
		attributes_inline: (atomNext, atomTop) => ["attributes_inline", atomNext.merge(atomTop)],
		insert: (atomNext, atomTop) => ["insert", atomNext.formatInline(atomTop)],
	}
} 

const concat = (nextType, topType) => {
	if (concatObj.hasOwnProperty(nextType)) {
		const inner = concatObj[nextType]
		if(inner.hasOwnProperty(topType)) {
			return concatObj[nextType][topType]
		}
	} 
	throw new Error("sequence ["+nextType+", "+topType+"] not in concat rules")
	return null
}

const combine = (state) => {
	const [topType, atomTop, ] = state.q.pop()
	const [nextType, atomNext, ] = state.q.pop()
	const combined = concat(nextType,topType)(atomNext, atomTop)
	state.q.push(combined)
	return {...state}
}

const shift = (state) => {
	const newAtom = state.delta.shift()
	state.q.push(newAtom)
	return {...state}
}

const end = (state) => {
	let [lastType, lastAtom, ] = state.q.pop()
	if (lastType === "endfile") {
		[lastType, lastAtom, ] = state.q.pop()
	}
	if(lastType !== "block") {throw new Error("last type should be block, incorrect parsing")}

	const endFmtr = lastAtom.formatters? lastAtom.formatters: new Formatter()
	const finalText = endFmtr.formatBlock(lastAtom.text, "end")
	state.q.push(["final", finalText])

	state.finalFlag = true
	return {...state}
}

export const transitionTable = {
	[actions.COMBINE]: combine,
	[actions.SHIFT]: shift,
	[actions.END]: end,
}