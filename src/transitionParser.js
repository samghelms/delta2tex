import {grammar} from './grammar'
import {transitionTable} from './transitionTable'
import actions from './actions'

const oracle = (state) => {
	/*
	Returns the correct action to take
	*/

	if (state.q.length < 2) {
		if (state.delta.length < 1) {return actions.END}
		return actions.SHIFT
	} 
	let [topType, ] = state.q[state.q.length-1]
	let [prevType, ] = state.q[state.q.length-2]

	// if (state.delta.length < 1) {
	// 	if (topType === "block" && prevType === "block") {
	// 		return actions.END
	// 	}
	// }

	return grammar(prevType, topType)
}

const apply_t = (state, transition) => {
	/*
	Returns the correct action to take
	*/

	return transitionTable[transition](state)
}

const parser = (delta) => {
	// TODO: find a more elegent way of dealing with the root
	let state = {q:[["block", { text: '', newlineCt: 0 }]], delta: delta, finalFlag: false}
	let transition 
	let i = 0
	while(!state.finalFlag) {		
		transition = oracle(state)
		state = apply_t(state, transition)
	}

	return state["q"]
}

export default parser