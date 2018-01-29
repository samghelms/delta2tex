import actions from './actions'

const grammarObj = {
	block: {
		block: actions.COMBINE,
		newline: actions.COMBINE,
		insert: actions.SHIFT,
		attributes_block: actions.COMBINE,
		attributes_inline: actions.COMBINE,
		endfile: actions.END,
	},
	insert: {
		insert: actions.COMBINE,
		attributes_block: actions.COMBINE,
		newline: actions.COMBINE,
		endfile: actions.COMBINE,
		attributes_inline: actions.COMBINE
	},
	attributes_inline: {
		insert: actions.COMBINE,
		attributes_inline: actions.COMBINE
	},

}

export const grammar = (label1, label2)  => {
	if (grammarObj.hasOwnProperty(label1)) {
		const inner = grammarObj[label1]
		if(inner.hasOwnProperty(label2)) {
			return grammarObj[label1][label2]
		}
	} 
	throw new Error("sequence ["+label1+", "+label2+"] not in grammar")
	return null
}
