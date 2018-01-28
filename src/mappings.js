

const mapping = {
	"code-block": "attributes_block",
	list: "attributes_block"
}

export const mappings = (label)  => {
	if (mapping.hasOwnProperty(label)) {
		return mapping[label]
	} else {
		return "attributes_inline"
	}
}